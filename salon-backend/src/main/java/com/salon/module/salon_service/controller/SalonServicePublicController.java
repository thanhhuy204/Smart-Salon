package com.salon.module.salon_service.controller;

import com.salon.common.response.ApiResponse;
import com.salon.module.salon_service.dto.ServiceCategoryWithServicesResponse;
import com.salon.module.salon_service.service.SalonServiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/services")
@RequiredArgsConstructor
public class SalonServicePublicController {

    private final SalonServiceService salonServiceService;

    @GetMapping
    public ApiResponse<List<ServiceCategoryWithServicesResponse>> getServicesByCategory() {
        return ApiResponse.success(salonServiceService.getServicesByCategory());
    }
}
