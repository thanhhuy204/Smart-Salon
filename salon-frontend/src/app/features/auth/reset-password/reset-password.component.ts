import { Component, inject, signal, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';

const passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const pwd = group.get('newPassword')?.value as string;
  const confirm = group.get('confirmPassword')?.value as string;
  if (pwd && confirm && pwd !== confirm) {
    group.get('confirmPassword')?.setErrors({ mismatch: true });
  } else {
    const confirmCtrl = group.get('confirmPassword');
    if (confirmCtrl?.errors?.['mismatch']) {
      confirmCtrl.setErrors(null);
    }
  }
  return null;
};

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
private route = inject(ActivatedRoute);

  isLoading = signal(false);
  isSuccess = signal(false);
  isInvalidToken = signal(false);
  errorMessage = signal<string | null>(null);
  showNewPassword = signal(false);
  showConfirmPassword = signal(false);

  private token = '';

  form = this.fb.group(
    {
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordMatchValidator }
  );

  get f() { return this.form.controls; }

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.isInvalidToken.set(true);
      return;
    }
    this.token = token;
  }

  toggleNewPassword(): void { this.showNewPassword.update(v => !v); }
  toggleConfirmPassword(): void { this.showConfirmPassword.update(v => !v); }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.resetPassword({
      resetToken: this.token,
      newPassword: this.form.value.newPassword!,
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.isSuccess.set(true);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        if (err.status === 400 || err.status === 404) {
          this.errorMessage.set('Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu link mới.');
        } else if (err.status === 0) {
          this.errorMessage.set('Không thể kết nối. Vui lòng kiểm tra mạng và thử lại.');
        } else {
          this.errorMessage.set('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
        }
      },
    });
  }
}
