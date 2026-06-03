import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppointmentModel, AppointmentStatus } from '../../../../core/models/appointment.model';
import { AppointmentService } from '../../../../core/services/appointment.service';
import { StaffReviewService } from '../../../../core/services/staff-review.service';
import { StaffReviewModel } from '../../../../core/models/staff-review.model';

type CurrentTab = 'UPCOMING' | 'COMPLETED' | 'CANCELLED';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './appointments.component.html'
})
export class AppointmentsComponent implements OnInit {
  private appointmentService = inject(AppointmentService);
  private staffReviewService = inject(StaffReviewService);

  activeTab = signal<CurrentTab>('UPCOMING');
  appointments = signal<AppointmentModel[]>([]);
  isLoading = signal<boolean>(true);

  // Modal Details State
  showDetailsModal = signal<boolean>(false);
  selectedDetails = signal<AppointmentModel | null>(null);
  isLoadingDetails = signal<boolean>(false);

  // Modal Cancel State
  showCancelModal = signal<boolean>(false);
  selectedApptId = signal<number | null>(null);
  cancelReason = signal<string>('');
  isCancelling = signal<boolean>(false);
  cancelError = signal<string | null>(null);

  // Modal Review (Create) State
  showReviewModal = signal<boolean>(false);
  selectedReviewAppt = signal<AppointmentModel | null>(null);
  reviewRating = signal<number>(0);
  hoverRating = signal<number>(0);
  reviewComment = signal<string>('');
  isSubmittingReview = signal<boolean>(false);
  submitReviewError = signal<string | null>(null);

  // Modal View Review State
  showViewReviewModal = signal<boolean>(false);
  currentReviewDetails = signal<StaffReviewModel | null>(null);
  isLoadingReviewDetails = signal<boolean>(false);

  ngOnInit() {
    this.loadAppointments();
  }

  setTab(tab: CurrentTab) {
    this.activeTab.set(tab);
    this.loadAppointments();
  }

  loadAppointments() {
    this.isLoading.set(true);
    this.appointmentService.getMyAppointments(undefined, 0, 50).subscribe({
      next: (res) => {
        let list = res.data.content;
        
        if (this.activeTab() === 'UPCOMING') {
          list = list.filter(a => a.status === 'PENDING' || a.status === 'CONFIRMED');
        } else if (this.activeTab() === 'COMPLETED') {
          list = list.filter(a => a.status === 'COMPLETED' || a.status === 'IN_PROGRESS');
        } else {
          list = list.filter(a => a.status === 'CANCELLED');
        }

        this.appointments.set(list);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  openCancelModal(id: number) {
    this.selectedApptId.set(id);
    this.cancelReason.set('');
    this.cancelError.set(null);
    this.showCancelModal.set(true);
  }

  closeCancelModal() {
    this.showCancelModal.set(false);
    this.selectedApptId.set(null);
  }

  submitCancel() {
    const id = this.selectedApptId();
    const reason = this.cancelReason().trim();

    if (!id || !reason) {
      this.cancelError.set("Vui lòng nhập lý do hủy lịch.");
      return;
    }

    this.isCancelling.set(true);
    this.cancelError.set(null);

    this.appointmentService.cancelAppointment(id, { cancelReason: reason }).subscribe({
      next: () => {
        this.isCancelling.set(false);
        this.closeCancelModal();
        this.loadAppointments();
      },
      error: (err) => {
        this.isCancelling.set(false);
        this.cancelError.set(err.error?.message || "Không thể hủy lịch. Lịch có thể đã được Admin xử lý.");
        this.loadAppointments();
      }
    });
  }

  viewDetails(id: number) {
    this.isLoadingDetails.set(true);
    this.showDetailsModal.set(true);
    this.selectedDetails.set(null);
    
    this.appointmentService.getAppointmentDetail(id).subscribe({
      next: (res) => {
        this.selectedDetails.set(res.data);
        this.isLoadingDetails.set(false);
      },
      error: () => {
        this.isLoadingDetails.set(false);
      }
    });
  }

  closeDetailsModal() {
    this.showDetailsModal.set(false);
    this.selectedDetails.set(null);
  }

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
      case AppointmentStatus.COMPLETED: return 'Đã Hoàn Thành';
      case AppointmentStatus.CANCELLED: return 'Đã Hủy';
      default: return status;
    }
  }

  // --- REVIEW METHODS ---
  openReviewModal(appt: AppointmentModel) {
    this.selectedReviewAppt.set(appt);
    this.reviewRating.set(0);
    this.hoverRating.set(0);
    this.reviewComment.set('');
    this.submitReviewError.set(null);
    this.isSubmittingReview.set(false);
    this.showReviewModal.set(true);
  }

  closeReviewModal() {
    this.showReviewModal.set(false);
    this.selectedReviewAppt.set(null);
  }

  setReviewRating(rating: number) {
    this.reviewRating.set(rating);
  }

  submitReview() {
    const appt = this.selectedReviewAppt();
    const rating = this.reviewRating();
    const comment = this.reviewComment().trim();

    if (!appt) return;
    if (rating < 1 || rating > 5) {
      this.submitReviewError.set("Vui lòng chọn số sao đánh giá (1-5 sao).");
      return;
    }

    this.isSubmittingReview.set(true);
    this.submitReviewError.set(null);

    this.staffReviewService.createReview({
      appointmentId: appt.id,
      rating: rating,
      comment: comment || undefined
    }).subscribe({
      next: () => {
        this.isSubmittingReview.set(false);
        this.closeReviewModal();
        
        // Update local appointment state so "Đánh giá Stylist" button immediately changes to "Xem đánh giá"
        this.appointments.update(list => 
          list.map(item => item.id === appt.id ? { ...item, isReviewed: true } : item)
        );
      },
      error: (err) => {
        this.isSubmittingReview.set(false);
        this.submitReviewError.set(err.error?.message || "Không thể gửi đánh giá. Vui lòng thử lại sau.");
      }
    });
  }

  openViewReviewModal(appt: AppointmentModel) {
    this.selectedReviewAppt.set(appt);
    this.isLoadingReviewDetails.set(true);
    this.currentReviewDetails.set(null);
    this.showViewReviewModal.set(true);

    this.staffReviewService.getReviewByAppointmentId(appt.id).subscribe({
      next: (res) => {
        this.currentReviewDetails.set(res.data);
        this.isLoadingReviewDetails.set(false);
      },
      error: () => {
        this.isLoadingReviewDetails.set(false);
      }
    });
  }

  closeViewReviewModal() {
    this.showViewReviewModal.set(false);
    this.currentReviewDetails.set(null);
    this.selectedReviewAppt.set(null);
  }
}
