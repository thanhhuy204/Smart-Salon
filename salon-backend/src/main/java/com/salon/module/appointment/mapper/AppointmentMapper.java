package com.salon.module.appointment.mapper;

import com.salon.module.appointment.dto.AppointmentResponse;
import com.salon.module.appointment.dto.AppointmentServiceDto;
import com.salon.module.appointment.entity.Appointment;
import com.salon.module.appointment.entity.AppointmentServiceEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AppointmentMapper {

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "customerName", source = "user.fullName")
    @Mapping(target = "customerPhone", source = "user.phone")
    @Mapping(target = "staffId", source = "staff.id")
    @Mapping(target = "staffName", source = "staff.fullName")
    AppointmentResponse toResponse(Appointment entity);

    @Mapping(target = "serviceId", source = "service.id")
    @Mapping(target = "serviceName", source = "service.name")
    AppointmentServiceDto toDto(AppointmentServiceEntity entity);

    List<AppointmentResponse> toResponseList(List<Appointment> entities);
}
