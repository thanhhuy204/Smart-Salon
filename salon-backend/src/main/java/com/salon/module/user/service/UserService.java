package com.salon.module.user.service;

import com.salon.module.user.dto.ChangePasswordRequest;
import com.salon.module.user.dto.UpdateProfileRequest;
import com.salon.module.user.dto.UserProfileResponse;

public interface UserService {
    UserProfileResponse getMyProfile(Long userId);
    UserProfileResponse updateProfile(Long userId, UpdateProfileRequest request);
    void changePassword(Long userId, ChangePasswordRequest request);
}
