package com.salon.module.user.controller;

import com.salon.common.response.ApiResponse;
import com.salon.module.user.dto.ChangePasswordRequest;
import com.salon.module.user.dto.UpdateProfileRequest;
import com.salon.module.user.dto.UserProfileResponse;
import com.salon.module.user.service.UserService;
import com.salon.security.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // GET /api/v1/users/me
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getMyProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        UserProfileResponse data = userService.getMyProfile(userDetails.getUser().getId());
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    // PUT /api/v1/users/me
    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody UpdateProfileRequest request) {
        UserProfileResponse data = userService.updateProfile(userDetails.getUser().getId(), request);
        return ResponseEntity.ok(ApiResponse.success(200, "Cập nhật thông tin thành công", data));
    }

    // PUT /api/v1/users/me/password
    @PutMapping("/me/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(userDetails.getUser().getId(), request);
        return ResponseEntity.ok(ApiResponse.success(200, "Đổi mật khẩu thành công", null));
    }
}
