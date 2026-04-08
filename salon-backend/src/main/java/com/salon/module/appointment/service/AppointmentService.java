package com.salon.module.appointment.service;

import com.salon.common.response.PageResponse;
import com.salon.module.appointment.dto.*;

import java.time.LocalDate;
import java.util.List;

public interface AppointmentService {
    // User features
    List<AvailableSlotResponse> getAvailableSlots(LocalDate date, Integer staffId);
    AppointmentResponse createAppointment(Long userId, AppointmentRequest request);
    PageResponse<AppointmentResponse> getUserAppointments(Long userId, String status, int page, int size);
    AppointmentResponse getAppointmentDetail(Long id, Long userId);
    void cancelAppointmentByUser(Long id, Long userId, String reason);
    
    // Admin features
    PageResponse<AppointmentResponse> getAllAppointments(String status, int page, int size);
    AppointmentResponse confirmAppointment(Long id, AppointmentAdminConfirmRequest request);
    void cancelAppointmentByAdmin(Long id, String reason);
    void deleteAppointmentByAdmin(Long id);
    void completeAppointment(Long id);
    void updateStatus(Long id, com.salon.common.enums.AppointmentStatus status, String note);
    void assignStaff(Long id, Integer staffId);
}
