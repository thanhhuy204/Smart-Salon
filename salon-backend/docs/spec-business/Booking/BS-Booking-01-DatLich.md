# Business Specification — Đặt lịch cắt tóc
**Module:** Booking
**Phiên bản:** 1.0
**Ngày tạo:** 2026-03-27
**Tác giả:** Business Analyst

---

## 1. Business Goal

Cho phép người dùng đặt lịch hẹn tại salon thông qua luồng 4 bước: chọn dịch vụ → chọn thợ → chọn ngày giờ → xác nhận, nhằm giảm thời gian chờ và tạo trải nghiệm đặt lịch thuận tiện ngay trên nền tảng trực tuyến.

---

## 2. Actors

| Actor | Mô tả |
|---|---|
| Người dùng đã đăng nhập (USER) | Thực hiện đặt lịch hẹn |
| Hệ thống | Kiểm tra tính khả dụng, tạo lịch hẹn và gửi thông báo xác nhận |

---

## 3. Preconditions

- Người dùng đã đăng nhập vào hệ thống.
- Hệ thống có ít nhất một dịch vụ đang được kích hoạt.
- Hệ thống có ít nhất một thợ đang hoạt động.
- Salon có thiết lập giờ làm việc.

---

## 4. Main Flow (Happy Path) — Luồng 4 bước

### Bước 1: Chọn dịch vụ
1. Người dùng truy cập trang Đặt lịch (`/booking`).
2. Hệ thống hiển thị danh sách dịch vụ nhóm theo danh mục (Cắt, Uốn, Nhuộm, Chăm sóc,...).
3. Mỗi dịch vụ hiển thị: tên, mô tả ngắn, giá tiền, thời gian thực hiện.
4. Người dùng chọn một hoặc nhiều dịch vụ mong muốn.
5. Người dùng nhấn **"Tiếp theo"**.

### Bước 2: Chọn thợ
6. Hệ thống hiển thị danh sách thợ còn khả dụng cho các dịch vụ đã chọn, bao gồm tùy chọn **"Bất kỳ thợ nào"** ở đầu danh sách.
7. Mỗi thợ hiển thị: ảnh đại diện, tên, chuyên môn, đánh giá trung bình (sao), số lịch đã hoàn thành.
8. Người dùng chọn một thợ cụ thể hoặc chọn **"Bất kỳ thợ nào"**.
9. Người dùng nhấn **"Tiếp theo"**.

### Bước 3: Chọn ngày và khung giờ
10. Hệ thống hiển thị lịch tháng, người dùng chọn ngày muốn đặt (các ngày trong quá khứ và ngày salon nghỉ bị vô hiệu hóa).
11. Sau khi chọn ngày, hệ thống hiển thị các khung giờ còn trống trong ngày đó (dựa trên lịch của thợ, thời gian thực hiện dịch vụ và giờ làm việc của salon).
12. Người dùng chọn một khung giờ.
13. Người dùng nhấn **"Tiếp theo"**.

### Bước 4: Xác nhận đặt lịch
14. Hệ thống hiển thị tóm tắt đặt lịch: dịch vụ đã chọn, thợ, ngày giờ, tổng thời gian dự kiến, tổng giá tiền, địa chỉ salon.
15. Người dùng xem lại thông tin.
16. Người dùng nhấn **"Xác nhận đặt lịch"**.
17. Hệ thống tạo lịch hẹn với trạng thái **PENDING** (Chờ xác nhận).
18. Hệ thống gửi thông báo xác nhận cho người dùng (in-app / email).
19. Hệ thống hiển thị trang thành công với mã lịch hẹn và nút **"Xem lịch hẹn của tôi"**.

---

## 5. Alternative Flows

### 5.1 Quay lại bước trước
- **Tại bất kỳ bước nào (2, 3, 4):** Người dùng nhấn nút **"Quay lại"**.
- Hệ thống quay về bước trước, giữ nguyên các lựa chọn đã thực hiện.

### 5.2 Không có dịch vụ nào được chọn khi nhấn "Tiếp theo"
- **Tại bước 5:** Người dùng chưa chọn dịch vụ nào.
- Hệ thống hiển thị thông báo: *"Vui lòng chọn ít nhất một dịch vụ để tiếp tục."*

### 5.3 Khung giờ vừa bị đặt bởi người khác
- **Tại bước 16:** Trong lúc người dùng xem tóm tắt, khung giờ đó vừa được người khác đặt.
- Hệ thống hiển thị thông báo: *"Khung giờ này vừa được đặt. Vui lòng quay lại chọn giờ khác."*
- Hệ thống tự động chuyển người dùng về bước 3.

### 5.4 Chọn "Bất kỳ thợ nào"
- **Tại bước 8:** Người dùng chọn "Bất kỳ thợ nào".
- Hệ thống hiển thị khung giờ dựa trên tổng hợp lịch của tất cả thợ còn khả dụng.
- Admin sẽ phân công thợ cụ thể khi duyệt lịch.

### 5.5 Không có khung giờ trống trong ngày đã chọn
- **Tại bước 11:** Không còn khung giờ nào trong ngày đó.
- Hệ thống hiển thị thông báo: *"Không còn khung giờ trống trong ngày này. Vui lòng chọn ngày khác."*

### 5.6 Người dùng chưa đăng nhập cố vào trang đặt lịch
- Hệ thống chuyển hướng về trang Đăng nhập, sau khi đăng nhập sẽ quay lại `/booking`.

---

## 6. Business Rules

| Mã | Quy tắc |
|---|---|
| BR-BOOK-01 | Người dùng phải chọn ít nhất một dịch vụ trước khi tiếp tục. |
| BR-BOOK-02 | Khung giờ hiển thị phải tính đến tổng thời gian thực hiện tất cả dịch vụ đã chọn. |
| BR-BOOK-03 | Chỉ hiển thị ngày trong tương lai — không cho đặt lịch trong quá khứ hoặc hôm nay nếu quá giờ làm việc. |
| BR-BOOK-04 | Khung giờ đã có lịch hẹn (PENDING hoặc CONFIRMED) của thợ đó không được hiển thị. |
| BR-BOOK-05 | Khung giờ trong khoảng thợ bị khóa (blocked slots) không được hiển thị. |
| BR-BOOK-06 | Lịch hẹn mới tạo luôn ở trạng thái PENDING — chờ Admin duyệt. |
| BR-BOOK-07 | Người dùng phải đăng nhập mới được đặt lịch — không hỗ trợ đặt lịch ẩn danh. |
| BR-BOOK-08 | Tổng giá tiền hiển thị là tổng giá của tất cả dịch vụ đã chọn. |

---

## 7. Edge Cases

| Tình huống | Hành vi mong đợi |
|---|---|
| Dịch vụ bị tắt khi người dùng đang ở bước 2 trở đi | Hệ thống thông báo và yêu cầu quay về bước 1 chọn lại. |
| Thợ bị xóa hoặc nghỉ khi người dùng đang ở bước 3 | Hệ thống thông báo thợ không còn khả dụng, yêu cầu chọn lại. |
| Người dùng tải lại trang giữa chừng | Hệ thống giữ lại trạng thái bước hiện tại nếu có thể (session/state). |
| Người dùng đặt lịch trùng với lịch hẹn đang PENDING của mình | Hệ thống cho phép — không giới hạn số lịch PENDING của một người dùng. |
| Mạng chậm khi xác nhận | Nút "Xác nhận" hiển thị spinner, disabled để tránh gửi trùng. |

---

## 8. Acceptance Criteria (Given/When/Then)

### AC-01: Đặt lịch thành công đủ 4 bước
- **Given:** Người dùng đã đăng nhập, đang ở trang /booking.
- **When:** Người dùng chọn dịch vụ, chọn thợ, chọn ngày giờ còn trống và nhấn "Xác nhận đặt lịch".
- **Then:** Hệ thống tạo lịch hẹn trạng thái PENDING, gửi thông báo, hiển thị trang thành công với mã lịch hẹn.

### AC-02: Không thể tiếp tục khi chưa chọn dịch vụ
- **Given:** Người dùng đang ở bước 1.
- **When:** Người dùng nhấn "Tiếp theo" mà không chọn dịch vụ nào.
- **Then:** Hệ thống hiển thị thông báo yêu cầu chọn ít nhất một dịch vụ.

### AC-03: Khung giờ tính đúng thời gian dịch vụ
- **Given:** Người dùng chọn 2 dịch vụ có tổng thời gian 90 phút.
- **When:** Người dùng xem lịch giờ ở bước 3.
- **Then:** Các khung giờ hiển thị đảm bảo còn đủ 90 phút liên tiếp trước giờ đóng cửa.

### AC-04: Chọn "Bất kỳ thợ nào" thành công
- **Given:** Người dùng đang ở bước 2.
- **When:** Người dùng chọn "Bất kỳ thợ nào" và tiếp tục.
- **Then:** Hệ thống hiển thị tổng hợp khung giờ trống của tất cả thợ, đặt lịch thành công.

### AC-05: Khung giờ đã đặt không hiển thị
- **Given:** Thợ A đã có lịch hẹn 10:00–11:00 trạng thái CONFIRMED.
- **When:** Người dùng xem lịch giờ của thợ A ngày đó.
- **Then:** Khung 10:00 không xuất hiện trong danh sách giờ trống.

---

## 9. Mapping Business Spec → UI Elements

| Phần nghiệp vụ | Thành phần giao diện |
|---|---|
| Chỉ báo bước hiện tại | Step indicator / progress bar 4 bước ở đầu trang |
| Danh sách dịch vụ | Card theo nhóm danh mục, checkbox chọn nhiều, hiển thị giá + thời gian |
| Danh sách thợ | Card thợ với avatar, tên, sao đánh giá; card đặc biệt "Bất kỳ thợ nào" ở đầu |
| Chọn ngày | Calendar component, disable các ngày không hợp lệ |
| Chọn giờ | Grid các chip giờ (09:00, 09:30,...), chip đã đặt bị disabled và màu xám |
| Tóm tắt đặt lịch | Card tổng hợp: dịch vụ, thợ, ngày giờ, tổng tiền |
| Xác nhận | Nút "Xác nhận đặt lịch" — CTA chính, full width, disabled khi đang gửi |
| Trang thành công | Checkmark animation, mã lịch hẹn, nút "Xem lịch hẹn của tôi" |
| Điều hướng bước | Nút "Quay lại" (secondary) + "Tiếp theo" (primary) ở cuối mỗi bước |
