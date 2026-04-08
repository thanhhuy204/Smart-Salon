package com.salon.module.appointment.repository;

import com.salon.module.appointment.entity.SalonWorkingHour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SalonWorkingHourRepository extends JpaRepository<SalonWorkingHour, Integer> {
    Optional<SalonWorkingHour> findByDayOfWeek(Byte dayOfWeek);
}
