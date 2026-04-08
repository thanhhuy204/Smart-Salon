package com.salon.module.salon_service.dto;

import lombok.Data;

@Data
public class ServiceCategoryResponse {
    private Integer id;
    private String name;
    private Byte sortOrder;
    private Boolean isActive;
}
