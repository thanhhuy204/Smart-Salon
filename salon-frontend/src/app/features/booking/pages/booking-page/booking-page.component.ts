import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ServiceModel } from '../../../../core/models/service.model';
import { StaffModel } from '../../../../core/models/staff.model';
import { BookingService } from '../../../../core/services/booking.service';
import { StepServiceComponent } from '../../components/step-service/step-service.component';
import { StepStaffComponent } from '../../components/step-staff/step-staff.component';
import { StepTimeComponent } from '../../components/step-time/step-time.component';
import { StepConfirmComponent } from '../../components/step-confirm/step-confirm.component';

export interface BookingState {
  services: ServiceModel[];
  staff: StaffModel | null | 'ANY';
  date: string | null;
  time: string | null;
}

@Component({
  selector: 'app-booking-page',
  standalone: true,
  imports: [CommonModule, StepServiceComponent, StepStaffComponent, StepTimeComponent, StepConfirmComponent],
  templateUrl: './booking-page.component.html',
  styleUrl: './booking-page.component.scss'
})
export class BookingPageComponent {
  private bookingService = inject(BookingService);
  private router = inject(Router);

  currentStep = signal<number>(1);
  bookingState = signal<BookingState>({
    services: [],
    staff: null,
    date: null,
    time: null,
  });
  isSubmitting = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  steps = [
    { title: 'Dịch vụ' },
    { title: 'Chọn thợ' },
    { title: 'Thời gian' },
    { title: 'Xác nhận' },
  ];

  goToStep(step: number) {
    if (step < this.currentStep()) {
      this.currentStep.set(step);
    }
  }

  onServicesSelected(services: ServiceModel[]) {
    this.bookingState.update(state => ({ ...state, services }));
    this.currentStep.set(2);
  }

  onStaffSelected(staff: StaffModel | 'ANY') {
    this.bookingState.update(state => ({ ...state, staff }));
    this.currentStep.set(3);
  }

  onTimeSelected(selection: { date: string, time: string }) {
    this.bookingState.update(state => ({ ...state, date: selection.date, time: selection.time }));
    this.currentStep.set(4);
  }

  goBack() {
    if (this.currentStep() > 1) {
      this.currentStep.update(s => s - 1);
    }
  }

  submitBooking() {
    const state = this.bookingState();
    if (!state.date || !state.time || state.services.length === 0) return;

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const payload = {
      serviceIds: state.services.map(s => s.id),
      staffId: state.staff === 'ANY' || !state.staff ? null : state.staff.id,
      apptDate: state.date,
      startTime: state.time
    };

    this.bookingService.submitBooking(payload).subscribe({
      next: (res: any) => {
        this.isSubmitting.set(false);
        this.router.navigate(['/booking/success'], { state: { booking: res.data } });
      },
      error: (err: any) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.error?.message || 'Đã có lỗi xảy ra khi đặt lịch. Vui lòng thử lại.');
      }
    });
  }
}
