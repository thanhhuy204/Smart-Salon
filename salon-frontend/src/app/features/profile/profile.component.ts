import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { AppointmentSummary, OrderSummary } from '../../core/models/user.model';
import { CurrentUser } from '../../core/models/auth.model';

type ActiveTab = 'profile' | 'history';
type HistoryTab = 'appointments' | 'orders';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private userService = inject(UserService);

  currentUser = this.authService.currentUser;
  activeTab = signal<ActiveTab>('profile');
  activeHistoryTab = signal<HistoryTab>('appointments');

  // Profile form state
  isSaving = signal(false);
  successMsg = signal<string | null>(null);
  profileErrorMsg = signal<string | null>(null);
  avatarPreview = signal<string | null>(null);
  isUploadingAvatar = signal(false);

  profileForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.pattern(/^0\d{9}$/)]],
  });

  get pf() { return this.profileForm.controls; }

  // History state
  appointments = signal<AppointmentSummary[]>([]);
  orders = signal<OrderSummary[]>([]);
  appointmentsLoaded = signal(false);
  ordersLoaded = signal(false);
  loadingAppointments = signal(false);
  loadingOrders = signal(false);
  appointmentError = signal<string | null>(null);
  orderError = signal<string | null>(null);

  ngOnInit(): void {
    const user = this.currentUser();
    if (user) {
      this.profileForm.patchValue({ fullName: user.fullName, phone: user.phone });
    }
    this.loadAppointments();
  }

  setTab(tab: ActiveTab): void {
    this.activeTab.set(tab);
    if (tab === 'history') {
      if (this.activeHistoryTab() === 'appointments') this.loadAppointments();
      else this.loadOrders();
    }
  }

  setHistoryTab(tab: HistoryTab): void {
    this.activeHistoryTab.set(tab);
    if (tab === 'appointments') this.loadAppointments();
    else this.loadOrders();
  }

  loadAppointments(): void {
    if (this.appointmentsLoaded()) return;
    this.loadingAppointments.set(true);
    this.appointmentError.set(null);
    this.userService.getMyAppointments().subscribe({
      next: res => {
        this.appointments.set(res.data);
        this.appointmentsLoaded.set(true);
        this.loadingAppointments.set(false);
      },
      error: () => {
        this.appointmentError.set('Không thể tải dữ liệu. Vui lòng thử lại.');
        this.loadingAppointments.set(false);
      },
    });
  }

  loadOrders(): void {
    if (this.ordersLoaded()) return;
    this.loadingOrders.set(true);
    this.orderError.set(null);
    this.userService.getMyOrders().subscribe({
      next: res => {
        this.orders.set(res.data);
        this.ordersLoaded.set(true);
        this.loadingOrders.set(false);
      },
      error: () => {
        this.orderError.set('Không thể tải dữ liệu. Vui lòng thử lại.');
        this.loadingOrders.set(false);
      },
    });
  }

  onAvatarChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      alert('Vui lòng chọn file ảnh JPG hoặc PNG.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Dung lượng ảnh không được vượt quá 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => this.avatarPreview.set(reader.result as string);
    reader.readAsDataURL(file);

    this.isUploadingAvatar.set(true);
    this.userService.uploadAvatar(file).subscribe({
      next: res => {
        this.authService.updateCurrentUser(res.data as unknown as CurrentUser);
        this.isUploadingAvatar.set(false);
        this.avatarPreview.set(null);
      },
      error: () => {
        this.isUploadingAvatar.set(false);
        this.avatarPreview.set(null);
        alert('Không thể tải ảnh lên. Vui lòng thử lại.');
      },
    });
  }

  onSaveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    this.isSaving.set(true);
    this.successMsg.set(null);
    this.profileErrorMsg.set(null);

    const { fullName, phone } = this.profileForm.value;
    this.userService.updateProfile({ fullName: fullName!, phone: phone! }).subscribe({
      next: res => {
        this.authService.updateCurrentUser(res.data as unknown as CurrentUser);
        this.isSaving.set(false);
        this.successMsg.set('Cập nhật thông tin thành công.');
        setTimeout(() => this.successMsg.set(null), 3000);
      },
      error: (err: HttpErrorResponse) => {
        this.isSaving.set(false);
        this.profileErrorMsg.set(
          err.status === 409
            ? 'Số điện thoại đã được sử dụng bởi tài khoản khác.'
            : 'Cập nhật thất bại. Vui lòng thử lại.'
        );
      },
    });
  }

  cancelAppointment(id: number): void {
    if (!confirm('Bạn có chắc muốn hủy lịch hẹn này không?')) return;
    this.userService.cancelAppointment(id).subscribe({
      next: () =>
        this.appointments.update(list =>
          list.map(a => (a.id === id ? { ...a, status: 'CANCELLED' as const } : a))
        ),
      error: () => alert('Không thể hủy lịch hẹn. Vui lòng thử lại.'),
    });
  }

  cancelOrder(id: number): void {
    if (!confirm('Bạn có chắc muốn hủy đơn hàng này không?')) return;
    this.userService.cancelOrder(id).subscribe({
      next: () =>
        this.orders.update(list =>
          list.map(o => (o.id === id ? { ...o, status: 'CANCELLED' as const } : o))
        ),
      error: () => alert('Không thể hủy đơn hàng. Vui lòng thử lại.'),
    });
  }

  getAppointmentStatusLabel(status: string): string {
    const map: Record<string, string> = {
      PENDING: 'Chờ xác nhận', CONFIRMED: 'Đã xác nhận',
      IN_PROGRESS: 'Đang thực hiện', COMPLETED: 'Hoàn thành', CANCELLED: 'Đã hủy',
    };
    return map[status] ?? status;
  }

  getOrderStatusLabel(status: string): string {
    const map: Record<string, string> = {
      PENDING: 'Chờ xác nhận', PROCESSING: 'Đang xử lý',
      SHIPPING: 'Đang giao', COMPLETED: 'Hoàn thành', CANCELLED: 'Đã hủy',
    };
    return map[status] ?? status;
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      CONFIRMED: 'bg-blue-100 text-blue-700 border-blue-200',
      IN_PROGRESS: 'bg-orange-100 text-orange-700 border-orange-200',
      PROCESSING: 'bg-orange-100 text-orange-700 border-orange-200',
      SHIPPING: 'bg-blue-100 text-blue-700 border-blue-200',
      COMPLETED: 'bg-green-100 text-green-700 border-green-200',
      CANCELLED: 'bg-red-100 text-red-700 border-red-200',
    };
    return map[status] ?? 'bg-gray-100 text-gray-700 border-gray-200';
  }

  formatPrice(price: number): string {
    return price.toLocaleString('vi-VN') + ' ₫';
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }
}
