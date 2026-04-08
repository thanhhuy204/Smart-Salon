package com.salon.module.appointment.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AppointmentCancelRequest {
    @NotBlank(message = "Vui lòng nhập lý do hủy lịch")
    private String cancelReason;
}
