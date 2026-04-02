package com.salon.module.admin.controller;

import com.salon.common.response.ApiResponse;
import com.salon.common.response.PageResponse;
import com.salon.module.admin.dto.AdminUserResponse;
import com.salon.module.admin.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final AdminUserService adminUserService;

    // GET /api/v1/admin/users?page=0&size=10&keyword=
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<AdminUserResponse>>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        PageResponse<AdminUserResponse> data = adminUserService.getUsers(page, size, keyword);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    // GET /api/v1/admin/users/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminUserResponse>> getUserById(@PathVariable Long id) {
        AdminUserResponse data = adminUserService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    // PATCH /api/v1/admin/users/{id}/toggle-status
    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<ApiResponse<AdminUserResponse>> toggleUserStatus(@PathVariable Long id) {
        AdminUserResponse data = adminUserService.toggleUserStatus(id);
        String message = Boolean.TRUE.equals(data.getIsActive())
                ? "Tài khoản đã được kích hoạt"
                : "Tài khoản đã bị khóa";
        return ResponseEntity.ok(ApiResponse.success(200, message, data));
    }
}
