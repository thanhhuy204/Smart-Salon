import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { AuthResponse, ChangePasswordRequest, CurrentUser, ForgotPasswordRequest, LoginRequest, RegisterRequest, ResetPasswordRequest, VerifyResetOtpRequest, VerifyResetOtpResponse } from '../models/auth.model';
import { TokenService } from './token.service';

const API_URL = 'http://localhost:8080/api/v1';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private tokenService = inject(TokenService);

  currentUser = signal<CurrentUser | null>(this.tokenService.getUser());

  login(request: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http
      .post<ApiResponse<AuthResponse>>(`${API_URL}/auth/login`, request)
      .pipe(tap(res => this.persistSession(res.data)));
  }

  register(request: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http
      .post<ApiResponse<AuthResponse>>(`${API_URL}/auth/register`, request)
      .pipe(tap(res => this.persistSession(res.data)));
  }

  logout(): void {
    this.tokenService.clear();
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  forgotPassword(request: ForgotPasswordRequest): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${API_URL}/auth/forgot-password`, request);
  }

  verifyResetOtp(request: VerifyResetOtpRequest): Observable<ApiResponse<VerifyResetOtpResponse>> {
    return this.http.post<ApiResponse<VerifyResetOtpResponse>>(`${API_URL}/auth/verify-reset-otp`, request);
  }

  resetPassword(request: ResetPasswordRequest): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${API_URL}/auth/reset-password`, request);
  }

  changePassword(request: ChangePasswordRequest): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${API_URL}/users/me/password`, request);
  }

  updateCurrentUser(user: CurrentUser): void {
    this.tokenService.setUser(user);
    this.currentUser.set(user);
  }

  isLoggedIn(): boolean {
    return !!this.currentUser();
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'ADMIN';
  }

  private persistSession(data: AuthResponse): void {
    this.tokenService.setToken(data.accessToken);
    this.tokenService.setUser(data.user);
    this.currentUser.set(data.user);
  }
}
