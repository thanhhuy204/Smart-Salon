import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceCategory, ServiceModel } from '../../../../core/models/service.model';
import { AdminServiceService } from '../../../../core/services/admin/admin-service.service';

type TabView = 'SERVICES' | 'CATEGORIES';

@Component({
  selector: 'app-admin-services',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-services.component.html'
})
export class AdminServicesComponent implements OnInit {
  private adminService = inject(AdminServiceService);

  activeTab = signal<TabView>('SERVICES');
  categories = signal<ServiceCategory[]>([]);
  isLoading = signal<boolean>(true);

  // Search in services tab
  searchQuery = signal<string>('');
  filteredCategories = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.categories();
    return this.categories().map(cat => ({
      ...cat,
      services: cat.services.filter(s => s.name.toLowerCase().includes(query))
    })).filter(cat => cat.services.length > 0);
  });

  // Accordion UI State
  expandedCats = signal<Record<number, boolean>>({});

  // Form State - Service
  showServiceModal = signal<boolean>(false);
  isEditing = signal<boolean>(false);
  editingService = signal<Partial<ServiceModel>>({});
  editingCategoryId = signal<number | null>(null);

  // Form State - Category
  newCategoryName = signal<string>('');

  isActionLoading = signal<boolean>(false);
  actionError = signal<string | null>(null);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);
    // Giả định fallback call nếu chưa có API Grouped, tạm call getAllCategories (vì trong đó có nhúng sẵn mảng services theo code cũ BookingService)
    this.adminService.getAllCategories().subscribe({
      next: (res) => {
        // Assume default expanded map
        const expMap: Record<number, boolean> = {};
        res.data.forEach(c => expMap[c.categoryId] = true);
        this.expandedCats.set(expMap);
        
        // Ensure isActive is populated
        const mapped = res.data.map(c => ({
          ...c,
          services: c.services.map(s => ({ ...s, isActive: s.isActive !== undefined ? s.isActive : true }))
        }));
        
        this.categories.set(mapped);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  toggleAccordion(catId: number) {
    this.expandedCats.update(curr => ({ ...curr, [catId]: !curr[catId] }));
  }

  setTab(tab: TabView) {
    this.activeTab.set(tab);
  }

  // --- CATEGORY ACTIONS ---
  addCategory() {
    const name = this.newCategoryName().trim();
    if (!name) return;
    this.isActionLoading.set(true);
    this.adminService.createCategory(name).subscribe({
      next: () => {
        this.newCategoryName.set('');
        this.isActionLoading.set(false);
        this.loadData();
      },
      error: (err) => {
        this.isActionLoading.set(false);
        alert(err.error?.message || 'Có lỗi thêm danh mục.');
      }
    });
  }

  deleteCategory(cat: ServiceCategory) {
    if (cat.services && cat.services.length > 0) {
      alert("Phải di chuyển hoặc xóa hết dịch vụ bên trong trước khi xoá danh mục.");
      return;
    }
    if (confirm(`Xóa danh mục: ${cat.categoryName}?`)) {
      this.adminService.deleteCategory(cat.categoryId).subscribe({
        next: () => this.loadData(),
        error: (err) => alert(err.error?.message || 'Lỗi!')
      });
    }
  }

  // --- SERVICE ACTIONS ---

  openAddService() {
    this.isEditing.set(false);
    this.editingService.set({ name: '', price: 0, durationM: 15, description: '' });
    // Default cat selection
    this.editingCategoryId.set(this.categories().length > 0 ? this.categories()[0].categoryId : null);
    this.actionError.set(null);
    this.showServiceModal.set(true);
  }

  openEditService(srv: ServiceModel, catId: number) {
    this.isEditing.set(true);
    // Shallow copy
    this.editingService.set({ ...srv });
    this.editingCategoryId.set(catId);
    this.actionError.set(null);
    this.showServiceModal.set(true);
  }

  closeServiceModal() {
    this.showServiceModal.set(false);
  }

  updateServiceField(field: string, value: any) {
    this.editingService.update(s => ({ ...s, [field]: value }));
  }

  submitServiceForm() {
    const payload = this.editingService();
    const catId = this.editingCategoryId();

    if (!payload.name?.trim()) {
      this.actionError.set('Vui lòng nhập tên dịch vụ.');
      return;
    }
    if (!payload.price || payload.price < 0) {
      this.actionError.set('Mức giá không hợp lệ.');
      return;
    }
    if (!payload.durationM || payload.durationM < 15) {
      this.actionError.set('Thời gian phải từ 15 phút trở lên.');
      return;
    }
    if (!catId) {
      this.actionError.set('Vui lòng chọn danh mục.');
      return;
    }

    this.isActionLoading.set(true);
    if (this.isEditing() && payload.id) {
      this.adminService.updateService(payload.id, payload).subscribe({
        next: () => {
          this.isActionLoading.set(false);
          this.closeServiceModal();
          this.loadData();
        },
        error: (err) => {
          this.isActionLoading.set(false);
          this.actionError.set(err.error?.message || 'Có lỗi sửa dịch vụ.');
        }
      });
    } else {
      this.adminService.createService(catId, payload).subscribe({
        next: () => {
          this.isActionLoading.set(false);
          this.closeServiceModal();
          this.loadData();
        },
        error: (err) => {
          this.isActionLoading.set(false);
          this.actionError.set(err.error?.message || 'Có lỗi tạo dịch vụ.');
        }
      });
    }
  }

  toggleServiceStatus(srv: ServiceModel) {
    const newStatus = !srv.isActive;
    const msg = newStatus 
      ? `Bật hiển thị dịch vụ ${srv.name}? Khách hàng sẽ thấy dịch vụ này.` 
      : `Tạm ẩn dịch vụ ${srv.name}?`;
      
    if (confirm(msg)) {
      this.adminService.toggleServiceStatus(srv.id, newStatus).subscribe({
        next: () => this.loadData(),
        error: (err) => alert(err.error?.message || 'Lỗi cập nhật trạng thái')
      });
    }
  }

  deleteService(srv: ServiceModel) {
    if (confirm(`Xóa dịch vụ ${srv.name}? Các dữ liệu lịch sử có thể bị mất. Bạn nên "Tắt hiển thị" (Toggle ẩn) thay vì Xóa cứng.`)) {
      this.adminService.deleteService(srv.id).subscribe({
        next: () => this.loadData(),
        error: (err) => alert(err.error?.message || 'Không thể xóa do ràng buộc dữ liệu.') // Constraint fallback
      });
    }
  }

}
