package com.salon.module.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UpdateProfileRequest {

    @NotBlank(message = "Họ tên không được để trống")
    @Size(max = 100, message = "Họ tên không được vượt quá 100 ký tự")
    private String fullName;

    @Pattern(
            regexp = "^0\\d{9}$",
            message = "Số điện thoại không hợp lệ (10 chữ số, bắt đầu bằng 0)"
    )
    private String phone;

    @Size(max = 500, message = "URL ảnh không được vượt quá 500 ký tự")
    private String avatarUrl;
}
