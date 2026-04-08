package com.salon.module.appointment.repository;

import com.salon.module.appointment.entity.AppointmentServiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentServiceEntityRepository extends JpaRepository<AppointmentServiceEntity, Long> {
    List<AppointmentServiceEntity> findByAppointmentId(Long appointmentId);
    boolean existsByServiceId(Integer serviceId);
}
