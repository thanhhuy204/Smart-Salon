package com.salon.module.staff.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class StaffRequest {
    @NotBlank(message = "Tên nhân viên không được để trống")
    private String fullName;
    private String phone;
    private String avatarUrl;
    private String bio;
}
