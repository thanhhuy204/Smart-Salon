package com.salon.module.appointment.dto;

import com.salon.common.enums.AppointmentStatus;
import lombok.Data;

@Data
public class AppointmentStatusRequest {
    private AppointmentStatus status;
    private String note;
}
