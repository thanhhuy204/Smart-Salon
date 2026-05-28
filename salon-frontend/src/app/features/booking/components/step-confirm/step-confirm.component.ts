import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingState } from '../../pages/booking-page/booking-page.component';
import { ServiceModel } from '../../../../core/models/service.model';

@Component({
  selector: 'app-step-confirm',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step-confirm.component.html'
})
export class StepConfirmComponent {
  @Input() state!: BookingState;
  @Input() isSubmitting: boolean = false;
  
  @Output() onConfirm = new EventEmitter<void>();
  @Output() onBack = new EventEmitter<void>();

  getTotalDuration(): number {
    if (!this.state?.services) return 0;
    return this.state.services.reduce((sum: number, item: ServiceModel) => sum + item.durationM, 0);
  }

  getTotalPrice(): number {
    if (!this.state?.services) return 0;
    return this.state.services.reduce((sum: number, item: ServiceModel) => sum + item.price, 0);
  }

  getEndTime(): string {
    if (!this.state?.time) return '';
    const duration = this.getTotalDuration();
    const [hours, minutes] = this.state.time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes + duration, 0);
    return date.toTimeString().substring(0, 5);
  }
}
