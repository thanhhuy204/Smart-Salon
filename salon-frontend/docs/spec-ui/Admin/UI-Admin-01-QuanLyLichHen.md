# UI Specification — Quản lý lịch hẹn (Admin)
**Module:** Admin / Booking
**Phiên bản:** 1.0

---

## 1. Xác định Page / Screen
- **Route:** `/admin/appointments`
- **Mục đích:** Admin tracking lịch trình salon, can thiệp vào tiến trình (Duyệt/Từ chối), điều phối thợ nhằm tối ưu hóa vận hành.

---

## 2. Xác định UI Components
Cấu trúc Component Cha – Con:
- **AdminAppointmentPageComponent**
  - **AppointmentToolbar**
    - `ViewToggle` (List Icon / Calendar Icon)
    - `FilterGroup` (DatePicker, Select Trạng thái, Select Thợ, SeachBox Khách)
  - **AppointmentListView** (Trường hợp View = List)
    - `DataTable` với pagination. Row kèm Badge Status và 4 nút Action.
  - **AppointmentCalendarView** (Trường hợp View = Calendar - FullCalendar wrapper)
    - `CalendarEventCard` (Hiển thị Tên khách, Tên thợ, Status color block).
  - **ActionModals**
    - `AssignStaffModal` (Modal bắt buộc chọn thợ nếu khách chọn "Bất kỳ thợ nào" rồi bấm Xác nhận).
    - `RejectCancelReasonModal` (Form input textarea bắt buộc nhập lý do).

---

## 3. Xác định Layout
- **Bố cục:** Bố cục Dashboard ngàm (Sidebar trái cố định, Main content Full width).
- **Vị trí màn hình:**
  - Phía trên (Toolbar): Các bộ lọc ngang tiết kiệm diện tích. Search bar ở góc trên bên phải.
  - Ở giữa: Giao diện bảng (`DataTable`) với cột tác vụ ở bên phải hoặc `Calendar` chiếm full màn hình.
  - Modals: Luôn nổi trung tâm để tránh bỏ lỡ.

---

## 4. Xác định UI Behavior
- **Toggle View:** Bấm nút chuyển List/Calendar -> Render lại giao diện Data tương ứng, giữ nguyên bộ lộc hiện tại.
- **Hành động Duyệt (Xác nhận):**
  - Bấm Nhấn nút "Xác nhận". Hệ thống check `staff_id`.
  - Nếu `staff_id == NULL`, bung `AssignStaffModal`. Chọn thả xuống > Lưu. Trạng thái cập nhật `CONFIRMED`.
- **Hành động Từ chối / Hủy:**
  - Bấm nút "Từ chối". Bung `RejectCancelReasonModal`. Nút Save bị disabled nếu trống Textarea.
  - Nhập lý do -> Đổi màu nút Save -> Gửi API -> Cập nhật Table Row.

---

## 5. Xác định Style (Dựa trên Business Goal)
- **Màu sắc System Badge:** Tương đồng phía Người dùng (PENDING: vàng, CONFIRMED: xanh dương, COMPLETED: xanh lá, CANCELLED: đỏ).
- **Nút Hành Động:** Nút icon tối giản trong bản Desktop. Bấm vào Dropdown Menu (`ActionMenu`) nếu có quá nhiều quyền để không rối mắt.
- **Cảm giác thiết kế:** Data-heavy, chuyên nghiệp quản trị. Sử dụng Density (Khoảng cách nén dữ liệu) để hiển thị được nhiều hàng dữ liệu nhất.

---

## 6. Xử lý Edge Cases
- **Không có lịch nào:** Render bảng tĩnh thông báo "Không có lịch hẹn nào trong ngày này".
- **Lịch trùng (Xung đột thời gian):** Ở Calendar View, 2 box sẽ chồng lấp, border box có viền cảnh báo màu đỏ chớp báo hiệu Admin cần xử lý rủi ro.
- **Quên nhập lý do khi Từ chối:** TextField sẽ highlight Error Border Red và hiện HintText "Vui lòng nhập lý do." bên dưới input.

---

## 7. Mapping rõ từ Business Spec → UI Spec

| Yêu cầu Business (BS) | Phần thể hiện trên UI Spec |
|---|---|
| Lọc theo trạng thái, ngày, thợ | `FilterGroup` ngang cố định ở trên đầu component. |
| Yêu cầu cấp thợ nếu khách random | Bắt event click Xác nhận -> if (!staff_id) render `AssignStaffModal`. |
| Từ chối/Hủy mang tính cưỡng chế | Modal nhập lý do (`RejectCancelReasonModal`) disable CTA khi input empty. |
| Hiển thị đa dạng chế độ | `ViewToggle` để luân phiên giữa Bảng và Lịch biểu diễn (FullCalendar). |
