package com.salon.module.appointment.service.impl;

import com.salon.common.enums.AppointmentStatus;
import com.salon.common.enums.CancelledBy;
import com.salon.common.exception.AppException;
import com.salon.common.exception.ErrorCode;
import com.salon.common.response.PageResponse;
import com.salon.module.appointment.dto.*;
import com.salon.module.appointment.entity.Appointment;
import com.salon.module.appointment.entity.AppointmentServiceEntity;
import com.salon.module.appointment.entity.SalonWorkingHour;
import com.salon.module.appointment.mapper.AppointmentMapper;
import com.salon.module.appointment.repository.AppointmentRepository;
import com.salon.module.appointment.repository.AppointmentServiceEntityRepository;
import com.salon.module.appointment.repository.SalonWorkingHourRepository;
import com.salon.module.appointment.service.AppointmentService;
import com.salon.module.salon_service.entity.SalonService;
import com.salon.module.salon_service.repository.SalonServiceRepository;
import com.salon.module.staff.entity.Staff;
import com.salon.module.staff.entity.StaffBlockedSlot;
import com.salon.module.staff.repository.StaffBlockedSlotRepository;
import com.salon.module.staff.repository.StaffRepository;
import com.salon.module.user.entity.User;
import com.salon.module.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final AppointmentServiceEntityRepository appointmentServiceEntityRepository;
    private final SalonServiceRepository salonServiceRepository;
    private final StaffRepository staffRepository;
    private final UserRepository userRepository;
    private final SalonWorkingHourRepository salonWorkingHourRepository;
    private final StaffBlockedSlotRepository staffBlockedSlotRepository;
    private final AppointmentMapper appointmentMapper;

    @Override
    public List<AvailableSlotResponse> getAvailableSlots(LocalDate date, Integer staffId) {
        Byte dayOfWeek = (byte) date.getDayOfWeek().getValue();
        SalonWorkingHour workingHour = salonWorkingHourRepository.findByDayOfWeek(dayOfWeek)
                .orElse(null);

        if (workingHour == null || !workingHour.getIsOpen()) {
            return List.of();
        }

        List<AvailableSlotResponse> slots = new ArrayList<>();
        LocalTime currentSlotTime = workingHour.getOpenTime();
        LocalTime closeTime = workingHour.getCloseTime();

        while (currentSlotTime.plusMinutes(workingHour.getSlotDurationM()).isBefore(closeTime) || 
               currentSlotTime.plusMinutes(workingHour.getSlotDurationM()).equals(closeTime)) {
            slots.add(AvailableSlotResponse.builder()
                    .startTime(currentSlotTime)
                    .endTime(currentSlotTime.plusMinutes(workingHour.getSlotDurationM()))
                    .isAvailable(true)
                    .status("AVAILABLE")
                    .build());
            currentSlotTime = currentSlotTime.plusMinutes(workingHour.getSlotDurationM());
        }

        if (staffId != null) {
            List<Appointment> bookedAppointments = appointmentRepository
                    .findByStaffIdAndApptDateAndStatusIn(staffId, date, List.of(AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED));
            
            List<StaffBlockedSlot> blockedSlots = staffBlockedSlotRepository
                    .findByStaffIdAndBlockDate(staffId, date);

            for (AvailableSlotResponse slot : slots) {
                boolean isBlocked = blockedSlots.stream().anyMatch(b ->
                        (slot.getStartTime().isBefore(b.getEndTime()) && slot.getEndTime().isAfter(b.getStartTime()))
                );
                
                boolean isBooked = bookedAppointments.stream().anyMatch(a ->
                        (slot.getStartTime().isBefore(a.getEndTime()) && slot.getEndTime().isAfter(a.getStartTime()))
                );

                if (isBlocked) {
                    slot.setIsAvailable(false);
                    slot.setStatus("BLOCKED");
                } else if (isBooked) {
                    slot.setIsAvailable(false);
                    slot.setStatus("BOOKED");
                }
            }
        }

        return slots;
    }

    @Override
    @Transactional
    public AppointmentResponse createAppointment(Long userId, AppointmentRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        Staff staff = null;
        if (request.getStaffId() != null) {
            staff = staffRepository.findById(request.getStaffId())
                    .orElseThrow(() -> new AppException(ErrorCode.STAFF_NOT_FOUND));
            
            List<AvailableSlotResponse> availableSlots = getAvailableSlots(request.getApptDate(), request.getStaffId());
            boolean isSlotAvailable = availableSlots.stream().anyMatch(s ->
                    s.getStartTime().equals(request.getStartTime()) && s.getIsAvailable()
            );
            if (!isSlotAvailable) {
                throw new AppException(ErrorCode.SLOT_UNAVAILABLE);
            }
        }

        List<SalonService> selectedServices = salonServiceRepository.findAllById(request.getServiceIds());
        if (selectedServices.isEmpty()) {
            throw new AppException(ErrorCode.SERVICE_NOT_FOUND);
        }

        int totalDuration = selectedServices.stream().mapToInt(SalonService::getDurationM).sum();
        BigDecimal totalPrice = selectedServices.stream()
                .map(SalonService::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Appointment appointment = Appointment.builder()
                .user(user)
                .staff(staff)
                .apptDate(request.getApptDate())
                .startTime(request.getStartTime())
                .endTime(request.getStartTime().plusMinutes(totalDuration))
                .totalPrice(totalPrice)
                .status(AppointmentStatus.PENDING)
                .note(request.getNote())
                .services(new ArrayList<>())
                .build();

        for (SalonService service : selectedServices) {
            AppointmentServiceEntity ase = AppointmentServiceEntity.builder()
                    .appointment(appointment)
                    .service(service)
                    .priceSnapshot(service.getPrice())
                    .build();
            appointment.getServices().add(ase);
        }

        appointment = appointmentRepository.save(appointment);
        return appointmentMapper.toResponse(appointment);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<AppointmentResponse> getUserAppointments(Long userId, String status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Appointment> appointmentPage;
        
        if (status == null || status.isBlank()) {
            appointmentPage = appointmentRepository.findByUserIdAndStatusIn(userId, List.of(
                    AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED, AppointmentStatus.IN_PROGRESS,
                    AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED
            ), pageable);
        } else {
            appointmentPage = appointmentRepository.findByUserIdAndStatus(userId, AppointmentStatus.valueOf(status.toUpperCase()), pageable);
        }

        List<AppointmentResponse> content = appointmentPage.getContent().stream()
                .map(appointmentMapper::toResponse)
                .collect(Collectors.toList());

        return PageResponse.<AppointmentResponse>builder()
                .content(content)
                .page(appointmentPage.getNumber())
                .size(appointmentPage.getSize())
                .totalElements(appointmentPage.getTotalElements())
                .totalPages(appointmentPage.getTotalPages())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public AppointmentResponse getAppointmentDetail(Long id, Long userId) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.APPOINTMENT_NOT_FOUND));

        if (userId != null && !appointment.getUser().getId().equals(userId)) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }

        return appointmentMapper.toResponse(appointment);
    }

    @Override
    @Transactional
    public void cancelAppointmentByUser(Long id, Long userId, String reason) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.APPOINTMENT_NOT_FOUND));

        if (!appointment.getUser().getId().equals(userId)) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }

        if (appointment.getStatus() != AppointmentStatus.PENDING) {
            throw new AppException(ErrorCode.INVALID_APPOINTMENT_STATUS);
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointment.setCancelledBy(CancelledBy.USER);
        appointment.setCancelReason(reason);
        appointmentRepository.save(appointment);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<AppointmentResponse> getAllAppointments(String status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Appointment> appointmentPage;
        
        if (status == null || status.isBlank()) {
            appointmentPage = appointmentRepository.findAll(pageable);
        } else {
            appointmentPage = appointmentRepository.findByStatus(AppointmentStatus.valueOf(status.toUpperCase()), pageable);
        }

        List<AppointmentResponse> content = appointmentPage.getContent().stream()
                .map(appointmentMapper::toResponse)
                .collect(Collectors.toList());

        return PageResponse.<AppointmentResponse>builder()
                .content(content)
                .page(appointmentPage.getNumber())
                .size(appointmentPage.getSize())
                .totalElements(appointmentPage.getTotalElements())
                .totalPages(appointmentPage.getTotalPages())
                .build();
    }

    @Override
    @Transactional
    public AppointmentResponse confirmAppointment(Long id, AppointmentAdminConfirmRequest request) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.APPOINTMENT_NOT_FOUND));

        if (appointment.getStatus() != AppointmentStatus.PENDING) {
            throw new AppException(ErrorCode.INVALID_APPOINTMENT_STATUS);
        }

        if (appointment.getStaff() == null) {
            if (request.getStaffId() == null) {
                throw new AppException(ErrorCode.STAFF_REQUIRED_FOR_CONFIRM);
            }
            Staff staff = staffRepository.findById(request.getStaffId())
                    .orElseThrow(() -> new AppException(ErrorCode.STAFF_NOT_FOUND));
            appointment.setStaff(staff);
        }

        appointment.setStatus(AppointmentStatus.CONFIRMED);
        appointment = appointmentRepository.save(appointment);
        return appointmentMapper.toResponse(appointment);
    }

    @Override
    @Transactional
    public void cancelAppointmentByAdmin(Long id, String reason) {
        if (reason == null || reason.trim().isEmpty()) {
            throw new AppException(ErrorCode.REASON_REQUIRED);
        }

        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.APPOINTMENT_NOT_FOUND));

        if (appointment.getStatus() == AppointmentStatus.CANCELLED || appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new AppException(ErrorCode.INVALID_APPOINTMENT_STATUS);
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointment.setCancelledBy(CancelledBy.ADMIN);
        appointment.setCancelReason(reason);
        appointmentRepository.save(appointment);
    }

    @Override
    @Transactional
    public void deleteAppointmentByAdmin(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.APPOINTMENT_NOT_FOUND));

        if (appointment.getStatus() != AppointmentStatus.CANCELLED) {
            throw new AppException(ErrorCode.INVALID_APPOINTMENT_STATUS);
        }

        appointmentRepository.delete(appointment);
    }

    @Override
    @Transactional
    public void completeAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.APPOINTMENT_NOT_FOUND));

        if (appointment.getStatus() != AppointmentStatus.CONFIRMED && appointment.getStatus() != AppointmentStatus.IN_PROGRESS) {
            throw new AppException(ErrorCode.INVALID_APPOINTMENT_STATUS);
        }

        appointment.setStatus(AppointmentStatus.COMPLETED);
        appointmentRepository.save(appointment);
    }

    @Override
    @Transactional
    public void updateStatus(Long id, com.salon.common.enums.AppointmentStatus status, String note) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.APPOINTMENT_NOT_FOUND));
        
        if (status == AppointmentStatus.CANCELLED) {
            cancelAppointmentByAdmin(id, note);
            return;
        }

        if (status == AppointmentStatus.COMPLETED) {
            completeAppointment(id);
            return;
        }

        if (status == AppointmentStatus.CONFIRMED) {
            if (appointment.getStaff() == null) {
                 throw new AppException(ErrorCode.STAFF_REQUIRED_FOR_CONFIRM);
            }
            appointment.setStatus(AppointmentStatus.CONFIRMED);
            appointmentRepository.save(appointment);
            return;
        }

        appointment.setStatus(status);
        appointmentRepository.save(appointment);
    }

    @Override
    @Transactional
    public void assignStaff(Long id, Integer staffId) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.APPOINTMENT_NOT_FOUND));
        
        Staff staff = staffRepository.findById(staffId)
                     .orElseThrow(() -> new AppException(ErrorCode.STAFF_NOT_FOUND));
        
        appointment.setStaff(staff);
        appointmentRepository.save(appointment);
    }
}
