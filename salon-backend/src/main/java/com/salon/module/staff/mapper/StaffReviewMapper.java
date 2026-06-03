package com.salon.module.staff.mapper;

import com.salon.module.staff.dto.StaffReviewResponse;
import com.salon.module.staff.entity.StaffReview;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface StaffReviewMapper {
    @Mapping(target = "appointmentId", source = "appointment.id")
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "staffId", source = "staff.id")
    StaffReviewResponse toResponse(StaffReview entity);
}
