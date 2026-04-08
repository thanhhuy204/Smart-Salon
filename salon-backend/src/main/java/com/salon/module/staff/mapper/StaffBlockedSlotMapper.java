package com.salon.module.staff.mapper;

import com.salon.module.staff.dto.StaffBlockedSlotRequest;
import com.salon.module.staff.dto.StaffBlockedSlotResponse;
import com.salon.module.staff.entity.StaffBlockedSlot;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface StaffBlockedSlotMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "staff", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    StaffBlockedSlot toEntity(StaffBlockedSlotRequest request);

    @Mapping(target = "staffId", source = "staff.id")
    StaffBlockedSlotResponse toResponse(StaffBlockedSlot entity);
}
