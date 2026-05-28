import { Component, EventEmitter, Input, OnInit, Output, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StaffModel } from '../../../../core/models/staff.model';
import { AvailableSlot } from '../../../../core/models/appointment.model';
import { BookingService } from '../../../../core/services/booking.service';

@Component({
  selector: 'app-step-time',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step-time.component.html'
})
export class StepTimeComponent implements OnInit {
  private bookingService = inject(BookingService);

  @Input() staff: StaffModel | 'ANY' | null = null;
  @Input() selectedDate: string | null = null;
  @Input() selectedTime: string | null = null;
  
  @Output() onNext = new EventEmitter<{date: string, time: string}>();
  @Output() onBack = new EventEmitter<void>();

  slots = signal<AvailableSlot[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  currentDate = signal<string>('');
  currentTime = signal<string | null>(null);
  minDate: string;

  constructor() {
    const today = new Date();
    // Lấy ngày hiện tại theo giờ địa phương thay vì lấy theo UTC
    const offset = today.getTimezoneOffset() * 60000;
    const localToday = new Date(today.getTime() - offset);
    this.minDate = localToday.toISOString().split('T')[0];
    
    // Auto trigger fetch when date changes
    effect(() => {
      const date = this.currentDate();
      if (date) {
        this.fetchSlots(date);
      }
    });
  }

  ngOnInit() {
    this.currentDate.set(this.selectedDate || this.minDate);
    this.currentTime.set(this.selectedTime);
  }

  fetchSlots(date: string) {
    this.isLoading.set(true);
    this.error.set(null);
    this.slots.set([]);
    this.currentTime.set(null); // Reset time when date changes
    
    const staffId = this.staff === 'ANY' || !this.staff ? null : this.staff.id;
    
    this.bookingService.getAvailableSlots(date, staffId).subscribe({
      next: (res) => {
        let fetchedSlots = res.data;
        
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000;
        const localTodayStr = new Date(now.getTime() - offset).toISOString().split('T')[0];

        // Nếu ngày đang chọn là hôm nay, lấy giờ hiện tại để lọc các khung giờ đã đi qua
        if (date === localTodayStr) {
          const currentHour = now.getHours();
          const currentMinute = now.getMinutes();
          
          // Ẩn (xóa khỏi mảng) các khung giờ có thời gian bắt đầu trước hiện tại
          fetchedSlots = fetchedSlots.filter(slot => {
            const [slotHour, slotMinute] = slot.startTime.split(':').map(Number);
            return slotHour > currentHour || (slotHour === currentHour && slotMinute > currentMinute);
          });
        }

        this.slots.set(fetchedSlots);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Không thể tải các khung giờ. Vui lòng thử lại.');
        this.isLoading.set(false);
      }
    });
  }

  selectTime(slot: AvailableSlot) {
    if (!slot.isAvailable) return;
    this.currentTime.set(slot.startTime);
  }

  handleNext() {
    if (!this.currentDate() || !this.currentTime()) {
      this.error.set('Vui lòng chọn ngày và giờ.');
      return;
    }
    this.error.set(null);
    this.onNext.emit({ date: this.currentDate(), time: this.currentTime()! });
  }
}
