import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';

const passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const newPwd = group.get('newPassword')?.value as string;
  const confirm = group.get('confirmPassword')?.value as string;
  if (newPwd && confirm && newPwd !== confirm) {
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
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal(false);
  successMsg = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  showCurrent = signal(false);
  showNew = signal(false);
  showConfirm = signal(false);

  toggleCurrent(): void { this.showCurrent.update(v => !v); }
  toggleNew(): void { this.showNew.update(v => !v); }
  toggleConfirm(): void { this.showConfirm.update(v => !v); }

  form = this.fb.group(
    {
      currentPassword: ['', [Validators.required]],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
        ]
      ],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordMatchValidator }
  );

  get f() { return this.form.controls; }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    this.successMsg.set(null);
    this.errorMessage.set(null);

    this.authService.changePassword({
      currentPassword: this.form.value.currentPassword!,
      newPassword: this.form.value.newPassword!,
      confirmNewPassword: this.form.value.confirmPassword!,
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.form.reset();
        this.successMsg.set('Đổi mật khẩu thành công!');
        setTimeout(() => this.successMsg.set(null), 4000);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.errorMessage.set(this.resolveError(err));
      },
    });
  }

  private resolveError(err: HttpErrorResponse): string {
    if (err.status === 0) {
      return 'Không thể kết nối. Vui lòng kiểm tra mạng và thử lại.';
    }
    if (err.error?.data && typeof err.error.data === 'object') {
      const keys = Object.keys(err.error.data);
      if (keys.length > 0) {
        return err.error.data[keys[0]];
      }
    }
    return (err.error?.message as string) || 'Đã có lỗi xảy ra. Vui lòng thử lại sau.';
  }

  goBack(): void {
    this.router.navigate(['/profile']);
  }
}
