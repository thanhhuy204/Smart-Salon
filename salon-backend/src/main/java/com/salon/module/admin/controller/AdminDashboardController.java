package com.salon.module.admin.controller;

import com.salon.common.response.ApiResponse;
import com.salon.common.enums.AppointmentStatus;
import com.salon.module.appointment.entity.Appointment;
import com.salon.module.appointment.entity.AppointmentServiceEntity;
import com.salon.module.appointment.repository.AppointmentRepository;
import com.salon.module.salon_service.repository.SalonServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminDashboardController {

    private final AppointmentRepository appointmentRepository;
    private final SalonServiceRepository salonServiceRepository;

    @GetMapping("/stats")
    public ApiResponse<Map<String, Object>> getStats() {
        LocalDate today = LocalDate.now();

        long appointmentsToday = appointmentRepository.countByApptDate(today);
        long pendingAppointments = appointmentRepository.countByStatus(AppointmentStatus.PENDING);
        
        BigDecimal revenueBigDecimal = appointmentRepository.sumRevenueByDate(today);
        long revenueToday = revenueBigDecimal != null ? revenueBigDecimal.longValue() : 0L;
        
        long totalProducts = salonServiceRepository.count();

        List<Appointment> recent = appointmentRepository.findTop10ByApptDateOrderByStartTimeAsc(today);

        List<Map<String, Object>> recentAppointments = recent.stream().map(a -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", a.getId());
            
            String cName = a.getUser().getFullName();
            if (cName == null || cName.isEmpty()) cName = "Khách vãng lai";
            map.put("customerName", cName);
            
            String cPhone = a.getUser().getPhone();
            if (cPhone == null || cPhone.isEmpty()) cPhone = "Không có SĐT";
            map.put("customerPhone", cPhone);
            
            String services = a.getServices().stream()
                    .map(s -> s.getService().getName())
                    .collect(Collectors.joining(" + "));
            map.put("services", services);
            
            map.put("staffName", a.getStaff() != null ? a.getStaff().getFullName() : "Chưa phân công");
            map.put("scheduledAt", a.getApptDate().toString() + "T" + a.getStartTime().toString());
            map.put("status", a.getStatus().name());
            
            return map;
        }).collect(Collectors.toList());

        Map<String, Object> stats = new HashMap<>();
        stats.put("appointmentsToday", appointmentsToday);
        stats.put("pendingAppointments", pendingAppointments);
        stats.put("revenueToday", revenueToday);
        stats.put("totalProducts", totalProducts);
        stats.put("recentAppointments", recentAppointments);
        
        return ApiResponse.success(stats);
    }
}
