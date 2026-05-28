# UI Specification — Quản lý dịch vụ (Admin)
**Module:** Admin / Service
**Phiên bản:** 1.0

---

## 1. Xác định Page / Screen
- **Route:** `/admin/services`
- **Mục đích:** Thao tác CRUD (Tạo, Xem, Sửa, Xóa) danh mục và các gói dịch vụ nhỏ lẻ (thêm giá, chỉnh độ dài thời gian) đưa lên frontend người dùng.

---

## 2. Xác định UI Components
Cấu trúc Component Cha – Con:
- **AdminServicePageComponent**
  - **ServiceConfigTabs**
    - `TabDichVu` (Main)
    - `TabDanhMuc` (Quản lý category)
  - **ServiceListSection**
    - `Toolbar` (Search Box, Nút Thêm Dịch Vụ)
    - `CategoryAccordion` (Nhóm cha mở rộng/thu gọn)
      - `ServiceTableRow` (Item chi tiết: Tên, Giá, Thời gian, Trạng thái Bật/Tắt)
  - **CategoryListSection**
    - `CategoryChipList` / `CategoryTable` (Sửa tên, Xóa)
  - **ServiceFormDialog** (Modal thêm/chỉnh sửa)
    - `InputName`
    - `SelectCategory`
    - `InputCurrency` (Xử lý formatting số trực tiếp)
    - `InputNumber` (Thời gian phút, min=15)
  - **StatusConfirmDialog** (Dialog hỏi lại khi Tắt dịch vụ)

---

## 3. Xác định Layout
- **Bố cục:** Dashboard List format. Dùng UI dạng Accordion (Collapsible) để nhóm các Dịch Vụ theo Danh Mục (Category), giúp giao diện không bị rối rắm, tiết kiệm thanh cuộn.
- **Vị trí màn hình:**
  - Tab "Dịch vụ" / "Danh mục" nằm ngang top dưới thanh Header.
  - Phía dưới bên phải của mỗi Row Dịch Vụ là Toggle Bật/tắt trạng thái. Cột cuối là 2 icon Sửa / Xóa.

---

## 4. Xác định UI Behavior
- **Thao tác nhanh Toggle (Bật/Tắt):** Người dùng bấm công tắc Toggle -> bật Pop confirm -> Xác nhận -> API chạy ngầm gọi PUT đổi trạng thái -> Cập nhật Toggle Switch on Table. Không cần bung Form chỉnh sửa to.
- **Xử lý Input số lượng (Giá, Giờ):** `InputCurrency` khi nhập liên tục (100000) sẽ tự format Mask text (100,000 VND). Khi xóa số tự động lùi về mask chuẩn. Ngừa ký tự chữ.
- **Thay đổi Category danh mục:** Click Xóa category có dịch vụ -> Nút Xóa rung lắc, báo Toast "Phải di chuyển dịch vụ trước khi xoá danh mục".

---

## 5. Xác định Style (Dựa trên Business Goal)
- **Màu sắc Toggle:** Xanh lá sậm (Đang hiện) / Xám nhạt (Đã ẩn). Rõ nhận thị giác phân định dịch vụ còn được bán không.
- **Typography:** Đơn giản, rõ chữ. Giá trị tiền (price) dùng font Monospace hoặc bold để định danh dễ ràng buộc mắt đọc.
- **Cảm giác thiết kế:** Tốc độ cao, gọn lẹ, giống một bảng Menu điều khiển tổng (Mega control panel).

---

## 6. Xử lý Edge Cases
- **Sửa mức giá có âm hay giờ học nhỏ hơn 15:** Trình duyệt / UI component (Angular Forms validator) sẽ bao đỏ Field vi phạm, disable nút Submit form "Lưu" ngay từ đầu.
- **Xóa dịch vụ đang giữ trong lịch hẹn (Conflict):** Bấm Delete -> Backend trả lỗi Constraint hoặc 409 Code -> Modal Alert khuyên Admin "Không thể Xóa, thực hiện Tạm Ẩn để tắt hiển thị?". Có 1 action để convert trực tiếp lệnh Delete -> Hide.

---

## 7. Mapping rõ từ Business Spec → UI Spec

| Yêu cầu Business (BS) | Phần thể hiện trên UI Spec |
|---|---|
| Nhóm theo danh mục | Layout phân trang theo `CategoryAccordion`. |
| Toggle bật tắt linh hoạt | Nút Switch trực tiếp lên Row (ngay ngoài bảng list) không cần chui vào Sửa. |
| Ràng buộc giá và thời gian | Validators tích hợp vào form Control `InputCurrency`, `InputNumber` (min 15). |
| Bật/tắt / Xóa thông minh | `StatusConfirmDialog` phân tích trước nghiệp vụ để có phương án dự phòng cho Admin so với việc chỉ bung lỗi thông thường. |
