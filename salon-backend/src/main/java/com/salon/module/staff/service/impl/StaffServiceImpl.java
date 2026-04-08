package com.salon.module.staff.service.impl;

import com.salon.common.enums.AppointmentStatus;
import com.salon.common.exception.AppException;
import com.salon.common.exception.ErrorCode;
import com.salon.module.appointment.entity.Appointment;
import com.salon.module.appointment.repository.AppointmentRepository;
import com.salon.module.staff.dto.*;
import com.salon.module.staff.entity.Staff;
import com.salon.module.staff.entity.StaffBlockedSlot;
import com.salon.module.staff.entity.StaffReview;
import com.salon.module.staff.mapper.StaffBlockedSlotMapper;
import com.salon.module.staff.mapper.StaffMapper;
import com.salon.module.staff.repository.StaffBlockedSlotRepository;
import com.salon.module.staff.repository.StaffRepository;
import com.salon.module.staff.repository.StaffReviewRepository;
import com.salon.module.staff.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StaffServiceImpl implements StaffService {

    private final StaffRepository staffRepository;
    private final StaffBlockedSlotRepository staffBlockedSlotRepository;
    private final StaffReviewRepository staffReviewRepository;
    private final AppointmentRepository appointmentRepository;
    
    private final StaffMapper staffMapper;
    private final StaffBlockedSlotMapper staffBlockedSlotMapper;

    @Override
    @Transactional(readOnly = true)
    public List<StaffResponse> getAllStaffs() {
        return staffRepository.findAll().stream()
                .map(this::mapStaffToResponseWithStats)
                .collect(Collectors.toList());
    }
    
    private StaffResponse mapStaffToResponseWithStats(Staff staff) {
        StaffResponse response = staffMapper.toResponse(staff);
        List<StaffReview> reviews = staffReviewRepository.findByStaffId(staff.getId());
        double avgRating = reviews.stream().mapToInt(StaffReview::getRating).average().orElse(0.0);
        response.setAverageRating(Math.round(avgRating * 10.0) / 10.0);
        
        response.setTotalCompletedAppointments(reviews.size()); // temporary approximation
        return response;
    }

    @Override
    @Transactional
    public StaffResponse createStaff(StaffRequest request) {
        Staff staff = staffMapper.toEntity(request);
        staff.setIsActive(true);
        staff = staffRepository.save(staff);
        return mapStaffToResponseWithStats(staff);
    }

    @Override
    @Transactional
    public StaffResponse updateStaff(Integer id, StaffRequest request) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.STAFF_NOT_FOUND));
        staffMapper.updateEntityFromRequest(request, staff);
        staff = staffRepository.save(staff);
        return mapStaffToResponseWithStats(staff);
    }

    @Override
    @Transactional
    public void updateStaffStatus(Integer id, Boolean isActive) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.STAFF_NOT_FOUND));
        staff.setIsActive(isActive);
        staffRepository.save(staff);
    }

    @Override
    public StaffPerformanceResponse getStaffPerformance(Integer id) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.STAFF_NOT_FOUND));
                
        List<StaffReview> reviews = staffReviewRepository.findByStaffId(staff.getId());
        double avgRating = reviews.stream().mapToInt(StaffReview::getRating).average().orElse(0.0);
        
        StaffPerformanceResponse response = new StaffPerformanceResponse();
        response.setStaffId(staff.getId());
        response.setFullName(staff.getFullName());
        response.setTotalCompletedAppointments(reviews.size());
        response.setAverageRating(Math.round(avgRating * 10.0) / 10.0);
        
        return response;
    }

    @Override
    @Transactional
    public StaffBlockedSlotResponse addBlockedSlot(Integer staffId, StaffBlockedSlotRequest request) {
        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new AppException(ErrorCode.STAFF_NOT_FOUND));
                
        // Check if there are appointments in this time. 
        List<Appointment> conflicts = appointmentRepository.findByStaffIdAndApptDateAndStatusIn(
                staffId, request.getBlockDate(), List.of(AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED));
                
        boolean hasConflict = conflicts.stream().anyMatch(a -> 
            (request.getStartTime().isBefore(a.getEndTime()) && request.getEndTime().isAfter(a.getStartTime()))
        );
        
        if (hasConflict) {
            throw new AppException(ErrorCode.STAFF_HAS_APPOINTMENT);
        }

        StaffBlockedSlot slot = staffBlockedSlotMapper.toEntity(request);
        slot.setStaff(staff);
        slot = staffBlockedSlotRepository.save(slot);
        return staffBlockedSlotMapper.toResponse(slot);
    }

    @Override
    @Transactional
    public void removeBlockedSlot(Integer slotId) {
        staffBlockedSlotRepository.deleteById(slotId);
    }
}
