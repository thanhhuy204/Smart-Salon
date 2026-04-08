package com.salon.module.staff.repository;

import com.salon.module.staff.entity.StaffReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StaffReviewRepository extends JpaRepository<StaffReview, Long> {
    List<StaffReview> findByStaffId(Integer staffId);
}
