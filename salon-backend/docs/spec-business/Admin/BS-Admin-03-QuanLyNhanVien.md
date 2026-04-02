# Business Specification — Quản lý nhân viên / Thợ (Admin)
**Module:** Admin / Staff
**Phiên bản:** 1.0
**Ngày tạo:** 2026-03-27
**Tác giả:** Business Analyst

---

## 1. Business Goal

Cho phép quản trị viên quản lý đội ngũ thợ cắt tóc của salon — thêm, cập nhật, vô hiệu hóa hồ sơ thợ, khóa khung giờ khi thợ nghỉ và theo dõi hiệu suất làm việc — nhằm đảm bảo nguồn lực luôn sẵn sàng và lịch hẹn được phân công chính xác.

---

## 2. Actors

| Actor | Mô tả |
|---|---|
| Quản trị viên (ADMIN) | Quản lý toàn bộ hồ sơ và lịch làm việc của thợ |
| Hệ thống | Lưu trữ dữ liệu, cập nhật lịch khả dụng và tính toán hiệu suất |

---

## 3. Preconditions

- Quản trị viên đã đăng nhập với quyền ADMIN.
- Đang ở trong khu vực Admin Dashboard, mục **"Quản lý nhân viên"**.

---

## 4. Main Flow (Happy Path)

### 4.1 Xem danh sách thợ
1. Admin truy cập mục **"Quản lý nhân viên"**.
2. Hệ thống hiển thị danh sách toàn bộ thợ: ảnh, tên, chuyên môn, trạng thái (Đang làm / Tạm nghỉ), đánh giá trung bình.

### 4.2 Thêm thợ mới
3. Admin nhấn nút **"Thêm nhân viên"**.
4. Hệ thống hiển thị form gồm: Tên, Ảnh đại diện, Chuyên môn (chọn nhiều), Mô tả ngắn.
5. Admin điền đầy đủ thông tin và nhấn **"Lưu"**.
6. Hệ thống tạo hồ sơ thợ mới ở trạng thái **Đang làm việc**.
7. Thợ mới xuất hiện trong danh sách chọn thợ khi khách đặt lịch.

### 4.3 Sửa thông tin thợ
8. Admin nhấn **"Chỉnh sửa"** trên hồ sơ một thợ.
9. Hệ thống hiển thị form chỉnh sửa với dữ liệu hiện tại.
10. Admin cập nhật thông tin và nhấn **"Lưu"**.
11. Hệ thống lưu thay đổi và cập nhật ngay trên danh sách.

### 4.4 Vô hiệu hóa / Kích hoạt lại thợ
12. Admin nhấn **"Vô hiệu hóa"** trên hồ sơ thợ đang hoạt động.
13. Hệ thống hiển thị xác nhận và ghi chú: thợ bị ẩn khỏi lựa chọn khi đặt lịch mới.
14. Admin xác nhận → thợ chuyển sang trạng thái **Tạm nghỉ**.
15. Khi cần, Admin nhấn **"Kích hoạt lại"** để đưa thợ trở lại trạng thái hoạt động.

### 4.5 Khóa khung giờ thợ
16. Admin mở hồ sơ thợ, chọn tab **"Lịch làm việc / Khóa giờ"**.
17. Hệ thống hiển thị lịch tháng của thợ, các slot đã bị khóa hiển thị rõ ràng.
18. Admin chọn ngày và khoảng thời gian muốn khóa.
19. Admin nhập lý do (tuỳ chọn): nghỉ phép, bận việc đột xuất,...
20. Admin nhấn **"Khóa khung giờ"**.
21. Hệ thống lưu blocked slot — khung giờ này không còn hiển thị khi khách đặt lịch.

### 4.6 Xem hiệu suất thợ
22. Admin nhấn **"Xem hiệu suất"** hoặc vào tab hiệu suất trong hồ sơ thợ.
23. Hệ thống hiển thị: tổng số lịch đã hoàn thành, đánh giá trung bình (sao), danh sách nhận xét gần nhất.

---

## 5. Alternative Flows

### 5.1 Tên thợ bị để trống khi thêm mới
- **Tại bước 5:** Hệ thống hiển thị lỗi: *"Tên nhân viên không được để trống."*

### 5.2 Xóa thợ đang có lịch hẹn PENDING / CONFIRMED
- **Khi Admin cố xóa:** Hệ thống cảnh báo: *"Thợ này đang có [N] lịch hẹn chưa hoàn thành. Vô hiệu hóa thay vì xóa để giữ dữ liệu lịch sử."*
- Hệ thống không cho xóa — chỉ cho vô hiệu hóa trong trường hợp này.

### 5.3 Khóa khung giờ trùng với lịch hẹn đã CONFIRMED
- **Tại bước 20:** Hệ thống phát hiện xung đột với lịch hẹn CONFIRMED trong khoảng đó.
- Hệ thống hiển thị cảnh báo: *"Thợ đang có lịch hẹn đã xác nhận trong khoảng thời gian này. Bạn có muốn tiếp tục không?"*
- Admin tự quyết định — nếu tiếp tục, Admin cần xử lý lịch hẹn bị ảnh hưởng thủ công.

### 5.4 File ảnh không hợp lệ
- Giống quy tắc ảnh trong Profile: chỉ JPG/PNG, tối đa 5MB.

---

## 6. Business Rules

| Mã | Quy tắc |
|---|---|
| BR-STAFF-01 | Thợ ở trạng thái **Tạm nghỉ** không xuất hiện trong danh sách chọn thợ khi đặt lịch mới. |
| BR-STAFF-02 | Không xóa thợ đang có lịch hẹn PENDING hoặc CONFIRMED — chỉ vô hiệu hóa. |
| BR-STAFF-03 | Khóa khung giờ có hiệu lực ngay — khách sẽ không thấy khung giờ đó khi đặt lịch. |
| BR-STAFF-04 | Một khoảng thời gian bị khóa có thể bị gỡ bỏ bởi Admin bất cứ lúc nào. |
| BR-STAFF-05 | Hiệu suất thợ chỉ tính trên lịch hẹn trạng thái **COMPLETED**. |
| BR-STAFF-06 | Ảnh đại diện thợ chỉ chấp nhận JPG/PNG, tối đa 5MB. |

---

## 7. Edge Cases

| Tình huống | Hành vi mong đợi |
|---|---|
| Thợ bị vô hiệu hóa trong khi khách đang ở bước chọn thợ | Khi khách tải lại bước 2, thợ đó không còn hiển thị. Nếu đã chọn rồi thì cảnh báo và yêu cầu chọn lại. |
| Admin khóa cả ngày làm việc của thợ | Thợ vẫn tồn tại trong hệ thống nhưng không có khung giờ nào trong ngày đó. |
| Thợ chưa có lịch hẹn nào | Trang hiệu suất hiển thị: *"Chưa có dữ liệu hiệu suất."* |
| Admin tìm kiếm thợ theo tên | Hệ thống hỗ trợ tìm kiếm real-time theo tên. |

---

## 8. Acceptance Criteria (Given/When/Then)

### AC-01: Thêm thợ mới thành công
- **Given:** Admin ở trang Quản lý nhân viên.
- **When:** Admin điền đủ thông tin hợp lệ và nhấn "Lưu".
- **Then:** Thợ mới xuất hiện trong danh sách, trạng thái "Đang làm việc", hiển thị khi khách đặt lịch.

### AC-02: Vô hiệu hóa thợ
- **Given:** Thợ A đang ở trạng thái hoạt động, không có lịch hẹn đang chờ.
- **When:** Admin nhấn "Vô hiệu hóa" và xác nhận.
- **Then:** Thợ A chuyển trạng thái "Tạm nghỉ", không xuất hiện khi khách đặt lịch mới.

### AC-03: Cảnh báo khi xóa thợ có lịch chưa hoàn thành
- **Given:** Thợ B có 2 lịch hẹn CONFIRMED.
- **When:** Admin cố xóa thợ B.
- **Then:** Hệ thống hiển thị cảnh báo và ngăn không cho xóa, đề nghị vô hiệu hóa thay thế.

### AC-04: Khóa khung giờ thành công
- **Given:** Admin khóa 14:00–17:00 ngày mai cho thợ C.
- **When:** Khách đặt lịch với thợ C ngày mai.
- **Then:** Các khung 14:00–17:00 không xuất hiện trong lịch chọn giờ.

### AC-05: Xem hiệu suất thợ
- **Given:** Thợ D đã hoàn thành 15 lịch, đánh giá trung bình 4.5 sao.
- **When:** Admin xem hiệu suất thợ D.
- **Then:** Hệ thống hiển thị: "15 lịch hoàn thành", "4.5 ★", danh sách nhận xét.

---

## 9. Mapping Business Spec → UI Elements

| Phần nghiệp vụ | Thành phần giao diện |
|---|---|
| Danh sách thợ | Table/grid card với ảnh, tên, chuyên môn, badge trạng thái, rating |
| Thêm / Sửa thợ | Dialog/form với upload ảnh, input tên, multi-select chuyên môn, textarea mô tả |
| Vô hiệu hóa / Kích hoạt | Toggle switch hoặc nút hành động với dialog xác nhận |
| Khóa khung giờ | Calendar của thợ + time range picker + input lý do |
| Hiệu suất thợ | Tab/panel: số lịch COMPLETED, average rating (sao), danh sách reviews |
| Tìm kiếm thợ | Search input real-time phía trên danh sách |
