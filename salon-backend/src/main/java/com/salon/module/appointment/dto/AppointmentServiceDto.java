package com.salon.module.appointment.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class AppointmentServiceDto {
    private Long id;
    private Integer serviceId;
    private String serviceName;
    private BigDecimal priceSnapshot;
}
