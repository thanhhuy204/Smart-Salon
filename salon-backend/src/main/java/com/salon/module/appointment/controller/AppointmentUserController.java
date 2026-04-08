package com.salon.module.appointment.controller;

import com.salon.common.response.ApiResponse;
import com.salon.common.response.PageResponse;
import com.salon.module.appointment.dto.*;
import com.salon.module.appointment.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/appointments")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class AppointmentUserController {

    private final AppointmentService appointmentService;

    private Long getCurrentUserId() {
        // TODO: Update once Spring Security context is fully handling UserPrincipal
        // For development purpose returning 1L to verify compilation and logic
        return 1L; 
    }

    @GetMapping("/available-slots")
    @PreAuthorize("permitAll()") // Slots can be checked by guest. Remove if strict.
    public ApiResponse<List<AvailableSlotResponse>> getAvailableSlots(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) Integer staffId) {
        return ApiResponse.success(appointmentService.getAvailableSlots(date, staffId));
    }

    @PostMapping
    public ApiResponse<AppointmentResponse> createAppointment(@Valid @RequestBody AppointmentRequest request) {
        return ApiResponse.success(201, "Đặt lịch hẹn thành công", appointmentService.createAppointment(getCurrentUserId(), request));
    }

    @GetMapping("/my-appointments")
    public ApiResponse<PageResponse<AppointmentResponse>> getMyAppointments(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.success(appointmentService.getUserAppointments(getCurrentUserId(), status, page, size));
    }

    @GetMapping("/{id}")
    public ApiResponse<AppointmentResponse> getAppointmentDetail(@PathVariable Long id) {
        return ApiResponse.success(appointmentService.getAppointmentDetail(id, getCurrentUserId()));
    }

    @PutMapping("/{id}/cancel")
    public ApiResponse<Void> cancelAppointment(@PathVariable Long id, @Valid @RequestBody AppointmentCancelRequest request) {
        appointmentService.cancelAppointmentByUser(id, getCurrentUserId(), request.getCancelReason());
        return ApiResponse.success(null);
    }
}
