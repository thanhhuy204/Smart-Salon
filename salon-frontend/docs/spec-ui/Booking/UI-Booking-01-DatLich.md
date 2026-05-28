# UI Specification — Đặt lịch cắt tóc
**Module:** Booking
**Phiên bản:** 1.0

---

## 1. Xác định Page / Screen
- **Route:** `/booking`
- **Mục đích:** Hỗ trợ người dùng hoàn tất quá trình đặt lịch cắt tóc qua luồng 4 bước: Chọn dịch vụ → Chọn thợ → Chọn ngày giờ → Xác nhận.

---

## 2. Xác định UI Components
Cấu trúc Component Cha – Con:
- **BookingWizardComponent** (Main Container)
  - **BookingStepperComponent** (Chỉ báo 4 bước: Dịch vụ, Thợ, Ngày giờ, Xác nhận)
  - **StepServiceComponent**
    - `CategoryTabs` (Chip list: Cắt, Uốn, Nhuộm...)
    - `ServiceCard` (Tên, mô tả, giá, thời gian, Checkbox, hình minh họa)
  - **StepStaffComponent**
    - `StaffGrid`
      - `StaffCard` (Avatar, Tên, Chuyên môn, Rating, Badge: Bất kỳ thợ nào)
  - **StepTimeComponent**
    - `CalendarPicker` (Chọn ngày)
    - `TimeSlotGrid`
      - `TimeSlotChip` (09:00, 09:30... Trạng thái: Available, Disabled, Selected)
  - **StepConfirmComponent**
    - `BookingSummaryCard` (Chi tiết dịch vụ, Thợ, Ngày giờ, Địa chỉ, Tổng tiền)
  - **BookingFooterComponent** (Nút điều hướng)
    - `ButtonSecondary` (Quay lại)
    - `ButtonPrimary` (Tiếp theo / Xác nhận đặt lịch)
  - **SuccessPageTemplate** (Mã lịch hẹn, Nút Xem lịch hẹn, Checkmark Animation)

---

## 3. Xác định Layout
- **Bố cục tổng thể:** Container căn giữa (Center column, max-width: 800px) tạo cảm giác tập trung vào luồng (wizard flow).
- **Vị trí màn hình:**
  - Header: Stepper hiển thị tiến độ 4 bước.
  - Body: Scrollable, chứa nội dung chính của từng bước. Grid layout cho Service/Staff/Time.
  - Footer (Sticky bottom): Fixed dưới đáy màn hình trên mobile. Chứa các nút "Quay lại" (Trái) và "Tiếp theo" (Phải).

---

## 4. Xác định UI Behavior
- **Tương tác & Navigate:** 
  - Click vào Service Card -> Toggle checkbox.
  - Nhấn "Tiếp theo" ở bước 1 mà chưa chọn dịch vụ -> Hiển thị Toast Error: "Vui lòng chọn dịch vụ".
  - Khi hệ thống tải danh sách khung giờ -> Hiển thị Skeleton loading grid.
- **Xác nhận đặt lịch:** Nhấn vào "Xác nhận", nút CTA chuyển sang trạng thái Loading (Spinner), disabled các tác vụ khác.
- **Phản hồi:** Trả về màn hình `SuccessPageTemplate` kèm Confetti (nếu thành công) hoặc Toast Error nếu thất bại.

---

## 5. Xác định Style (Dựa trên Business Goal)
- **Màu sắc:** Tối giản, hiện đại (Premium Salon Vibe). Primary Color: Nâu rêu hoặc Đen/Trắng cơ bản (Dark mode support), Accent: Gold/Cam nhạt cho trạng thái Active.
- **Typography:** Sans-serif (Inter/Roboto), kích thước to rõ dễ chọn thao tác trên mobile. Fonts weight bold cho tiêu đề và giá tiền.
- **Cảm giác thiết kế:** Cao cấp (Premium), tối giản (Minimalist), mượt mà (Có transition giữa các bước, animation khi chọn card).

---

## 6. Xử lý Edge Cases
- **Lỗi mạng (Network Error) khi load khung giờ:** Hiển thị thẻ thông báo lỗi ở Body kèm nút `Retry` (Thử lại).
- **Khung giờ bị người khác đặt lúc xác nhận:** Bật Modal cảnh báo lỗi -> Tự động chuyển lùi về Step 3 để ưu tiên chọn khung giờ khác (giữ nguyên state của thợ/dịch vụ).
- **Tải lại trang (Refresh):** Trạng thái giữ nguyên bằng LocalStorage hoặc SessionStorage, render lại đúng bước hiện tại.
- **Người dùng chưa đăng nhập:** Nếu truy cập `/booking`, hiển thị Authentication Modal, sau khi đăng nhập modal đóng lại và tiếp tục giữ luồng.

---

## 7. Mapping rõ từ Business Spec → UI Spec

| Yêu cầu Business (BS) | Phần thể hiện trên UI Spec |
|---|---|
| Chỉ báo bước hiện tại | `BookingStepperComponent` cố định trên top. |
| Danh sách dịch vụ nhóm theo danh mục | `StepServiceComponent` có `CategoryTabs` ngang (scrollable). |
| "Bất kỳ thợ nào" làm tùy chọn đầu tiên | `StaffCard` đầu tiên với Icon đặc biệt (Star/Random) gắn hiệu ứng nổi bật. |
| Ngày quá khứ bị mờ/khóa | `CalendarPicker` disable các ngày `< Date.now()`. |
| Validation chọn dịch vụ | Nút `ButtonPrimary` (Tiếp tục) sẽ throw Toast nếu count == 0. |
| Tóm tắt trước khi gửi | `BookingSummaryCard` hiện dạng hóa đơn (Bill format). |
| Trạng thái Pending & Thông báo | Sau loading gửi form, hiện `SuccessPageTemplate`. |
