package com.salon.module.staff.dto;

import lombok.Data;

@Data
public class StaffPerformanceResponse {
    private Integer staffId;
    private String fullName;
    private Integer totalCompletedAppointments;
    private Double averageRating;
}
