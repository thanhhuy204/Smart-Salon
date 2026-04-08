package com.salon.module.salon_service.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ServiceCategoryRequest {
    @NotBlank(message = "Tên danh mục không được để trống")
    private String name;
    
    private Byte sortOrder;
    private Boolean isActive;
}
