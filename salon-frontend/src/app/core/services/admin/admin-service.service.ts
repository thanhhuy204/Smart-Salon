import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/api-response.model';
import { ServiceCategory, ServiceModel } from '../../models/service.model';

const API_URL = 'http://localhost:8080/api/v1/admin/services';
const CATEGORY_API_URL = 'http://localhost:8080/api/v1/admin/categories';

@Injectable({ providedIn: 'root' })
export class AdminServiceService {
  private http = inject(HttpClient);

  // --- CATEGORIES ---
  getAllCategories(): Observable<ApiResponse<ServiceCategory[]>> {
    return this.http.get<ApiResponse<ServiceCategory[]>>(CATEGORY_API_URL);
  }

  createCategory(categoryName: string): Observable<ApiResponse<ServiceCategory>> {
    return this.http.post<ApiResponse<ServiceCategory>>(CATEGORY_API_URL, { name: categoryName });
  }

  deleteCategory(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${CATEGORY_API_URL}/${id}`);
  }

  // --- SERVICES ---
  getAllServicesGrouped(): Observable<ApiResponse<ServiceCategory[]>> {
    // Thường backend sẽ có endpoint group theo category tiện cho Admin
    // Hoặc ta có thể dùng lại getAllCategories() giả lập response lồng nhau
    return this.http.get<ApiResponse<ServiceCategory[]>>(`${API_URL}/grouped`);
  }

  createService(categoryId: number, payload: any): Observable<ApiResponse<ServiceModel>> {
    return this.http.post<ApiResponse<ServiceModel>>(`${API_URL}?categoryId=${categoryId}`, payload);
  }

  updateService(id: number, payload: any): Observable<ApiResponse<ServiceModel>> {
    return this.http.put<ApiResponse<ServiceModel>>(`${API_URL}/${id}`, payload);
  }

  toggleServiceStatus(id: number, isActive: boolean): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(`${API_URL}/${id}/status`, { isActive });
  }

  deleteService(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${API_URL}/${id}`);
  }
  
}
