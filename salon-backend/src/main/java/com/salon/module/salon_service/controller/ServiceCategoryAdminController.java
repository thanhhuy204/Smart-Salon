package com.salon.module.salon_service.controller;

import com.salon.common.response.ApiResponse;
import com.salon.module.salon_service.dto.ServiceCategoryRequest;
import com.salon.module.salon_service.dto.ServiceCategoryResponse;
import com.salon.module.salon_service.service.SalonServiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/categories")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class ServiceCategoryAdminController {

    private final SalonServiceService salonServiceService;

    @GetMapping
    public ApiResponse<List<com.salon.module.salon_service.dto.ServiceCategoryWithServicesResponse>> getAllCategories() {
        return ApiResponse.success(salonServiceService.getServicesByCategory());
    }

    @PostMapping
    public ApiResponse<ServiceCategoryResponse> createCategory(@Valid @RequestBody ServiceCategoryRequest request) {
        return ApiResponse.success(201, "Tạo danh mục thành công", salonServiceService.createCategory(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<ServiceCategoryResponse> updateCategory(@PathVariable Integer id, @Valid @RequestBody ServiceCategoryRequest request) {
        return ApiResponse.success(salonServiceService.updateCategory(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteCategory(@PathVariable Integer id) {
        salonServiceService.deleteCategory(id);
        return ApiResponse.success(null);
    }
}
