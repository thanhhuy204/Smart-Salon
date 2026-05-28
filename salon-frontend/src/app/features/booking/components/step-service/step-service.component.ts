import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceCategory, ServiceModel } from '../../../../core/models/service.model';
import { BookingService } from '../../../../core/services/booking.service';

@Component({
  selector: 'app-step-service',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step-service.component.html'
})
export class StepServiceComponent implements OnInit {
  private bookingService = inject(BookingService);

  @Input() selectedServices: ServiceModel[] = [];
  @Output() onNext = new EventEmitter<ServiceModel[]>();

  categories = signal<ServiceCategory[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  activeCategoryId = signal<number | null>(null);
  localSelected = signal<ServiceModel[]>([]);

  ngOnInit() {
    this.localSelected.set([...this.selectedServices]);
    
    this.bookingService.getServices().subscribe({
      next: (res) => {
        this.categories.set(res.data);
        if (res.data.length > 0) {
          this.activeCategoryId.set(res.data[0].categoryId);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Không thể tải danh sách dịch vụ.');
        this.isLoading.set(false);
      }
    });
  }

  toggleService(service: ServiceModel) {
    const current = this.localSelected();
    const index = current.findIndex(s => s.id === service.id);
    
    if (index > -1) {
      if (current.length === 1 && !this.error()) {
        // Optional warning or just let them deselect
      }
      this.localSelected.update(list => list.filter(s => s.id !== service.id));
    } else {
      this.localSelected.update(list => [...list, service]);
    }
  }

  isSelected(serviceId: number): boolean {
    return this.localSelected().some(s => s.id === serviceId);
  }

  getTotalPrice(): number {
    return this.localSelected().reduce((sum, item) => sum + item.price, 0);
  }

  handleNext() {
    if (this.localSelected().length === 0) {
      this.error.set('Vui lòng chọn ít nhất một dịch vụ để tiếp tục.');
      return;
    }
    this.error.set(null);
    this.onNext.emit(this.localSelected());
  }
}
