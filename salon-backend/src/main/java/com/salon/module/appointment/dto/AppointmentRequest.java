package com.salon.module.appointment.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
public class AppointmentRequest {
    @NotEmpty(message = "Danh sách dịch vụ không được để trống")
    private List<Integer> serviceIds;

    // Optional, if null = "Bất kỳ thợ nào"
    private Integer staffId;

    @NotNull(message = "Ngày đặt lịch không được để trống")
    private LocalDate apptDate;

    @NotNull(message = "Giờ đặt không được để trống")
    private LocalTime startTime;

    private String note;
}
