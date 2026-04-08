package com.salon.module.staff.controller;

import com.salon.common.response.ApiResponse;
import com.salon.module.staff.dto.*;
import com.salon.module.staff.service.StaffService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/staffs")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class StaffAdminController {

    private final StaffService staffService;
    private final com.salon.module.file.service.FileStorageService fileStorageService;

    @GetMapping
    public ApiResponse<List<StaffResponse>> getAllStaffs() {
        return ApiResponse.success(staffService.getAllStaffs());
    }

    @PostMapping(consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<StaffResponse> createStaff(
            @Valid @ModelAttribute StaffRequest request,
            @RequestParam(value = "file", required = false) org.springframework.web.multipart.MultipartFile file) {
        if (file != null && !file.isEmpty()) {
            String fileUrl = fileStorageService.storeFile(file);
            request.setAvatarUrl(fileUrl);
        }
        return ApiResponse.success(201, "Tạo nhân viên thành công", staffService.createStaff(request));
    }

    @PutMapping(value = "/{id}", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<StaffResponse> updateStaff(
            @PathVariable Integer id,
            @Valid @ModelAttribute StaffRequest request,
            @RequestParam(value = "file", required = false) org.springframework.web.multipart.MultipartFile file) {
        if (file != null && !file.isEmpty()) {
            String fileUrl = fileStorageService.storeFile(file);
            request.setAvatarUrl(fileUrl);
        }
        return ApiResponse.success(staffService.updateStaff(id, request));
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<Void> updateStaffStatus(@PathVariable Integer id, @Valid @RequestBody StaffStatusRequest request) {
        staffService.updateStaffStatus(id, request.getIsActive());
        return ApiResponse.success(null);
    }

    @GetMapping("/{id}/performance")
    public ApiResponse<StaffPerformanceResponse> getStaffPerformance(@PathVariable Integer id) {
        return ApiResponse.success(staffService.getStaffPerformance(id));
    }
    
    @PostMapping("/{id}/blocked-slots")
    public ApiResponse<StaffBlockedSlotResponse> blockSlot(@PathVariable Integer id, @Valid @RequestBody StaffBlockedSlotRequest request) {
        return ApiResponse.success(staffService.addBlockedSlot(id, request));
    }
    
    @DeleteMapping("/blocked-slots/{slotId}")
    public ApiResponse<Void> removeBlockedSlot(@PathVariable Integer slotId) {
        staffService.removeBlockedSlot(slotId);
        return ApiResponse.success(null);
    }
}
