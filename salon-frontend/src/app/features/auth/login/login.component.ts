import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isLoading = signal(false);
  showPassword = signal(false);
  errorMessage = signal<string | null>(null);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false],
  });

  get emailCtrl(): AbstractControl { return this.form.get('email')!; }
  get passwordCtrl(): AbstractControl { return this.form.get('password')!; }

  togglePassword(): void { this.showPassword.update(v => !v); }

  trimEmail(): void {
    const ctrl = this.emailCtrl;
    ctrl.setValue((ctrl.value as string)?.trim() ?? '');
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.form.value;
    this.authService.login({ email: (email as string).trim(), password: password as string }).subscribe({
      next: () => {
        if (this.authService.isAdmin()) {
          this.router.navigate(['/admin']);
        } else {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] ?? '/';
          this.router.navigateByUrl(returnUrl);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        if (err.status === 401 || err.status === 400) {
          this.errorMessage.set('Email hoặc mật khẩu không chính xác.');
        } else if (err.status === 403) {
          this.errorMessage.set('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ.');
        } else if (err.status === 0) {
          this.errorMessage.set('Không thể kết nối. Vui lòng kiểm tra mạng và thử lại.');
        } else {
          this.errorMessage.set('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
        }
      },
    });
  }
}
