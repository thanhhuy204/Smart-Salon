package com.salon.module.salon_service.service;

import com.salon.module.salon_service.dto.SalonServiceRequest;
import com.salon.module.salon_service.dto.SalonServiceResponse;
import com.salon.module.salon_service.dto.ServiceCategoryRequest;
import com.salon.module.salon_service.dto.ServiceCategoryResponse;
import com.salon.module.salon_service.dto.ServiceCategoryWithServicesResponse;

import java.util.List;

public interface SalonServiceService {
    // Categories
    List<ServiceCategoryResponse> getAllCategories();
    ServiceCategoryResponse createCategory(ServiceCategoryRequest request);
    ServiceCategoryResponse updateCategory(Integer id, ServiceCategoryRequest request);
    void deleteCategory(Integer id);

    // Services
    List<SalonServiceResponse> getAllServices();
    List<ServiceCategoryWithServicesResponse> getServicesByCategory();
    SalonServiceResponse createService(SalonServiceRequest request);
    SalonServiceResponse updateService(Integer id, SalonServiceRequest request);
    void updateServiceStatus(Integer id, Boolean isActive);
    void deleteService(Integer id);
}
