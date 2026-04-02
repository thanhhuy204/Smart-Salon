package com.salon.module.auth.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class VerifyOtpResponse {
    private String resetToken;
}
