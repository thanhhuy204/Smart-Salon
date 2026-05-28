import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';

const passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const pwd = group.get('password')?.value as string;
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
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal(false);
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  errorMessage = signal<string | null>(null);

  form = this.fb.group(
    {
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^0\d{9}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordMatchValidator }
  );

  get f() { return this.form.controls; }

  trimField(field: string): void {
    const ctrl = this.form.get(field);
    ctrl?.setValue((ctrl.value as string)?.trim() ?? '');
  }

  togglePassword(): void { this.showPassword.update(v => !v); }
  toggleConfirmPassword(): void { this.showConfirmPassword.update(v => !v); }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { fullName, email, phone, password, confirmPassword } = this.form.value;
    this.authService
      .register({ fullName: fullName!, email: email!, phone: phone!, password: password!, confirmPassword: confirmPassword! })
      .subscribe({
        next: () => this.router.navigate(['/']),
        error: (err: HttpErrorResponse) => {
          this.isLoading.set(false);
          if (err.status === 409) {
            const msg = (err.error?.message ?? '') as string;
            this.errorMessage.set(
              msg.toLowerCase().includes('phone')
                ? 'Số điện thoại này đã được sử dụng bởi tài khoản khác.'
                : 'Email này đã được sử dụng. Vui lòng đăng nhập hoặc dùng email khác.'
            );
          } else if (err.status === 400) {
            const msg = (err.error?.message ?? '') as string;
            this.errorMessage.set(msg || 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
          } else if (err.status === 0) {
            this.errorMessage.set('Không thể kết nối. Vui lòng kiểm tra mạng và thử lại.');
          } else {
            this.errorMessage.set('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
          }
        },
      });
  }
}
