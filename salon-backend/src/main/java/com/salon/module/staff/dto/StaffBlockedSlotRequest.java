package com.salon.module.staff.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class StaffBlockedSlotRequest {
    @NotNull(message = "Ngày khóa không được để trống")
    private LocalDate blockDate;

    @NotNull(message = "Giờ bắt đầu không được để trống")
    private LocalTime startTime;

    @NotNull(message = "Giờ kết thúc không được để trống")
    private LocalTime endTime;

    private String note;
}
