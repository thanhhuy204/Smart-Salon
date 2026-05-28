import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../models/api-response.model';
import { UpdateProfileRequest, UserProfile, AppointmentSummary, OrderSummary } from '../models/user.model';

const API_URL = 'http://localhost:8080/api/v1';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);

  getProfile(): Observable<ApiResponse<UserProfile>> {
    return this.http.get<ApiResponse<UserProfile>>(`${API_URL}/users/me`);
  }

  updateProfile(data: UpdateProfileRequest): Observable<ApiResponse<UserProfile>> {
    return this.http.put<ApiResponse<UserProfile>>(`${API_URL}/users/me`, data);
  }

  uploadAvatar(file: File): Observable<ApiResponse<UserProfile>> {
    const formData = new FormData();
    formData.append('avatar', file);
    return this.http.put<ApiResponse<UserProfile>>(`${API_URL}/users/me/avatar`, formData);
  }

  getMyAppointments(): Observable<ApiResponse<AppointmentSummary[]>> {
    return this.http.get<ApiResponse<any>>(`${API_URL}/appointments/my-appointments`).pipe(
      map(res => {
        const summaries: AppointmentSummary[] = (res.data.content || []).map((item: any) => ({
          id: item.id,
          serviceName: item.services && item.services.length > 0 ? (item.services[0].serviceName || item.services[0].name || 'Dịch vụ Salon') : 'Dịch vụ Salon',
          staffName: item.staffName || 'Bất kỳ thợ nào',
          appointmentTime: `${item.apptDate} ${item.startTime}`,
          status: item.status,
          totalPrice: item.totalPrice
        }));
        return {
          status: res.status,
          message: res.message,
          data: summaries
        };
      })
    );
  }

  cancelAppointment(id: number): Observable<ApiResponse<void>> {
    // Our cancellation uses PUT /api/v1/appointments/{id}/cancel
    return this.http.put<ApiResponse<void>>(`${API_URL}/appointments/${id}/cancel`, { cancelReason: "Khách hàng tự huỷ" });
  }

  getMyOrders(): Observable<ApiResponse<OrderSummary[]>> {
    return of({
      status: 200,
      message: 'Success',
      data: []
    });
  }

  cancelOrder(id: number): Observable<ApiResponse<void>> {
    return of({
      status: 200,
      message: 'Success',
      data: undefined
    });
  }
}
