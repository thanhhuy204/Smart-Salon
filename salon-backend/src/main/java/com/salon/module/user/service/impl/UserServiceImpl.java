package com.salon.module.user.service.impl;

import com.salon.common.exception.AppException;
import com.salon.common.exception.ErrorCode;
import com.salon.module.user.entity.User;
import com.salon.module.user.repository.UserRepository;
import com.salon.module.user.dto.ChangePasswordRequest;
import com.salon.module.user.dto.UpdateProfileRequest;
import com.salon.module.user.dto.UserProfileResponse;
import com.salon.module.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getMyProfile(Long userId) {
        return UserProfileResponse.from(findById(userId));
    }

    @Override
    @Transactional
    public UserProfileResponse updateProfile(Long userId, UpdateProfileRequest request) {
        User user = findById(userId);

        String newPhone = request.getPhone();
        if (newPhone != null && !newPhone.isBlank()) {
            if (userRepository.existsByPhoneAndIdNot(newPhone, userId)) {
                throw new AppException(ErrorCode.PHONE_EXISTED);
            }
            user.setPhone(newPhone);
        }

        user.setFullName(request.getFullName().trim());

        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl().isBlank() ? null : request.getAvatarUrl().trim());
        }

        userRepository.save(user);
        return UserProfileResponse.from(user);
    }

    @Override
    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            throw new AppException(ErrorCode.PASSWORD_MISMATCH);
        }

        User user = findById(userId);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new AppException(ErrorCode.WRONG_PASSWORD);
        }

        if (passwordEncoder.matches(request.getNewPassword(), user.getPasswordHash())) {
            throw new AppException(ErrorCode.SAME_PASSWORD);
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private User findById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));
    }
}
