package com.salon.module.appointment.repository;

import com.salon.common.enums.AppointmentStatus;
import com.salon.module.appointment.entity.Appointment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    @EntityGraph(attributePaths = {"staff", "user", "services", "services.service"})
    List<Appointment> findByStaffIdAndApptDateAndStatusIn(Integer staffId, LocalDate apptDate, List<AppointmentStatus> statuses);

    @EntityGraph(attributePaths = {"staff", "user", "services", "services.service"})
    Page<Appointment> findByUserIdAndStatusIn(Long userId, List<AppointmentStatus> statuses, Pageable pageable);

    @EntityGraph(attributePaths = {"staff", "user", "services", "services.service"})
    Page<Appointment> findByUserIdAndStatus(Long userId, AppointmentStatus status, Pageable pageable);

    @EntityGraph(attributePaths = {"staff", "user", "services", "services.service"})
    Page<Appointment> findByStatus(AppointmentStatus status, Pageable pageable);

    @EntityGraph(attributePaths = {"staff", "user", "services", "services.service"})
    org.springframework.data.domain.Page<Appointment> findAll(Pageable pageable);

    long countByApptDate(LocalDate apptDate);
    long countByStatus(AppointmentStatus status);

    @org.springframework.data.jpa.repository.Query("SELECT SUM(a.totalPrice) FROM Appointment a WHERE a.apptDate = :date AND a.status = 'COMPLETED'")
    java.math.BigDecimal sumRevenueByDate(@org.springframework.data.repository.query.Param("date") LocalDate date);

    @EntityGraph(attributePaths = {"staff", "user", "services", "services.service"})
    List<Appointment> findTop10ByApptDateOrderByStartTimeAsc(LocalDate date);
}
