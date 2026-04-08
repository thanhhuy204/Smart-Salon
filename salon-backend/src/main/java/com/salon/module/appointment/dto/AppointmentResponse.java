package com.salon.module.appointment.dto;

import com.salon.common.enums.AppointmentStatus;
import com.salon.common.enums.CancelledBy;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
public class AppointmentResponse {
    private Long id;
    private Long userId;
    private Integer staffId;
    private String staffName;
    private LocalDate apptDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private BigDecimal totalPrice;
    private AppointmentStatus status;
    private String cancelReason;
    private CancelledBy cancelledBy;
    private String note;
    private List<AppointmentServiceDto> services;
}
