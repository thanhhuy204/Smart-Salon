package com.salon.module.staff.mapper;

import com.salon.module.staff.dto.StaffRequest;
import com.salon.module.staff.dto.StaffResponse;
import com.salon.module.staff.entity.Staff;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface StaffMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Staff toEntity(StaffRequest request);

    @Mapping(target = "averageRating", ignore = true)
    @Mapping(target = "totalCompletedAppointments", ignore = true)
    StaffResponse toResponse(Staff entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromRequest(StaffRequest request, @MappingTarget Staff entity);
}
