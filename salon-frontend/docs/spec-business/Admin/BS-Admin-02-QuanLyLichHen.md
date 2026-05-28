# Business Specification — Quản lý lịch hẹn (Admin)
**Module:** Admin / Booking
**Phiên bản:** 1.0
**Ngày tạo:** 2026-03-27
**Tác giả:** Business Analyst

---

## 1. Business Goal

Cho phép quản trị viên theo dõi và xử lý toàn bộ lịch hẹn của khách hàng — duyệt xác nhận, từ chối, hủy hoặc đánh dấu hoàn thành — nhằm vận hành salon hiệu quả và đảm bảo khách hàng nhận được dịch vụ đúng hẹn.

---

## 2. Actors

| Actor | Mô tả |
|---|---|
| Quản trị viên (ADMIN) | Xem và xử lý lịch hẹn của toàn bộ khách hàng |
| Hệ thống | Cập nhật trạng thái và gửi thông báo tương ứng cho khách |

---

## 3. Preconditions

- Quản trị viên đã đăng nhập với tài khoản có quyền ADMIN.
- Đang ở trong khu vực Admin Dashboard.

---

## 4. Main Flow (Happy Path)

### 4.1 Xem danh sách lịch hẹn
1. Admin truy cập mục **"Quản lý lịch hẹn"** trên sidebar.
2. Hệ thống hiển thị mặc định theo **chế độ danh sách**, lọc ngày hôm nay.
3. Admin có thể chuyển sang **chế độ lịch** (Calendar view) theo ngày / tuần / tháng.
4. Mỗi mục hiển thị: tên khách, dịch vụ, thợ được chọn, ngày giờ, trạng thái.
5. Admin có thể lọc theo: ngày, trạng thái, thợ phụ trách.

### 4.2 Duyệt xác nhận lịch hẹn
6. Admin thấy lịch hẹn trạng thái **PENDING**, nhấn **"Xác nhận"**.
7. Nếu khách chọn "Bất kỳ thợ nào": hệ thống yêu cầu Admin chọn thợ cụ thể trước khi xác nhận.
8. Admin chọn thợ (nếu cần) và nhấn **"Xác nhận"**.
9. Hệ thống cập nhật trạng thái thành **CONFIRMED**.
10. Hệ thống gửi thông báo cho khách: *"Lịch hẹn của bạn đã được xác nhận."*

### 4.3 Từ chối lịch hẹn
11. Admin thấy lịch hẹn trạng thái **PENDING**, nhấn **"Từ chối"**.
12. Hệ thống hiển thị form nhập lý do từ chối (bắt buộc).
13. Admin nhập lý do và nhấn **"Xác nhận từ chối"**.
14. Hệ thống cập nhật trạng thái thành **CANCELLED**.
15. Hệ thống gửi thông báo cho khách kèm lý do từ chối.

### 4.4 Hủy lịch hẹn (mọi trạng thái trước COMPLETED)
16. Admin nhấn **"Hủy lịch"** trên bất kỳ lịch hẹn PENDING / CONFIRMED / IN_PROGRESS.
17. Hệ thống yêu cầu Admin nhập lý do hủy (bắt buộc).
18. Admin nhập lý do và xác nhận.
19. Hệ thống cập nhật trạng thái thành **CANCELLED**.
20. Hệ thống gửi thông báo cho khách kèm lý do hủy.

### 4.5 Đánh dấu lịch hẹn hoàn thành
21. Admin nhấn **"Hoàn thành"** trên lịch hẹn đang ở trạng thái **CONFIRMED** hoặc **IN_PROGRESS**.
22. Hệ thống cập nhật trạng thái thành **COMPLETED**.
23. Hệ thống gửi thông báo cho khách kèm lời mời đánh giá dịch vụ.

---

## 5. Alternative Flows

### 5.1 Quên nhập lý do khi từ chối / hủy
- **Tại bước 13 hoặc 18:** Admin nhấn xác nhận mà không nhập lý do.
- Hệ thống hiển thị lỗi: *"Vui lòng nhập lý do trước khi xác nhận."*

### 5.2 Lịch hẹn đã ở trạng thái COMPLETED hoặc CANCELLED
- Không hiển thị các nút hành động (xác nhận / từ chối / hủy / hoàn thành).
- Admin chỉ có thể xem chi tiết.

### 5.3 Không có lịch hẹn nào trong ngày được lọc
- Hệ thống hiển thị trạng thái trống: *"Không có lịch hẹn nào trong ngày này."*

---

## 6. Business Rules

| Mã | Quy tắc |
|---|---|
| BR-ADMBK-01 | Admin chỉ có thể xác nhận / từ chối lịch hẹn ở trạng thái **PENDING**. |
| BR-ADMBK-02 | Admin có thể hủy lịch hẹn ở bất kỳ trạng thái nào trước **COMPLETED**. |
| BR-ADMBK-03 | Lý do từ chối / hủy là bắt buộc — không để trống. |
| BR-ADMBK-04 | Khi Admin hủy hoặc từ chối, hệ thống phải gửi thông báo cho khách kèm lý do. |
| BR-ADMBK-05 | Nếu lịch hẹn có thợ là "Bất kỳ thợ nào", Admin phải phân công thợ cụ thể trước khi xác nhận. |
| BR-ADMBK-06 | Trạng thái COMPLETED và CANCELLED là trạng thái cuối — không thể thay đổi thêm. |
| BR-ADMBK-07 | Sau khi đánh dấu COMPLETED, hệ thống tự động mời khách đánh giá dịch vụ. |

---

## 7. Edge Cases

| Tình huống | Hành vi mong đợi |
|---|---|
| Khách hủy lịch đồng thời lúc Admin đang xác nhận | Hệ thống thông báo "Lịch hẹn đã bị hủy bởi khách.", không cho xác nhận nữa. |
| Thợ được phân công bị xóa sau khi lịch đã CONFIRMED | Lịch hẹn vẫn hiển thị CONFIRMED, Admin cần can thiệp thủ công. |
| Admin tìm kiếm lịch hẹn theo tên khách | Hệ thống hỗ trợ tìm kiếm full-text theo tên khách hoặc số điện thoại. |
| Nhiều lịch hẹn cùng giờ của một thợ (do lỗi hệ thống cũ) | Hệ thống hiển thị cảnh báo xung đột lịch trên calendar view. |

---

## 8. Acceptance Criteria (Given/When/Then)

### AC-01: Xem danh sách lịch hẹn hôm nay
- **Given:** Admin đang ở trang Quản lý lịch hẹn.
- **When:** Trang tải lần đầu.
- **Then:** Hệ thống hiển thị tất cả lịch hẹn của ngày hôm nay, sắp xếp theo giờ hẹn.

### AC-02: Xác nhận lịch hẹn thành công
- **Given:** Có lịch hẹn PENDING với thợ cụ thể đã được chọn.
- **When:** Admin nhấn "Xác nhận".
- **Then:** Trạng thái chuyển thành CONFIRMED, khách nhận thông báo xác nhận.

### AC-03: Phân công thợ khi xác nhận lịch "Bất kỳ thợ nào"
- **Given:** Lịch hẹn PENDING với thợ là "Bất kỳ thợ nào".
- **When:** Admin nhấn "Xác nhận".
- **Then:** Hệ thống yêu cầu Admin chọn thợ cụ thể trước khi hoàn tất xác nhận.

### AC-04: Từ chối lịch hẹn kèm lý do
- **Given:** Có lịch hẹn PENDING.
- **When:** Admin nhập lý do "Thợ nghỉ đột xuất" và nhấn "Xác nhận từ chối".
- **Then:** Trạng thái thành CANCELLED, khách nhận thông báo có kèm lý do.

### AC-05: Không từ chối được khi thiếu lý do
- **Given:** Admin đang ở form từ chối lịch hẹn.
- **When:** Admin để trống lý do và nhấn "Xác nhận từ chối".
- **Then:** Hệ thống hiển thị lỗi "Vui lòng nhập lý do.", không thực hiện hành động.

### AC-06: Đánh dấu hoàn thành
- **Given:** Lịch hẹn đang ở trạng thái CONFIRMED.
- **When:** Admin nhấn "Hoàn thành".
- **Then:** Trạng thái thành COMPLETED, khách nhận thông báo mời đánh giá.

---

## 9. Mapping Business Spec → UI Elements

| Phần nghiệp vụ | Thành phần giao diện |
|---|---|
| Chuyển đổi chế độ xem | Toggle button: "Danh sách" / "Lịch" (calendar view) |
| Lọc dữ liệu | Date picker + dropdown trạng thái + dropdown thợ |
| Mỗi mục lịch hẹn | Row trong table hoặc event card trong calendar |
| Các nút hành động | "Xác nhận" (xanh), "Từ chối" (vàng), "Hủy" (đỏ), "Hoàn thành" (xanh lá) — hiển thị tùy trạng thái |
| Form nhập lý do | Dialog/modal với textarea bắt buộc + nút xác nhận |
| Badge trạng thái | Chip màu: PENDING=vàng, CONFIRMED=xanh, IN_PROGRESS=cam, COMPLETED=xanh lá, CANCELLED=đỏ |
| Calendar view | FullCalendar hoặc Angular Material calendar; event màu theo trạng thái |
