import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffModel } from '../../../../core/models/staff.model';
import { BookingService } from '../../../../core/services/booking.service';

@Component({
  selector: 'app-step-staff',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step-staff.component.html'
})
export class StepStaffComponent implements OnInit {
  private bookingService = inject(BookingService);

  @Input() selectedStaff: StaffModel | 'ANY' | null = null;
  @Output() onNext = new EventEmitter<StaffModel | 'ANY'>();
  @Output() onBack = new EventEmitter<void>();

  staffs = signal<StaffModel[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  localSelected = signal<StaffModel | 'ANY' | null>(null);

  ngOnInit() {
    this.localSelected.set(this.selectedStaff);
    
    this.bookingService.getStaffs().subscribe({
      next: (res) => {
        this.staffs.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Không thể tải danh sách thợ.');
        this.isLoading.set(false);
      }
    });
  }

  selectStaff(staff: StaffModel | 'ANY') {
    this.localSelected.set(staff);
  }

  isSelectedStaff(staffId: number): boolean {
    const selected = this.localSelected();
    if (selected === 'ANY' || !selected) return false;
    return selected.id === staffId;
  }

  handleNext() {
    if (!this.localSelected()) {
      this.error.set('Vui lòng chọn một thợ để tiếp tục.');
      return;
    }
    this.error.set(null);
    this.onNext.emit(this.localSelected()!);
  }
}
