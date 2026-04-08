package com.salon.module.salon_service.mapper;

import com.salon.module.salon_service.dto.ServiceCategoryRequest;
import com.salon.module.salon_service.dto.ServiceCategoryResponse;
import com.salon.module.salon_service.entity.ServiceCategory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ServiceCategoryMapper {
    @Mapping(target = "id", ignore = true)
    ServiceCategory toEntity(ServiceCategoryRequest request);

    ServiceCategoryResponse toResponse(ServiceCategory entity);

    @Mapping(target = "id", ignore = true)
    void updateEntityFromRequest(ServiceCategoryRequest request, @MappingTarget ServiceCategory entity);
}
