package com.salon.module.admin.service;

import com.salon.common.exception.AppException;
import com.salon.common.exception.ErrorCode;
import com.salon.common.response.PageResponse;
import com.salon.module.admin.dto.AdminUserResponse;
import com.salon.module.user.entity.User;
import com.salon.module.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public PageResponse<AdminUserResponse> getUsers(int page, int size, String keyword) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<User> userPage = (keyword != null && !keyword.isBlank())
                ? userRepository.searchByKeyword(keyword.trim(), pageable)
                : userRepository.findAll(pageable);

        List<AdminUserResponse> content = userPage.getContent().stream()
                .map(AdminUserResponse::from)
                .toList();

        return PageResponse.<AdminUserResponse>builder()
                .content(content)
                .page(userPage.getNumber())
                .size(userPage.getSize())
                .totalElements(userPage.getTotalElements())
                .totalPages(userPage.getTotalPages())
                .build();
    }

    @Transactional(readOnly = true)
    public AdminUserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));
        return AdminUserResponse.from(user);
    }

    @Transactional
    public AdminUserResponse toggleUserStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));
        user.setIsActive(!user.getIsActive());
        userRepository.save(user);
        return AdminUserResponse.from(user);
    }
}
