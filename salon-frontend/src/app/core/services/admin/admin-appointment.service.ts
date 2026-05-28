import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PageResponse } from '../../models/api-response.model';
import { AppointmentModel, AppointmentStatus } from '../../models/appointment.model';

const API_URL = 'http://localhost:8080/api/v1/admin/appointments';

@Injectable({ providedIn: 'root' })
export class AdminAppointmentService {
  private http = inject(HttpClient);

  getAllAppointments(
    status?: AppointmentStatus | '',
    page: number = 0,
    size: number = 20
  ): Observable<ApiResponse<PageResponse<AppointmentModel>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
      
    if (status) {
      params = params.set('status', status);
    }
    
    return this.http.get<ApiResponse<PageResponse<AppointmentModel>>>(API_URL, { params });
  }

  updateAppointmentStatus(id: number, status: AppointmentStatus, note?: string): Observable<ApiResponse<void>> {
    const payload = { status, note };
    return this.http.put<ApiResponse<void>>(`${API_URL}/${id}/status`, payload);
  }

  assignStaff(id: number, staffId: number): Observable<ApiResponse<void>> {
    const payload = { staffId };
    return this.http.put<ApiResponse<void>>(`${API_URL}/${id}/assign`, payload);
  }

  deleteAppointment(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${API_URL}/${id}`);
  }
}
