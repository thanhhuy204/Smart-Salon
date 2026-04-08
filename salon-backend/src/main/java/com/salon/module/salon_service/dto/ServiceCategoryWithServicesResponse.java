package com.salon.module.salon_service.dto;

import lombok.Data;
import java.util.List;

@Data
public class ServiceCategoryWithServicesResponse {
    private Integer categoryId;
    private String categoryName;
    private Boolean isActive;
    private Byte sortOrder;
    private List<SalonServiceResponse> services;
}
