package com.salon.module.auth.service.impl;

import com.salon.common.exception.AppException;
import com.salon.common.exception.ErrorCode;
import com.salon.module.auth.dto.*;
import com.salon.module.auth.entity.PasswordResetToken;
import com.salon.module.auth.entity.Role;
import com.salon.module.auth.repository.PasswordResetTokenRepository;
import com.salon.module.auth.repository.RoleRepository;
import com.salon.module.user.entity.User;
import com.salon.module.user.repository.UserRepository;
import com.salon.module.auth.service.AuthService;
import com.salon.module.auth.service.EmailService;
import com.salon.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final EmailService emailService;

    private static final int OTP_EXPIRY_MINUTES = 15;

    // =========================================================
    // ĐĂNG KÝ
    // =========================================================

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        String phone = request.getPhone().trim();

        // Validate confirmPassword
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new AppException(ErrorCode.PASSWORD_MISMATCH);
        }

        // Kiểm tra unique
        if (userRepository.existsByEmail(email)) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }
        if (userRepository.existsByPhone(phone)) {
            throw new AppException(ErrorCode.PHONE_EXISTED);
        }

        // Tìm role USER (role_id = 1, luôn hardcode)
        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new AppException(ErrorCode.INTERNAL_ERROR));

        // Tạo user
        User user = User.builder()
                .fullName(request.getFullName().trim())
                .email(email)
                .phone(phone)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(userRole)
                .isActive(true)
                .build();

        userRepository.save(user);

        // Tạo JWT và trả về
        String token = jwtTokenProvider.generateToken(user.getId(), user.getRole().getName());
        return buildAuthResponse(token, user);
    }

    // =========================================================
    // ĐĂNG NHẬP
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        // Tìm user — cùng message cho "không tìm thấy" và "sai password"
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_CREDENTIALS));

        // Kiểm tra password
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS);
        }

        // Kiểm tra tài khoản có bị khóa không
        if (!user.getIsActive()) {
            throw new AppException(ErrorCode.ACCOUNT_DISABLED);
        }

        String token = jwtTokenProvider.generateToken(user.getId(), user.getRole().getName());
        return buildAuthResponse(token, user);
    }

    // =========================================================
    // QUÊN MẬT KHẨU — BƯỚC 1: GỬI OTP
    // =========================================================

    @Override
    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

        // Xóa các token cũ chưa dùng
        tokenRepository.deleteUnusedByUserId(user.getId());

        // Sinh OTP 6 chữ số
        String otp = String.format("%06d", new SecureRandom().nextInt(1_000_000));
        log.info("============== DEV MỌDE: OTP cho {} là: {} ==============", email, otp);

        PasswordResetToken resetToken = PasswordResetToken.builder()
                .user(user)
                .token(otp)
                .isUsed(false)
                .expiresAt(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES))
                .build();

        tokenRepository.save(resetToken);

        // Gửi email bất đồng bộ — lỗi gửi mail không ảnh hưởng response
        emailService.sendOtpEmail(email, otp);
    }

    // =========================================================
    // QUÊN MẬT KHẨU — BƯỚC 2: XÁC THỰC OTP
    // =========================================================

    @Override
    @Transactional
    public VerifyOtpResponse verifyOtp(VerifyOtpRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

        // Tìm token theo user + otp + chưa dùng
        PasswordResetToken resetToken = tokenRepository
                .findByUserIdAndTokenAndIsUsedFalse(user.getId(), request.getOtp())
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_OTP));

        // Kiểm tra hết hạn
        if (resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new AppException(ErrorCode.INVALID_OTP);
        }

        // Đổi token từ OTP sang UUID reset token, gia hạn thêm 15 phút
        String uuid = UUID.randomUUID().toString();
        resetToken.setToken(uuid);
        resetToken.setExpiresAt(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES));
        tokenRepository.save(resetToken);

        return VerifyOtpResponse.builder()
                .resetToken(uuid)
                .build();
    }

    // =========================================================
    // QUÊN MẬT KHẨU — BƯỚC 3: ĐẶT MẬT KHẨU MỚI
    // =========================================================

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        // Tìm reset token hợp lệ
        PasswordResetToken resetToken = tokenRepository
                .findByTokenAndIsUsedFalse(request.getResetToken())
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_RESET_TOKEN));

        // Kiểm tra hết hạn
        if (resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new AppException(ErrorCode.INVALID_RESET_TOKEN);
        }

        // Cập nhật mật khẩu
        User user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // Đánh dấu token đã dùng
        resetToken.setIsUsed(true);
        tokenRepository.save(resetToken);

        // Gửi email thông báo (side effect, sau khi DB commit)
        emailService.sendPasswordChangedEmail(user.getEmail(), user.getFullName());
    }

    // =========================================================
    // HELPER
    // =========================================================

    private AuthResponse buildAuthResponse(String token, User user) {
        return AuthResponse.builder()
                .accessToken(token)
                .user(UserResponse.from(user))
                .build();
    }
}
