# Business Specification — Quản lý lịch hẹn (Người dùng)
**Module:** Booking
**Phiên bản:** 1.0
**Ngày tạo:** 2026-03-27
**Tác giả:** Business Analyst

---

## 1. Business Goal

Cho phép người dùng theo dõi toàn bộ lịch hẹn đã đặt của mình — xem danh sách phân theo trạng thái, xem chi tiết từng lịch hẹn và hủy lịch khi cần thiết — nhằm giúp người dùng chủ động kiểm soát lịch trình cá nhân.

---

## 2. Actors

| Actor | Mô tả |
|---|---|
| Người dùng đã đăng nhập (USER) | Xem và quản lý lịch hẹn của chính mình |
| Hệ thống | Hiển thị dữ liệu và xử lý yêu cầu hủy lịch |

---

## 3. Preconditions

- Người dùng đã đăng nhập.
- Người dùng có ít nhất một lịch hẹn (đã đặt bất kỳ trạng thái nào).

---

## 4. Main Flow (Happy Path)

### 4.1 Xem danh sách lịch hẹn
1. Người dùng truy cập trang **Lịch hẹn của tôi** (từ Profile hoặc trang Lịch sử hoạt động).
2. Hệ thống hiển thị danh sách lịch hẹn mặc định ở tab **"Sắp tới"** (bao gồm PENDING và CONFIRMED).
3. Có thêm các tab: **"Đã hoàn thành"** và **"Đã hủy"**.
4. Mỗi mục hiển thị: tên dịch vụ (rút gọn nếu nhiều), tên thợ, ngày giờ hẹn, trạng thái (badge màu).
5. Danh sách sắp xếp theo thời gian hẹn gần nhất trước (tab "Sắp tới"), mới nhất trước (tab còn lại).

### 4.2 Xem chi tiết lịch hẹn
6. Người dùng nhấn vào một mục lịch hẹn.
7. Hệ thống hiển thị trang/modal chi tiết gồm: danh sách dịch vụ, tên thợ (hoặc "Chưa phân công"), ngày giờ hẹn, trạng thái, địa chỉ salon, tổng giá tiền, mã lịch hẹn.

### 4.3 Hủy lịch hẹn
8. Người dùng thấy lịch hẹn trạng thái **PENDING**, nhấn nút **"Hủy lịch"**.
9. Hệ thống hiển thị hộp thoại xác nhận: *"Bạn có chắc muốn hủy lịch hẹn này không?"* với nút **"Hủy lịch"** và **"Không"**.
10. Người dùng nhấn **"Hủy lịch"** để xác nhận.
11. Hệ thống cập nhật trạng thái lịch hẹn thành **CANCELLED**.
12. Hệ thống hiển thị thông báo: *"Đã hủy lịch hẹn thành công."*
13. Danh sách cập nhật ngay: mục vừa hủy chuyển sang tab "Đã hủy".

---

## 5. Alternative Flows

### 5.1 Tab "Sắp tới" không có lịch hẹn nào
- Hệ thống hiển thị: *"Bạn chưa có lịch hẹn sắp tới."* kèm nút **"Đặt lịch ngay"**.

### 5.2 Người dùng nhấn "Không" tại hộp thoại hủy
- Hộp thoại đóng lại, lịch hẹn giữ nguyên trạng thái, không có thay đổi.

### 5.3 Lịch hẹn đã được Admin xác nhận (CONFIRMED)
- Nút **"Hủy lịch"** không hiển thị.
- Người dùng chỉ có thể xem chi tiết, không thể hủy.

### 5.4 Lỗi khi gửi yêu cầu hủy
- Hệ thống hiển thị thông báo: *"Không thể hủy lịch. Vui lòng thử lại sau."*
- Trạng thái lịch hẹn không thay đổi.

---

## 6. Business Rules

| Mã | Quy tắc |
|---|---|
| BR-MYBOOK-01 | Người dùng chỉ xem và quản lý được lịch hẹn của chính mình. |
| BR-MYBOOK-02 | Chỉ được hủy lịch hẹn khi trạng thái là **PENDING** (Chờ xác nhận). |
| BR-MYBOOK-03 | Khi hủy, trạng thái chuyển thành CANCELLED — không thể khôi phục. |
| BR-MYBOOK-04 | Lịch hẹn CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED đều không có nút hủy. |
| BR-MYBOOK-05 | Tab "Sắp tới" hiển thị các lịch hẹn PENDING và CONFIRMED có thời gian hẹn trong tương lai. |

---

## 7. Edge Cases

| Tình huống | Hành vi mong đợi |
|---|---|
| Admin đồng thời xác nhận lịch khi người dùng đang nhấn "Hủy lịch" | Hệ thống trả về lỗi "Lịch hẹn đã được xác nhận, không thể hủy." và cập nhật lại trạng thái. |
| Người dùng mở chi tiết từ link trực tiếp (mã lịch hẹn của người khác) | Hệ thống trả về lỗi 403/404 — không cho xem lịch của người khác. |
| Danh sách quá nhiều lịch | Phân trang hoặc lazy load — không tải toàn bộ một lần. |

---

## 8. Acceptance Criteria (Given/When/Then)

### AC-01: Xem danh sách lịch hẹn sắp tới
- **Given:** Người dùng có 2 lịch hẹn PENDING và 1 CONFIRMED trong tương lai.
- **When:** Người dùng vào tab "Sắp tới".
- **Then:** Hệ thống hiển thị cả 3 lịch hẹn, sắp xếp theo thời gian gần nhất.

### AC-02: Hủy lịch hẹn PENDING thành công
- **Given:** Người dùng có lịch hẹn trạng thái PENDING.
- **When:** Người dùng nhấn "Hủy lịch" và xác nhận.
- **Then:** Trạng thái chuyển thành CANCELLED, mục chuyển sang tab "Đã hủy", thông báo thành công hiển thị.

### AC-03: Không thể hủy lịch CONFIRMED
- **Given:** Người dùng có lịch hẹn trạng thái CONFIRMED.
- **When:** Người dùng xem lịch hẹn đó.
- **Then:** Không có nút "Hủy lịch" — chỉ có thể xem chi tiết.

### AC-04: Xem chi tiết đầy đủ
- **Given:** Người dùng đang xem danh sách lịch hẹn.
- **When:** Người dùng nhấn vào một mục.
- **Then:** Trang/modal chi tiết hiển thị đủ: dịch vụ, thợ, ngày giờ, địa chỉ salon, tổng tiền, mã lịch hẹn, trạng thái.

---

## 9. Mapping Business Spec → UI Elements

| Phần nghiệp vụ | Thành phần giao diện |
|---|---|
| Phân loại theo trạng thái | Tab bar: "Sắp tới", "Đã hoàn thành", "Đã hủy" |
| Mỗi mục lịch hẹn | Card: dịch vụ, thợ, ngày giờ, badge trạng thái màu tương ứng |
| Trạng thái badge | PENDING=vàng, CONFIRMED=xanh dương, IN_PROGRESS=cam, COMPLETED=xanh lá, CANCELLED=đỏ |
| Nút hủy lịch | Nút "Hủy lịch" màu đỏ — chỉ hiển thị với lịch PENDING |
| Hộp thoại xác nhận hủy | Dialog với cảnh báo, nút "Hủy lịch" đỏ và "Không" secondary |
| Trạng thái trống | Illustration + text + nút CTA đặt lịch |
| Trang chi tiết | Full page hoặc bottom sheet/modal với đầy đủ thông tin |
