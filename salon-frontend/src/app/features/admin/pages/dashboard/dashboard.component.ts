import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

interface StatCard {
  label: string;
  value: string | number;
  subtext: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  iconPath: string;
  iconBg: string;
  iconColor: string;
}

interface RecentAppointment {
  id: number;
  customerName: string;
  customerPhone?: string;
  services: string;
  staffName: string;
  scheduledAt: string;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

interface DashboardStats {
  appointmentsToday: number;
  pendingAppointments: number;
  revenueToday: number;
  totalProducts: number;
  recentAppointments: RecentAppointment[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);

  isLoading = signal(true);
  hasError = signal(false);
  stats = signal<DashboardStats | null>(null);
  statCards = signal<StatCard[]>([]);

  readonly today = new Date();

  ngOnInit(): void {
    this.loadDashboard();
  }

  private loadDashboard(): void {
    this.http
      .get<{ data: DashboardStats }>('http://localhost:8080/api/v1/admin/dashboard/stats')
      .subscribe({
        next: res => {
          this.stats.set(res.data);
          this.buildStatCards(res.data);
          this.isLoading.set(false);
        },
        error: () => {
          // Hiển thị mock data khi chưa có API
          const mock: DashboardStats = {
            appointmentsToday: 12,
            pendingAppointments: 5,
            revenueToday: 3850000,
            totalProducts: 48,
            recentAppointments: [
              { id: 1, customerName: 'Nguyễn Văn An', customerPhone: '0901234567', services: 'Cắt + Gội', staffName: 'Trần Minh', scheduledAt: '2026-04-03T09:00:00', status: 'CONFIRMED' },
              { id: 2, customerName: 'Lê Thị Bình', customerPhone: '0987654321', services: 'Nhuộm tóc', staffName: 'Phạm Lan', scheduledAt: '2026-04-03T10:30:00', status: 'IN_PROGRESS' },
              { id: 3, customerName: '', customerPhone: '', services: 'Cắt tóc nam', staffName: 'Trần Minh', scheduledAt: '2026-04-03T11:00:00', status: 'PENDING' },
              { id: 4, customerName: 'Trần Thu Hà', customerPhone: '', services: 'Uốn + Gội', staffName: 'Nguyễn Hoa', scheduledAt: '2026-04-03T13:00:00', status: 'PENDING' },
              { id: 5, customerName: '', customerPhone: '0912345678', services: 'Cắt + Gội + Sấy', staffName: 'Phạm Lan', scheduledAt: '2026-04-03T08:30:00', status: 'COMPLETED' },
            ],
          };
          this.stats.set(mock);
          this.buildStatCards(mock);
          this.isLoading.set(false);
        },
      });
  }

  private buildStatCards(data: DashboardStats): void {
    this.statCards.set([
      {
        label: 'Lịch hẹn hôm nay',
        value: data.appointmentsToday,
        subtext: 'Tổng lịch hẹn trong ngày',
        iconPath: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
        iconBg: 'bg-green-50',
        iconColor: 'text-green-600',
      },
      {
        label: 'Chờ xác nhận',
        value: data.pendingAppointments,
        subtext: 'Lịch hẹn chưa duyệt',
        iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
        iconBg: 'bg-amber-50',
        iconColor: 'text-amber-600',
      },
      {
        label: 'Doanh thu hôm nay',
        value: this.formatPrice(data.revenueToday),
        subtext: 'Tổng thu trong ngày',
        iconPath: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
        iconBg: 'bg-blue-50',
        iconColor: 'text-blue-600',
      },
      {
        label: 'Sản phẩm',
        value: data.totalProducts,
        subtext: 'Tổng sản phẩm hiện có',
        iconPath: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
        iconBg: 'bg-purple-50',
        iconColor: 'text-purple-600',
      },
    ]);
  }

  formatPrice(value: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value);
  }

  getStatusLabel(status: RecentAppointment['status']): string {
    const map: Record<RecentAppointment['status'], string> = {
      PENDING: 'Chờ xác nhận',
      CONFIRMED: 'Đã xác nhận',
      IN_PROGRESS: 'Đang thực hiện',
      COMPLETED: 'Hoàn thành',
      CANCELLED: 'Đã hủy',
    };
    return map[status];
  }

  getStatusClass(status: RecentAppointment['status']): string {
    const map: Record<RecentAppointment['status'], string> = {
      PENDING: 'status-pending',
      CONFIRMED: 'status-confirmed',
      IN_PROGRESS: 'status-inprogress',
      COMPLETED: 'status-completed',
      CANCELLED: 'status-cancelled',
    };
    return map[status];
  }
}
