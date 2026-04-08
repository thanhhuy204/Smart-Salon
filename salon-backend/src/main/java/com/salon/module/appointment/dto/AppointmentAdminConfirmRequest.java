package com.salon.module.appointment.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AppointmentAdminConfirmRequest {
    @NotNull(message = "Vui lòng chọn thợ để xác nhận lịch")
    private Integer staffId;
}
