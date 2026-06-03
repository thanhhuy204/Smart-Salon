package com.salon.module.staff.controller;

import com.salon.common.response.ApiResponse;
import com.salon.module.staff.dto.StaffReviewRequest;
import com.salon.module.staff.dto.StaffReviewResponse;
import com.salon.module.staff.service.StaffReviewService;
import com.salon.security.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/staff-reviews")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class StaffReviewController {

    private final StaffReviewService staffReviewService;

    private Long getCurrentUserId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof CustomUserDetails) {
            return ((CustomUserDetails) principal).getUser().getId();
        }
        return 1L; // Fallback cho môi trường test/dev nếu SecurityContext rỗng
    }

    @PostMapping
    public ApiResponse<StaffReviewResponse> createReview(@Valid @RequestBody StaffReviewRequest request) {
        return ApiResponse.success(201, "Gửi đánh giá stylist thành công", 
                staffReviewService.createReview(getCurrentUserId(), request));
    }

    @GetMapping("/appointment/{appointmentId}")
    public ApiResponse<StaffReviewResponse> getReviewByAppointmentId(@PathVariable Long appointmentId) {
        return ApiResponse.success(staffReviewService.getReviewByAppointmentId(getCurrentUserId(), appointmentId));
    }
}
