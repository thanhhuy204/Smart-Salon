package com.salon.module.salon_service.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class SalonServiceResponse {
    private Integer id;
    private Integer categoryId;
    private String categoryName;
    private String name;
    private String description;
    private BigDecimal price;
    private Short durationM;
    private Boolean isActive;
}
