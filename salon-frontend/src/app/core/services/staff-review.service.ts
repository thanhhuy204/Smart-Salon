import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { StaffReviewModel, CreateStaffReviewRequest } from '../models/staff-review.model';

const API_URL = 'http://localhost:8080/api/v1';

@Injectable({ providedIn: 'root' })
export class StaffReviewService {
  private http = inject(HttpClient);

  createReview(request: CreateStaffReviewRequest): Observable<ApiResponse<StaffReviewModel>> {
    return this.http.post<ApiResponse<StaffReviewModel>>(`${API_URL}/staff-reviews`, request);
  }

  getReviewByAppointmentId(appointmentId: number): Observable<ApiResponse<StaffReviewModel>> {
    return this.http.get<ApiResponse<StaffReviewModel>>(`${API_URL}/staff-reviews/appointment/${appointmentId}`);
  }
}
