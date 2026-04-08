package com.salon.module.staff.dto;

import lombok.Data;

@Data
public class StaffResponse {
    private Integer id;
    private String fullName;
    private String phone;
    private String avatarUrl;
    private String bio;
    private Boolean isActive;
    
    // For aggregate representation
    private Double averageRating;
    private Integer totalCompletedAppointments;
}
