package com.salon.module.auth.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    public void sendOtpEmail(String toEmail, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("[Salon] Mã xác thực đặt lại mật khẩu");
            message.setText("""
                    Xin chào,

                    Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản Salon.

                    Mã OTP của bạn là: %s

                    Mã có hiệu lực trong 15 phút. Không chia sẻ mã này với bất kỳ ai.

                    Nếu bạn không yêu cầu điều này, hãy bỏ qua email này.

                    Trân trọng,
                    Đội ngũ Salon
                    """.formatted(otp));
            mailSender.send(message);
            log.info("OTP email sent to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send OTP email to {}: {}", toEmail, e.getMessage());
        }
    }

    @Async
    public void sendPasswordChangedEmail(String toEmail, String fullName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("[Salon] Mật khẩu đã được thay đổi");
            message.setText("""
                    Xin chào %s,

                    Mật khẩu tài khoản của bạn đã được thay đổi thành công.

                    Nếu bạn không thực hiện thay đổi này, hãy liên hệ hỗ trợ ngay lập tức.

                    Trân trọng,
                    Đội ngũ Salon
                    """.formatted(fullName));
            mailSender.send(message);
            log.info("Password changed email sent to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send password changed email to {}: {}", toEmail, e.getMessage());
        }
    }
}
