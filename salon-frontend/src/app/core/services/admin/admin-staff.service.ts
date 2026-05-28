import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/api-response.model';
import { StaffModel } from '../../models/staff.model';

const API_URL = 'http://localhost:8080/api/v1/admin/staffs';

@Injectable({ providedIn: 'root' })
export class AdminStaffService {
  private http = inject(HttpClient);

  getAllStaffs(): Observable<ApiResponse<StaffModel[]>> {
    return this.http.get<ApiResponse<StaffModel[]>>(API_URL);
  }

  createStaff(payload: any): Observable<ApiResponse<StaffModel>> {
    return this.http.post<ApiResponse<StaffModel>>(API_URL, payload);
  }

  updateStaff(id: number, payload: any): Observable<ApiResponse<StaffModel>> {
    return this.http.put<ApiResponse<StaffModel>>(`${API_URL}/${id}`, payload);
  }

  toggleStaffStatus(id: number, isActive: boolean): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(`${API_URL}/${id}/status`, { isActive });
  }

  deleteStaff(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${API_URL}/${id}`);
  }
}
