package com.salon.module.staff.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StaffReviewRequest {
    @NotNull(message = "Lịch hẹn không được để trống")
    private Long appointmentId;

    @NotNull(message = "Điểm đánh giá không được để trống")
    @Min(value = 1, message = "Điểm đánh giá thấp nhất là 1")
    @Max(value = 5, message = "Điểm đánh giá cao nhất là 5")
    private Byte rating;

    private String comment;
}
