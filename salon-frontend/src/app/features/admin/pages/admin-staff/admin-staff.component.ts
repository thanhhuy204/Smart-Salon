import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StaffModel } from '../../../../core/models/staff.model';
import { AdminStaffService } from '../../../../core/services/admin/admin-staff.service';

@Component({
  selector: 'app-admin-staff',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-staff.component.html'
})
export class AdminStaffComponent implements OnInit {
  private staffService = inject(AdminStaffService);

  staffs = signal<StaffModel[]>([]);
  isLoading = signal<boolean>(true);
  
  // Search
  searchQuery = signal<string>('');
  filteredStaffs = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.staffs().filter(s => s.fullName.toLowerCase().includes(query) || (s.bio && s.bio.toLowerCase().includes(query)));
  });

  // Modal State
  showFormModal = signal<boolean>(false);
  isEditing = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  formError = signal<string | null>(null);
  
  // Current Editing Model
  editingStaff = signal<Partial<StaffModel>>({});
  selectedFile = signal<File | null>(null);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);
    this.staffService.getAllStaffs().subscribe({
      next: (res) => {
        // Assume API returns isActive or we default to true
        const mapped = res.data.map(s => ({...s, isActive: s.isActive !== undefined ? s.isActive : true}));
        this.staffs.set(mapped);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  // --- ACTIONS ---

  openAddForm() {
    this.isEditing.set(false);
    this.editingStaff.set({ fullName: '', bio: '', avatarUrl: '' });
    this.selectedFile.set(null);
    this.formError.set(null);
    this.showFormModal.set(true);
  }

  openEditForm(staff: StaffModel) {
    this.isEditing.set(true);
    this.editingStaff.set({ ...staff });
    this.selectedFile.set(null);
    this.formError.set(null);
    this.showFormModal.set(true);
  }

  closeFormModal() {
    this.showFormModal.set(false);
  }

  updateStaffField(field: string, value: any) {
    this.editingStaff.update(s => ({ ...s, [field]: value }));
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile.set(file);
      // Optional: create local preview url if it is image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.editingStaff.update(s => ({ ...s, avatarUrl: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  }

  submitForm() {
    const payload = this.editingStaff();
    if (!payload.fullName?.trim()) {
      this.formError.set('Vui lòng nhập tên nhân viên.');
      return;
    }

    const formData = new FormData();
    formData.append('fullName', payload.fullName);
    if (payload.bio) formData.append('bio', payload.bio);
    
    // Nếu API có thêm field, ta map vào đây, vd formData.append('phone', payload.phone);
    
    const file = this.selectedFile();
    if (file) {
      formData.append('file', file);
    }

    this.isSubmitting.set(true);
    if (this.isEditing() && payload.id) {
      this.staffService.updateStaff(payload.id, formData).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.closeFormModal();
          this.loadData();
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.formError.set(err.error?.message || 'Có lỗi khi lưu.');
        }
      });
    } else {
      this.staffService.createStaff(formData).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.closeFormModal();
          this.loadData();
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.formError.set(err.error?.message || 'Có lỗi khi tạọ.');
        }
      });
    }
  }

  toggleStatus(staff: StaffModel) {
    const msg = staff.isActive 
      ? `Bạn có chắc muốn vô hiệu hóa nhân viên ${staff.fullName}? Họ sẽ không nhận được lịch mới.`
      : `Bật hoạt động lại cho ${staff.fullName}?`;
      
    if (confirm(msg)) {
      this.staffService.toggleStaffStatus(staff.id, !staff.isActive).subscribe({
        next: () => this.loadData(),
        error: (err) => alert(err.error?.message || 'Có lỗi xảy ra!')
      });
    }
  }

  deleteStaff(id: number, name: string) {
    if (confirm(`Xóa nhân viên ${name} vĩnh viễn? Cảnh báo: Việc này có thể gây lỗi nếu thợ đang có lịch hẹn. Nên sử dụng tính năng Vô hiệu hóa thay vì Xóa.`)) {
      this.staffService.deleteStaff(id).subscribe({
        next: () => this.loadData(),
        error: (err) => alert(err.error?.message || 'Không thể xóa thợ. Thợ đang có lịch hẹn chờ xử lý.')
      });
    }
  }
}
