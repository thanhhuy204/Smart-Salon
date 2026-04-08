package com.salon.module.staff.service;

import com.salon.module.staff.dto.*;

import java.util.List;

public interface StaffService {
    List<StaffResponse> getAllStaffs();
    StaffResponse createStaff(StaffRequest request);
    StaffResponse updateStaff(Integer id, StaffRequest request);
    void updateStaffStatus(Integer id, Boolean isActive);
    
    // Performance
    StaffPerformanceResponse getStaffPerformance(Integer id);
    
    // Blocked Slots
    StaffBlockedSlotResponse addBlockedSlot(Integer staffId, StaffBlockedSlotRequest request);
    void removeBlockedSlot(Integer slotId);
}
