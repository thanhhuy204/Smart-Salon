package com.salon.module.salon_service.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class SalonServiceRequest {
    private Integer categoryId;

    @NotBlank(message = "Tên dịch vụ không được để trống")
    private String name;

    private String description;

    @NotNull(message = "Giá tiền không được để trống")
    @Min(value = 1, message = "Giá tiền phải lớn hơn 0")
    private BigDecimal price;

    @NotNull(message = "Thời gian không được để trống")
    @Min(value = 15, message = "Thời gian thực hiện tối thiểu là 15 phút")
    private Short durationM;
}
