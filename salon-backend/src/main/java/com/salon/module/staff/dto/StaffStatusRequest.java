package com.salon.module.staff.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StaffStatusRequest {
    @NotNull
    private Boolean isActive;
}
