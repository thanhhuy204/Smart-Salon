import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentModel, AppointmentStatus } from '../../../../core/models/appointment.model';
import { AdminAppointmentService } from '../../../../core/services/admin/admin-appointment.service';
import { StaffModel } from '../../../../core/models/staff.model';
import { BookingService } from '../../../../core/services/booking.service';

@Component({
  selector: 'app-admin-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-appointments.component.html'
})
export class AdminAppointmentsComponent implements OnInit {
  private appointmentService = inject(AdminAppointmentService);
  private bookingService = inject(BookingService);

  appointments = signal<AppointmentModel[]>([]);

  filteredAppointments = computed(() => {
    const name = this.searchName().trim().toLowerCase();
    const phone = this.searchPhone().trim();
    const date = this.searchDate();

    return this.appointments().filter(appt => {
      const matchName = !name || (appt.customerName || '').toLowerCase().includes(name);
      const matchPhone = !phone || (appt.customerPhone || '').includes(phone);
      const matchDate = !date || (appt.apptDate || '') === date;
      return matchName && matchPhone && matchDate;
    });
  });
  isLoading = signal<boolean>(true);
  
  // Filters
  filterStatus = signal<AppointmentStatus | ''>('');

  // Search
  searchName = signal<string>('');
  searchPhone = signal<string>('');
  searchDate = signal<string>('');

  // Modals Data
  showAssignModal = signal<boolean>(false);
  showRejectModal = signal<boolean>(false);
  
  selectedAppt = signal<AppointmentModel | null>(null);
  rejectReason = signal<string>('');
  
  staffs = signal<StaffModel[]>([]);
  selectedStaffId = signal<number | null>(null);

  isActionLoading = signal<boolean>(false);
  actionError = signal<string | null>(null);

  ngOnInit() {
    this.loadData();
    this.loadStaffs();
  }

  loadData() {
    this.isLoading.set(true);
    this.appointmentService.getAllAppointments(this.filterStatus(), 0, 50).subscribe({
      next: (res) => {
        this.appointments.set(res.data.content);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  loadStaffs() {
    this.bookingService.getStaffs().subscribe({
      next: (res) => {
        this.staffs.set(res.data);
      }
    });
  }

  onFilterChange(status: any) {
    this.filterStatus.set(status);
    this.loadData();
  }

  onSearchChange() {
    // Filtering is reactive via computed signal, nothing needed here
  }

  clearSearch() {
    this.searchName.set('');
    this.searchPhone.set('');
    this.searchDate.set('');
  }

  // --- ACTIONS ---

  openAssignModal(appt: AppointmentModel) {
    this.selectedAppt.set(appt);
    this.selectedStaffId.set(appt.staffId || null);
    this.actionError.set(null);
    this.showAssignModal.set(true);
  }

  closeAssignModal() {
    this.showAssignModal.set(false);
    this.selectedAppt.set(null);
  }

  submitAssign() {
    const appt = this.selectedAppt();
    const staffId = this.selectedStaffId();
    if (!appt || !staffId) {
      this.actionError.set('Vui lòng chọn thợ để phân công.');
      return;
    }

    this.isActionLoading.set(true);
    this.appointmentService.assignStaff(appt.id, staffId).subscribe({
      next: () => {
        // If it was PENDING, typically we also CONFIRM it, or the backend does it.
        // Assuming backend handles status update to CONFIRM automatically on Assign, or we do it.
        this.isActionLoading.set(false);
        this.closeAssignModal();
        this.loadData();
      },
      error: (err) => {
        this.isActionLoading.set(false);
        this.actionError.set(err.error?.message || 'Có lỗi xảy ra khi phân công.');
      }
    });
  }

  openRejectModal(appt: AppointmentModel) {
    this.selectedAppt.set(appt);
    this.rejectReason.set('');
    this.actionError.set(null);
    this.showRejectModal.set(true);
  }

  closeRejectModal() {
    this.showRejectModal.set(false);
    this.selectedAppt.set(null);
  }

  submitReject() {
    const appt = this.selectedAppt();
    const reason = this.rejectReason().trim();
    if (!appt || !reason) {
      this.actionError.set('Vui lòng nhập lý do từ chối.');
      return;
    }

    this.isActionLoading.set(true);
    // Determine target status. If PENDING -> REJECTED/CANCELLED. Using CANCELLED as it shares meaning in some contexts,
    // though BS specifies "Từ chối". We'll use CANCELLED so it displays correctly in Profile too.
    this.appointmentService.updateAppointmentStatus(appt.id, AppointmentStatus.CANCELLED, reason).subscribe({
      next: () => {
        this.isActionLoading.set(false);
        this.closeRejectModal();
        this.loadData();
      },
      error: (err) => {
        this.isActionLoading.set(false);
        this.actionError.set(err.error?.message || 'Có lỗi xảy ra khi từ chối.');
      }
    });
  }

  directConfirm(appt: AppointmentModel) {
    // Confirm directly if staff is already assigned
    if (!appt.staffId && (!appt.staffName || appt.staffName === 'Bất kỳ thợ nào')) { // Simplified check
      this.openAssignModal(appt);
      return;
    }

    if(confirm(`Xác nhận lịch hẹn #${appt.id}?`)) {
      this.appointmentService.updateAppointmentStatus(appt.id, AppointmentStatus.CONFIRMED).subscribe({
        next: () => this.loadData(),
        error: (err) => alert(err.error?.message || 'Lỗi xác nhận')
      });
    }
  }

  directComplete(appt: AppointmentModel) {
    if(confirm(`Xác nhận hoàn thành lịch hẹn #${appt.id}?`)) {
      this.appointmentService.updateAppointmentStatus(appt.id, AppointmentStatus.COMPLETED).subscribe({
        next: () => this.loadData(),
        error: (err) => alert(err.error?.message || 'Lỗi xác nhận hoàn thành')
      });
    }
  }

  directDelete(appt: AppointmentModel) {
    if(confirm(`Xác nhận xóa vĩnh viễn lịch hẹn #${appt.id}? Thao tác này không thể hoàn tác.`)) {
      this.isActionLoading.set(true);
      this.appointmentService.deleteAppointment(appt.id).subscribe({
        next: () => {
          this.isActionLoading.set(false);
          this.loadData();
        },
        error: (err) => {
          this.isActionLoading.set(false);
          alert(err.error?.message || 'Lỗi xóa lịch hẹn');
        }
      });
    }
  }

  // --- UI HELPERS ---

  getStatusClass(status: AppointmentStatus): string {
    switch(status) {
      case AppointmentStatus.PENDING: return 'bg-yellow-100 text-yellow-800';
      case AppointmentStatus.CONFIRMED: return 'bg-blue-100 text-blue-800';
      case AppointmentStatus.IN_PROGRESS: return 'bg-orange-100 text-orange-800';
      case AppointmentStatus.COMPLETED: return 'bg-green-100 text-green-800';
      case AppointmentStatus.CANCELLED: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusLabel(status: AppointmentStatus): string {
    switch(status) {
      case AppointmentStatus.PENDING: return 'Chờ Duyệt';
      case AppointmentStatus.CONFIRMED: return 'Đã Xác Nhận';
      case AppointmentStatus.IN_PROGRESS: return 'Đang Thực Hiện';
      case AppointmentStatus.COMPLETED: return 'Hoàn Thành';
      case AppointmentStatus.CANCELLED: return 'Hủy/Từ chối';
      default: return status;
    }
  }
}
