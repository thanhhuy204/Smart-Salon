# UI Specification — Quản lý lịch hẹn (Người dùng)
**Module:** Booking / My Appointments
**Phiên bản:** 1.0

---

## 1. Xác định Page / Screen
- **Route:** `/profile/appointments`
- **Mục đích:** Cho phép khách hàng quản trị, theo dõi trạng thái, và tác động (hủy) các lịch cắt tóc cá nhân.

---

## 2. Xác định UI Components
Cấu trúc Component Cha – Con:
- **MyAppointmentsComponent** (Main Page)
  - **AppointmentTabsComponent** 
    - `TabItem` ("Sắp tới", "Đã hoàn thành", "Đã hủy")
  - **AppointmentListComponent**
    - `AppointmentListPlaceholder` (Hiển thị Empty state: Hình ảnh + CTA "Đặt lịch ngay")
    - `AppointmentCard`
      - `CardHeader` (Mã lịch hẹn, Trạng thái Badge)
      - `CardBody` (Tên thợ, Tên dịch vụ rút gọn, Thời gian & Ngày)
      - `CardFooter` (Tổng tiền, Nút "Xem chi tiết", Nút "Hủy lịch" - nếu hợp lệ)
  - **AppointmentDetailModal** (Bottom Sheet cho Mobile / Modal cho Desktop)
    - `DetailSection` (Full dịch vụ, địa chỉ, tổng tiền, trạng thái)
  - **ConfirmCancelDialog** (Dialog cảnh báo)

---

## 3. Xác định Layout
- **Bố cục:** Layout 2 cột (Desktop: Sidebar profile bên trái, Nội dung bên phải) / 1 Cột (Mobile: Full width).
- **Vị trí màn hình:**
  - Header: Tiêu đề trang + Tab sticky.
  - Body: Danh sách Card xếp dọc dạng list. Có hỗ trợ Infinite Scroll hoặc Load more.
  - Overlays: Modal/Dialog bung ra giữa màn hình.

---

## 4. Xác định UI Behavior
- **Chuyển Tab:** Slide animation chuyển đổi mượt mà giữa các list dữ liệu (Sắp tới / Hoàn thành / Hủy).
- **Nhấn "Xem chi tiết" / Nhấn vào một Card:** Mở `AppointmentDetailModal` popup lên trên current page (Không chuyển route để giữ context).
- **Hủy lịch:** 
  1. User nhấn "Hủy lịch" ở `AppointmentCard` (chỉ hiển thị với badge PENDING).
  2. Hiện `ConfirmCancelDialog`. Nhấn "Hủy lịch" màu đỏ.
  3. Lời gọi API chạy (Nút xoay Spinner).
  4. Thành công -> Card đó nháy đỏ và fade out (chuyển sang tab Đã hủy) -> Bắn Toast Success.

---

## 5. Xác định Style (Dựa trên Business Goal)
- **Màu sắc Status Badge:**
  - PENDING: Vàng cam (bg-yellow-100 text-yellow-800).
  - CONFIRMED: Xanh dương (bg-blue-100 text-blue-800).
  - IN_PROGRESS: Cam nhạt.
  - COMPLETED: Xanh lá (bg-green-100 text-green-800).
  - CANCELLED: Đỏ nhạt (bg-red-100 text-red-800).
- **Typography:** Giao diện cá nhân, text nhỏ gọn, dễ nhìn. Đậm cho thông tin quan trọng (Giờ hẹn).
- **Cảm giác thiết kế:** Rõ ràng, dễ theo dõi dạng thẻ (Card UI).

---

## 6. Xử lý Edge Cases
- **Lỗi không có lịch nào:** Trong tab đó render `AppointmentListPlaceholder`, illustration báo rỗng và CTA "Đặt thiết lập ngay" -> chuyển về `/booking`.
- **Lỗi bấm Hủy lịch mà Admin vừa duyệt (Conflict):** API trả lỗi 4xx -> Đóng dialog, bắn Toast Error: "Lịch đã được Admin xác nhận", reload lại card update Badge sang `CONFIRMED`.
- **Lỗi load nhiều:** Giao diện hiển thị Skeleton Card khi fetch lazy load.

---

## 7. Mapping rõ từ Business Spec → UI Spec

| Yêu cầu Business (BS) | Phần thể hiện trên UI Spec |
|---|---|
| Phân loại theo trạng thái | `AppointmentTabsComponent` chứa 3 Tab chính. |
| Chỉ cho phép Hủy khi PENDING | `AppointmentCard` nhận prop status: `status !== 'PENDING' ? hidden : show Button_Danger`. |
| Xác nhận hủy rủi ro | `ConfirmCancelDialog` với warning color. |
| Giao diện trạng thái trống | `AppointmentListPlaceholder`. |
| Xem chi tiết đầy đủ thông tin | `AppointmentDetailModal` (bottom sheet cho Mobile). |
