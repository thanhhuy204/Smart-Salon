package com.salon.common.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // ===== Validation =====
    VALIDATION_ERROR(400, "Dữ liệu không hợp lệ"),
    PASSWORD_MISMATCH(400, "Mật khẩu xác nhận không khớp"),

    // ===== Auth =====
    EMAIL_EXISTED(409, "Email này đã được sử dụng"),
    PHONE_EXISTED(409, "Số điện thoại này đã được sử dụng"),
    INVALID_CREDENTIALS(401, "Email hoặc mật khẩu không chính xác"),
    ACCOUNT_DISABLED(403, "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ"),
    ACCOUNT_NOT_FOUND(404, "Không tìm thấy tài khoản với email này"),

    // ===== OTP / Reset password =====
    INVALID_OTP(400, "Mã OTP không đúng hoặc đã hết hạn"),
    INVALID_RESET_TOKEN(400, "Phiên đặt lại mật khẩu không hợp lệ hoặc đã hết hạn"),

    // ===== User profile =====
    WRONG_PASSWORD(400, "Mật khẩu hiện tại không chính xác"),
    SAME_PASSWORD(400, "Mật khẩu mới không được trùng với mật khẩu hiện tại"),

    // ===== Security =====
    UNAUTHENTICATED(401, "Vui lòng đăng nhập"),
    TOKEN_EXPIRED(401, "Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại"),
    FORBIDDEN(403, "Bạn không có quyền truy cập khu vực này"),

    // ===== General =====
    NOT_FOUND(404, "Không tìm thấy dữ liệu"),
    INTERNAL_ERROR(500, "Lỗi hệ thống, vui lòng thử lại");

    private final int status;
    private final String message;
}
