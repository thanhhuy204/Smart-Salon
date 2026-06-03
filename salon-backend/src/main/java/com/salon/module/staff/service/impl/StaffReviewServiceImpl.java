package com.salon.module.staff.service.impl;

import com.salon.common.enums.AppointmentStatus;
import com.salon.common.exception.AppException;
import com.salon.common.exception.ErrorCode;
import com.salon.module.appointment.entity.Appointment;
import com.salon.module.appointment.repository.AppointmentRepository;
import com.salon.module.staff.dto.StaffReviewRequest;
import com.salon.module.staff.dto.StaffReviewResponse;
import com.salon.module.staff.entity.StaffReview;
import com.salon.module.staff.mapper.StaffReviewMapper;
import com.salon.module.staff.repository.StaffReviewRepository;
import com.salon.module.staff.service.StaffReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class StaffReviewServiceImpl implements StaffReviewService {

    private final StaffReviewRepository staffReviewRepository;
    private final AppointmentRepository appointmentRepository;
    private final StaffReviewMapper staffReviewMapper;

    @Override
    @Transactional
    public StaffReviewResponse createReview(Long userId, StaffReviewRequest request) {
        // 1. Kiểm tra sự tồn tại của Lịch hẹn
        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new AppException(ErrorCode.APPOINTMENT_NOT_FOUND));

        // 2. Kiểm tra quyền sở hữu lịch hẹn của chính User đăng nhập
        if (!appointment.getUser().getId().equals(userId)) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }

        // 3. Kiểm tra trạng thái lịch hẹn phải là COMPLETED
        if (appointment.getStatus() != AppointmentStatus.COMPLETED) {
            throw new AppException(ErrorCode.INVALID_APPOINTMENT_STATUS);
        }

        // 4. Kiểm tra xem thợ có được gán cho lịch hẹn hay chưa
        if (appointment.getStaff() == null) {
            throw new AppException(ErrorCode.STAFF_NOT_FOUND);
        }

        // 5. Kiểm tra xem lịch hẹn đã được đánh giá trước đó hay chưa (tránh trùng lặp)
        if (staffReviewRepository.findByAppointmentId(appointment.getId()).isPresent()) {
            throw new AppException(ErrorCode.ALREADY_REVIEWED);
        }

        // 6. Tạo entity mới và lưu
        StaffReview review = StaffReview.builder()
                .appointment(appointment)
                .user(appointment.getUser())
                .staff(appointment.getStaff())
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        review = staffReviewRepository.save(review);
        return staffReviewMapper.toResponse(review);
    }

    @Override
    @Transactional(readOnly = true)
    public StaffReviewResponse getReviewByAppointmentId(Long userId, Long appointmentId) {
        // 1. Tìm lịch hẹn
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppException(ErrorCode.APPOINTMENT_NOT_FOUND));

        // 2. Bảo mật: Lịch hẹn phải của chính user đăng nhập
        if (!appointment.getUser().getId().equals(userId)) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }

        // 3. Lấy đánh giá tương ứng
        StaffReview review = staffReviewRepository.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        return staffReviewMapper.toResponse(review);
    }
}
