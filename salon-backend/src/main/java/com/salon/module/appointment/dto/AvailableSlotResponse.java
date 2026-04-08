package com.salon.module.appointment.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalTime;

@Data
@Builder
public class AvailableSlotResponse {
    private LocalTime startTime;
    private LocalTime endTime;
    private Boolean isAvailable;
    private String status;
}
