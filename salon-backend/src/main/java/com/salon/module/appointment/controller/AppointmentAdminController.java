package com.salon.module.appointment.controller;

import com.salon.common.response.ApiResponse;
import com.salon.module.appointment.dto.*;
import com.salon.module.appointment.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/appointments")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AppointmentAdminController {

    private final AppointmentService appointmentService;

    @GetMapping
    public ApiResponse<com.salon.common.response.PageResponse<AppointmentResponse>> getAllAppointments(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.success(appointmentService.getAllAppointments(status, page, size));
    }

    @PutMapping("/{id}/confirm")
    public ApiResponse<AppointmentResponse> confirmAppointment(@PathVariable Long id, @Valid @RequestBody AppointmentAdminConfirmRequest request) {
        return ApiResponse.success(appointmentService.confirmAppointment(id, request));
    }

    @PutMapping("/{id}/cancel")
    public ApiResponse<Void> cancelAppointment(@PathVariable Long id, @Valid @RequestBody AppointmentCancelRequest request) {
        appointmentService.cancelAppointmentByAdmin(id, request.getCancelReason());
        return ApiResponse.success(null);
    }
    
    @PutMapping("/{id}/status")
    public ApiResponse<Void> updateStatus(@PathVariable Long id, @RequestBody AppointmentStatusRequest request) {
        appointmentService.updateStatus(id, request.getStatus(), request.getNote());
        return ApiResponse.success(null);
    }

    @PutMapping("/{id}/assign")
    public ApiResponse<Void> assignStaff(@PathVariable Long id, @RequestBody AppointmentAssignRequest request) {
        appointmentService.assignStaff(id, request.getStaffId());
        return ApiResponse.success(null);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointmentByAdmin(id);
        return ApiResponse.success(null);
    }
}
