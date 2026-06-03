package com.salon.module.staff.service;

import com.salon.module.staff.dto.StaffReviewRequest;
import com.salon.module.staff.dto.StaffReviewResponse;

public interface StaffReviewService {
    StaffReviewResponse createReview(Long userId, StaffReviewRequest request);
    StaffReviewResponse getReviewByAppointmentId(Long userId, Long appointmentId);
}
