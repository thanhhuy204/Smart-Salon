import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PageResponse } from '../models/api-response.model';
import { AppointmentModel, AppointmentStatus, CancelAppointmentRequest } from '../models/appointment.model';

const API_URL = 'http://localhost:8080/api/v1';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private http = inject(HttpClient);

  getMyAppointments(status?: AppointmentStatus, page: number = 0, size: number = 10): Observable<ApiResponse<PageResponse<AppointmentModel>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
      
    if (status) {
      params = params.set('status', status);
    }
    
    return this.http.get<ApiResponse<PageResponse<AppointmentModel>>>(`${API_URL}/appointments/my-appointments`, { params });
  }

  cancelAppointment(id: number, request: CancelAppointmentRequest): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${API_URL}/appointments/${id}/cancel`, request);
  }

  getAppointmentDetail(id: number): Observable<ApiResponse<AppointmentModel>> {
    return this.http.get<ApiResponse<AppointmentModel>>(`${API_URL}/appointments/${id}`);
  }
}
