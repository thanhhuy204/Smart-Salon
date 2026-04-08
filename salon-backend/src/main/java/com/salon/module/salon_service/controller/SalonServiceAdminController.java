package com.salon.module.salon_service.controller;

import com.salon.common.response.ApiResponse;
import com.salon.module.salon_service.dto.SalonServiceRequest;
import com.salon.module.salon_service.dto.SalonServiceResponse;
import com.salon.module.salon_service.service.SalonServiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/services")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class SalonServiceAdminController {

    private final SalonServiceService salonServiceService;

    @GetMapping
    public ApiResponse<List<SalonServiceResponse>> getAllServices() {
        return ApiResponse.success(salonServiceService.getAllServices());
    }

    @PostMapping
    public ApiResponse<SalonServiceResponse> createService(
            @RequestParam(required = false) Integer categoryId,
            @Valid @RequestBody SalonServiceRequest request) {
        if (categoryId != null) {
            request.setCategoryId(categoryId);
        }
        return ApiResponse.success(201, "Tạo dịch vụ thành công", salonServiceService.createService(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<SalonServiceResponse> updateService(@PathVariable Integer id, @Valid @RequestBody SalonServiceRequest request) {
        return ApiResponse.success(salonServiceService.updateService(id, request));
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<Void> updateServiceStatus(@PathVariable Integer id, @RequestBody com.salon.module.salon_service.dto.ServiceStatusRequest request) {
        salonServiceService.updateServiceStatus(id, request.getIsActive());
        return ApiResponse.success(null);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteService(@PathVariable Integer id) {
        salonServiceService.deleteService(id);
        return ApiResponse.success(null);
    }
}
