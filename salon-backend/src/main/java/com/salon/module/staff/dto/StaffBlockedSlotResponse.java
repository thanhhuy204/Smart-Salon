package com.salon.module.staff.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class StaffBlockedSlotResponse {
    private Integer id;
    private Integer staffId;
    private LocalDate blockDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String note;
}
