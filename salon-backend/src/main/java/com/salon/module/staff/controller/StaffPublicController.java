package com.salon.module.staff.controller;

import com.salon.common.response.ApiResponse;
import com.salon.module.staff.dto.StaffResponse;
import com.salon.module.staff.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/staffs")
@RequiredArgsConstructor
public class StaffPublicController {

    private final StaffService staffService;

    @GetMapping
    public ApiResponse<List<StaffResponse>> getActiveStaffs() {
        List<StaffResponse> activeStaffs = staffService.getAllStaffs().stream()
                .filter(StaffResponse::getIsActive)
                .collect(Collectors.toList());
        return ApiResponse.success(activeStaffs);
    }
}
