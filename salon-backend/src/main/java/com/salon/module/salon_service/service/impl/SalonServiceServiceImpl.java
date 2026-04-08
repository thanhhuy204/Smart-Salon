package com.salon.module.salon_service.service.impl;

import com.salon.common.exception.AppException;
import com.salon.common.exception.ErrorCode;
import com.salon.module.appointment.repository.AppointmentServiceEntityRepository;
import com.salon.module.salon_service.dto.*;
import com.salon.module.salon_service.entity.SalonService;
import com.salon.module.salon_service.entity.ServiceCategory;
import com.salon.module.salon_service.mapper.SalonServiceMapper;
import com.salon.module.salon_service.mapper.ServiceCategoryMapper;
import com.salon.module.salon_service.repository.SalonServiceRepository;
import com.salon.module.salon_service.repository.ServiceCategoryRepository;
import com.salon.module.salon_service.service.SalonServiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SalonServiceServiceImpl implements SalonServiceService {

    private final SalonServiceRepository salonServiceRepository;
    private final ServiceCategoryRepository serviceCategoryRepository;
    private final AppointmentServiceEntityRepository appointmentServiceEntityRepository;
    private final SalonServiceMapper salonServiceMapper;
    private final ServiceCategoryMapper serviceCategoryMapper;

    @Override
    @Transactional(readOnly = true)
    public List<ServiceCategoryResponse> getAllCategories() {
        return serviceCategoryRepository.findAll().stream()
                .map(serviceCategoryMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ServiceCategoryResponse createCategory(ServiceCategoryRequest request) {
        ServiceCategory category = serviceCategoryMapper.toEntity(request);
        if (request.getIsActive() != null) {
            category.setIsActive(request.getIsActive());
        } else {
            category.setIsActive(true);
        }
        category = serviceCategoryRepository.save(category);
        return serviceCategoryMapper.toResponse(category);
    }

    @Override
    @Transactional
    public ServiceCategoryResponse updateCategory(Integer id, ServiceCategoryRequest request) {
        ServiceCategory category = serviceCategoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        serviceCategoryMapper.updateEntityFromRequest(request, category);
        if (request.getIsActive() != null) {
            category.setIsActive(request.getIsActive());
        }
        category = serviceCategoryRepository.save(category);
        return serviceCategoryMapper.toResponse(category);
    }

    @Override
    @Transactional
    public void deleteCategory(Integer id) {
        ServiceCategory category = serviceCategoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        // Simple check: we just delete. If FK constraints fail, global handler will catch it,
        // or we can count services.
        serviceCategoryRepository.delete(category);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SalonServiceResponse> getAllServices() {
        return salonServiceRepository.findAll().stream()
                .map(salonServiceMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceCategoryWithServicesResponse> getServicesByCategory() {
        List<ServiceCategory> categories = serviceCategoryRepository.findAll();
        List<SalonService> allServices = salonServiceRepository.findAll();

        Map<Integer, List<SalonServiceResponse>> servicesByCatId = allServices.stream()
                .map(salonServiceMapper::toResponse)
                .collect(Collectors.groupingBy(SalonServiceResponse::getCategoryId));

        return categories.stream().map(cat -> {
            ServiceCategoryWithServicesResponse response = new ServiceCategoryWithServicesResponse();
            response.setCategoryId(cat.getId());
            response.setCategoryName(cat.getName());
            response.setIsActive(cat.getIsActive());
            response.setSortOrder(cat.getSortOrder());
            response.setServices(servicesByCatId.getOrDefault(cat.getId(), List.of()));
            return response;
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public SalonServiceResponse createService(SalonServiceRequest request) {
        ServiceCategory category = serviceCategoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        SalonService service = salonServiceMapper.toEntity(request);
        service.setCategory(category);
        service.setIsActive(true);
        
        service = salonServiceRepository.save(service);
        return salonServiceMapper.toResponse(service);
    }

    @Override
    @Transactional
    public SalonServiceResponse updateService(Integer id, SalonServiceRequest request) {
        SalonService service = salonServiceRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_FOUND));
                
        if (!service.getCategory().getId().equals(request.getCategoryId())) {
            ServiceCategory category = serviceCategoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
            service.setCategory(category);
        }

        salonServiceMapper.updateEntityFromRequest(request, service);
        service = salonServiceRepository.save(service);
        return salonServiceMapper.toResponse(service);
    }

    @Override
    @Transactional
    public void updateServiceStatus(Integer id, Boolean isActive) {
        SalonService service = salonServiceRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_FOUND));
        service.setIsActive(isActive);
        salonServiceRepository.save(service);
    }

    @Override
    @Transactional
    public void deleteService(Integer id) {
        SalonService service = salonServiceRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_FOUND));
                
        if (appointmentServiceEntityRepository.existsByServiceId(id)) {
            throw new AppException(ErrorCode.SERVICE_HAS_APPOINTMENT);
        }
        
        salonServiceRepository.delete(service);
    }
}
