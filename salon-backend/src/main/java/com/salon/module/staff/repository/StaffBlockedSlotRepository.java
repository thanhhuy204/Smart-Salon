package com.salon.module.staff.repository;

import com.salon.module.staff.entity.StaffBlockedSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface StaffBlockedSlotRepository extends JpaRepository<StaffBlockedSlot, Integer> {
    List<StaffBlockedSlot> findByStaffIdAndBlockDate(Integer staffId, LocalDate blockDate);
}
