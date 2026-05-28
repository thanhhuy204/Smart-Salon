# UI Specification — Quản lý nhân viên / Thợ (Admin)
**Module:** Admin / Staff
**Phiên bản:** 1.0

---

## 1. Xác định Page / Screen
- **Route:** `/admin/staff`
- **Mục đích:** Khởi tạo, bảo trì thông tin nhân sự thợ cắt tóc, khóa khung làm việc định kỳ/đột xuất và theo dõi hiệu suất.

---

## 2. Xác định UI Components
Cấu trúc Component Cha – Con:
- **AdminStaffPageComponent**
  - **StaffToolbar** (Title, SearchInput real-time, Nút "Thêm nhân viên" Primary)
  - **StaffGridList** (Dạng Grid 3-4 cột)
    - `StaffProfileCard`
      - `AvatarCover` (Hình ảnh + Badge Trạng Thái góc trên)
      - `InfoBox` (Tên, Chuyên môn Tags, Rating Stars dọc)
      - `ActionButtons` (Sửa, Hiệu suất, Khóa Giờ, Vô hiệu hóa)
  - **StaffFormDialog** (Thêm/Sửa thông tin)
    - `ImageUploader` (Chọn file)
    - `InputFields` (Tên, Mô tả)
    - `MultiSelect` (Chuyên môn)
  - **BlockSlotCalendarDialog** (Khóa khung giờ)
    - `Calendar` (Lịch thợ)
    - `TimeRangePicker` (Chọn từ giờ - đến giờ)
  - **PerformancePanelDialog** (Báo cáo KPI)
    - `StatCards` (Số đơn hoàn thành, Điểm số)
    - `ReviewList` (Danh sách comment)

---

## 3. Xác định Layout
- **Bố cục:** Trang dạng Admin Dashboard. Khuyến khích hiển thị thợ dạng Grid Cards (thay vì Table) vì hình ảnh avatar đóng vai trò nhận diện mạnh cho thợ.
- **Vị trí màn hình:**
  - Toolbar thao tác ở góc phải mạn trên.
  - Grid card phủ kín Main view. Hỗ trợ responsive cho tablet (2-col) & mobile (1-col).
  - Khóa giờ, Chỉnh sửa, Hiệu suất đều dùng Dialog lớn hoặc Drawer side-panel vuốt từ phải qua để tránh chuyển hướng Page.

---

## 4. Xác định UI Behavior
- **Thêm/Sửa Thợ:** Bấm "Thêm nhân viên", hiện Dialog `StaffFormDialog`. Khi `ImageUploader` có ảnh sai định dạng -> Hiển báo lỗi trực tiếp đỏ. Điền đủ -> Save -> Dialog đóng, Data Binding trigger load lại grid mượt mà.
- **Khóa khung giờ thợ:** Click Icon Khóa Giờ -> Mở slide-panel `BlockSlotCalendarDialog`. Chọn ngày, kéo thả thời gian bị khóa, nhấn Lưu. Khung giờ đó xám màu lập tức.
- **Xóa / Vô hiệu khóa:** Hành động này nhạy cảm. Hiện Warning Dialog đỏ: "Chỉ có thể vô hiệu hóa nhằm duy trì lịch sử dữ liệu...".

---

## 5. Xác định Style (Dựa trên Business Goal)
- **Màu sắc:** 
  - Đang làm việc: Badge xanh lá (Active).
  - Tạm nghỉ: Badge màu xám thẫm (Inactive).
- **Typography:** Khung nhìn thoáng. Hình ảnh đại diện thợ (Avatar) được bo góc tròn, crop bao quát tỉ lệ chuẩn 1:1.
- **Cảm giác thiết kế:** Quản trị hình ảnh nhân lực, Focus vào con người (Nhấn mạnh Avatar & Rating).

---

## 6. Xử lý Edge Cases
- **Bấm Xóa thợ nhưng thợ đang có lịch chờ:** Back-end trả Exception -> Angular chặn lại, bung Toast Đỏ báo: "Thợ đang có [N] lịch chưa hoàn tất. Vui lòng vô hiệu hóa thay thế!".
- **Khóa khung giờ bị trùng lịch hiện tại:** API báo cảnh báo xung đột (Conflict) -> UI bung Dialog bổ sung: "Có 2 lịch xác nhận đè lên giờ này. Chắc chắn tiếp tục?" kèm list lịch đính kèm.
- **Chưa có dữ liệu hiệu suất:** Trạng thái xem `PerformancePanelDialog` sẽ render Empty Status "Chưa có dữ liệu hiệu suất".

---

## 7. Mapping rõ từ Business Spec → UI Spec

| Yêu cầu Business (BS) | Phần thể hiện trên UI Spec |
|---|---|
| Hiển thị đánh giá và số lịch | Đẩy `Rating Stars` vào `StaffProfileCard` + Tab hiệu suất. |
| Form Thêm/sửa điền đa nhiệm | Giao cho `StaffFormDialog` đảm nhận mọi trường thông tin. |
| Khóa khung giờ nghỉ linh động | Chức năng `TimeRangePicker` móc nối với Calendar của 1 thợ chỉ định. |
| Cấm xóa nóng | UI Tooltip/Modal disable tính năng Trash Delete nếu logic thỏa mãn. |
