package com.salon.module.salon_service.repository;

import com.salon.module.salon_service.entity.SalonService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SalonServiceRepository extends JpaRepository<SalonService, Integer> {
}
