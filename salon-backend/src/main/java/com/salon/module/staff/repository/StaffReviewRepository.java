package com.salon.module.staff.repository;

import com.salon.module.staff.entity.StaffReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StaffReviewRepository extends JpaRepository<StaffReview, Long> {
    List<StaffReview> findByStaffId(Integer staffId);
    Optional<StaffReview> findByAppointmentId(Long appointmentId);
    boolean existsByAppointmentId(Long appointmentId);

    @Query("SELECT r.appointment.id FROM StaffReview r WHERE r.user.id = :userId")
    List<Long> findReviewedAppointmentIdsByUserId(@Param("userId") Long userId);

    @Query("SELECT r.appointment.id FROM StaffReview r WHERE r.appointment.id IN :appointmentIds")
    List<Long> findReviewedAppointmentIdsIn(@Param("appointmentIds") List<Long> appointmentIds);
}
