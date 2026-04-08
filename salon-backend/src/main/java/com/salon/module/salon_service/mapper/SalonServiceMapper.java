package com.salon.module.salon_service.mapper;

import com.salon.module.salon_service.dto.SalonServiceRequest;
import com.salon.module.salon_service.dto.SalonServiceResponse;
import com.salon.module.salon_service.entity.SalonService;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface SalonServiceMapper {
    @Mapping(target = "category.id", source = "categoryId")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    SalonService toEntity(SalonServiceRequest request);

    @Mapping(target = "categoryId", source = "category.id")
    @Mapping(target = "categoryName", source = "category.name")
    SalonServiceResponse toResponse(SalonService entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromRequest(SalonServiceRequest request, @MappingTarget SalonService entity);
}
