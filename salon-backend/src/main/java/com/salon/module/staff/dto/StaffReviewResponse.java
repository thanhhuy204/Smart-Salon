package com.salon.module.staff.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StaffReviewResponse {
    private Long id;
    private Long appointmentId;
    private Long userId;
    private Integer staffId;
    private Byte rating;
    private String comment;
    private LocalDateTime createdAt;
}
