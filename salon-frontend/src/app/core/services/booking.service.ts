import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { ServiceCategory } from '../models/service.model';
import { StaffModel } from '../models/staff.model';
import { AvailableSlot, BookingRequest, AppointmentModel } from '../models/appointment.model';

const API_URL = 'http://localhost:8080/api/v1';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private http = inject(HttpClient);

  getServices(): Observable<ApiResponse<ServiceCategory[]>> {
    return this.http.get<ApiResponse<ServiceCategory[]>>(`${API_URL}/services`);
  }

  getStaffs(): Observable<ApiResponse<StaffModel[]>> {
    return this.http.get<ApiResponse<StaffModel[]>>(`${API_URL}/staffs`);
  }

  getAvailableSlots(date: string, staffId: number | null): Observable<ApiResponse<AvailableSlot[]>> {
    let params = new HttpParams().set('date', date);
    if (staffId !== null) {
      params = params.set('staffId', staffId.toString());
    }
    return this.http.get<ApiResponse<AvailableSlot[]>>(`${API_URL}/appointments/available-slots`, { params });
  }

  submitBooking(request: BookingRequest): Observable<ApiResponse<AppointmentModel>> {
    return this.http.post<ApiResponse<AppointmentModel>>(`${API_URL}/appointments`, request);
  }
}
