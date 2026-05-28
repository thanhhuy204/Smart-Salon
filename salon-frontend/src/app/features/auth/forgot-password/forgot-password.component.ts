import { Component, inject, signal, ElementRef, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';

type Step = 'email' | 'otp' | 'new-password' | 'success';

const passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const pwd = group.get('newPassword')?.value as string;
  const confirm = group.get('confirmPassword')?.value as string;
  if (pwd && confirm && pwd !== confirm) {
    group.get('confirmPassword')?.setErrors({ mismatch: true });
  } else {
    const ctrl = group.get('confirmPassword');
    if (ctrl?.errors?.['mismatch']) ctrl.setErrors(null);
  }
  return null;
};

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  @ViewChild('otpContainer') otpContainerRef!: ElementRef<HTMLElement>;

  step = signal<Step>('email');
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  showNewPassword = signal(false);
  showConfirmPassword = signal(false);

  toggleNewPassword(): void { this.showNewPassword.update(v => !v); }
  toggleConfirmPassword(): void { this.showConfirmPassword.update(v => !v); }

  get stepIndex(): number {
    return ['email', 'otp', 'new-password'].indexOf(this.step());
  }

  // Lưu email và resetToken qua các bước
  private savedEmail = '';
  private savedResetToken = '';

  // OTP: 6 ô riêng biệt
  otpDigits: string[] = ['', '', '', '', '', ''];
  get otpCode(): string { return this.otpDigits.join(''); }

  // Step 1 – Email
  emailForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });
  get emailCtrl() { return this.emailForm.get('email')!; }

  // Step 3 – Mật khẩu mới
  pwdForm = this.fb.group(
    {
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordMatchValidator }
  );
  get pf() { return this.pwdForm.controls; }

  // ── Step 1: Gửi email ──────────────────────────────────
  onSubmitEmail(): void {
    if (this.emailForm.invalid) { this.emailForm.markAllAsTouched(); return; }
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const email = (this.emailForm.value.email as string).trim();
    this.authService.forgotPassword({ email }).subscribe({
      next: () => {
        this.savedEmail = email;
        this.isLoading.set(false);
        this.step.set('otp');
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.errorMessage.set(this.resolveError(err));
      },
    });
  }

  // ── OTP input handling ─────────────────────────────────
  onOtpInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const digit = input.value.replace(/\D/g, '').slice(-1);
    this.otpDigits[index] = digit;
    input.value = digit;
    if (digit && index < 5) this.focusOtp(index + 1);
  }

  onOtpKeydown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !this.otpDigits[index] && index > 0) {
      this.focusOtp(index - 1);
    }
  }

  onOtpPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const digits = (event.clipboardData?.getData('text') ?? '').replace(/\D/g, '').slice(0, 6);
    digits.split('').forEach((d, i) => { this.otpDigits[i] = d; });
    this.refreshOtpInputs();
    const next = Math.min(digits.length, 5);
    this.focusOtp(next);
  }

  private focusOtp(index: number): void {
    const inputs = this.otpContainerRef?.nativeElement.querySelectorAll('input');
    (inputs?.[index] as HTMLInputElement | undefined)?.focus();
  }

  private refreshOtpInputs(): void {
    const inputs = this.otpContainerRef?.nativeElement.querySelectorAll('input');
    inputs?.forEach((el, i) => { (el as HTMLInputElement).value = this.otpDigits[i] ?? ''; });
  }

  // ── Step 2: Xác nhận OTP ──────────────────────────────
  onSubmitOtp(): void {
    if (this.otpCode.length !== 6) {
      this.errorMessage.set('Vui lòng nhập đủ 6 chữ số OTP.');
      return;
    }
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.verifyResetOtp({ email: this.savedEmail, otp: this.otpCode }).subscribe({
      next: res => {
        this.savedResetToken = res.data.resetToken;
        this.isLoading.set(false);
        this.step.set('new-password');
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        if (err.status === 400 || err.status === 404) {
          this.errorMessage.set('Mã OTP không đúng hoặc đã hết hạn. Vui lòng thử lại.');
        } else {
          this.errorMessage.set(this.resolveError(err));
        }
      },
    });
  }

  onResendOtp(): void {
    this.errorMessage.set(null);
    this.otpDigits = ['', '', '', '', '', ''];
    this.refreshOtpInputs();
    this.authService.forgotPassword({ email: this.savedEmail }).subscribe({
      next: () => this.errorMessage.set(null),
      error: () => this.errorMessage.set('Không thể gửi lại OTP. Vui lòng thử lại.'),
    });
  }

  // ── Step 3: Đặt mật khẩu mới ──────────────────────────
  onSubmitPassword(): void {
    if (this.pwdForm.invalid) { this.pwdForm.markAllAsTouched(); return; }
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.resetPassword({
      resetToken: this.savedResetToken,
      newPassword: this.pwdForm.value.newPassword!,
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.step.set('success');
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.errorMessage.set(this.resolveError(err));
      },
    });
  }

  private resolveError(err: HttpErrorResponse): string {
    if (err.status === 0) return 'Không thể kết nối. Vui lòng kiểm tra mạng.';
    return (err.error?.message as string) || 'Đã có lỗi xảy ra. Vui lòng thử lại.';
  }
}
