# Business Specification — Xem lịch sử hoạt động
**Module:** Profile
**Phiên bản:** 1.0
**Ngày tạo:** 2026-03-27
**Tác giả:** Business Analyst

---

## 1. Business Goal

Cho phép người dùng xem lại toàn bộ lịch sử hoạt động của mình trên hệ thống — bao gồm các lịch hẹn đặt chỗ và đơn hàng đã mua — nhằm theo dõi trạng thái, kiểm soát chi tiêu và tra cứu thông tin khi cần.

---

## 2. Actors

| Actor | Mô tả |
|---|---|
| Người dùng đã đăng nhập (USER) | Xem lịch sử của chính mình |
| Hệ thống | Truy xuất và hiển thị dữ liệu lịch sử theo người dùng |

---

## 3. Preconditions

- Người dùng đã đăng nhập vào hệ thống.
- Người dùng đang ở trang Trang cá nhân hoặc truy cập trực tiếp trang Lịch sử hoạt động.

---

## 4. Main Flow (Happy Path)

1. Người dùng vào trang **Lịch sử hoạt động** (từ menu dropdown trên Navbar hoặc tab trong trang Profile).
2. Hệ thống hiển thị giao diện có **hai tab**: **"Lịch hẹn"** và **"Đơn hàng"**, mặc định mở tab "Lịch hẹn".
3. Hệ thống hiển thị danh sách lịch hẹn của người dùng, sắp xếp theo thời gian mới nhất trước.
4. Mỗi mục lịch hẹn hiển thị: tên dịch vụ, tên thợ, ngày giờ hẹn, trạng thái (Chờ xác nhận / Đã xác nhận / Hoàn thành / Đã hủy).
5. Người dùng nhấn tab **"Đơn hàng"**.
6. Hệ thống hiển thị danh sách đơn hàng, sắp xếp theo thời gian mới nhất trước.
7. Mỗi mục đơn hàng hiển thị: mã đơn, danh sách sản phẩm (rút gọn), tổng tiền, trạng thái đơn hàng.
8. Người dùng nhấn vào một mục để xem chi tiết.
9. Hệ thống hiển thị trang/modal chi tiết đầy đủ của lịch hẹn hoặc đơn hàng đó.

---

## 5. Alternative Flows

### 5.1 Chưa có lịch hẹn nào
- **Tại bước 3:** Người dùng chưa có lịch hẹn nào.
- Hệ thống hiển thị trạng thái trống: *"Bạn chưa có lịch hẹn nào. Đặt lịch ngay!"* kèm nút **"Đặt lịch ngay"**.

### 5.2 Chưa có đơn hàng nào
- **Tại bước 6:** Người dùng chưa có đơn hàng nào.
- Hệ thống hiển thị trạng thái trống: *"Bạn chưa có đơn hàng nào. Mua sắm ngay!"* kèm nút **"Khám phá sản phẩm"**.

### 5.3 Lọc theo trạng thái
- **Tại bước 3 hoặc 6:** Người dùng chọn bộ lọc trạng thái (Tất cả / Chờ xác nhận / Đã xác nhận / Hoàn thành / Đã hủy).
- Hệ thống cập nhật danh sách chỉ hiển thị các mục khớp với trạng thái đã chọn.

### 5.4 Hủy lịch hẹn từ trang lịch sử
- **Tại bước 4:** Người dùng thấy lịch hẹn có trạng thái "Chờ xác nhận".
- Hệ thống hiển thị nút **"Hủy lịch"** trên mục đó.
- Người dùng nhấn "Hủy lịch" → hệ thống yêu cầu xác nhận → người dùng xác nhận → trạng thái cập nhật thành "Đã hủy".

### 5.5 Hủy đơn hàng từ trang lịch sử
- **Tại bước 7:** Người dùng thấy đơn hàng có trạng thái "Chờ xác nhận".
- Hệ thống hiển thị nút **"Hủy đơn"** trên mục đó.
- Người dùng nhấn "Hủy đơn" → hệ thống yêu cầu xác nhận → người dùng xác nhận → trạng thái cập nhật thành "Đã hủy".

---

## 6. Business Rules

| Mã | Quy tắc |
|---|---|
| BR-HISTORY-01 | Người dùng chỉ xem được lịch sử của chính mình — không thể xem lịch sử của người dùng khác. |
| BR-HISTORY-02 | Danh sách sắp xếp mặc định theo thời gian tạo mới nhất trước. |
| BR-HISTORY-03 | Lịch hẹn chỉ có thể hủy khi trạng thái là **PENDING** (Chờ xác nhận). |
| BR-HISTORY-04 | Đơn hàng chỉ có thể hủy khi trạng thái là **PENDING** (Chờ xác nhận). |
| BR-HISTORY-05 | Nút "Hủy lịch" / "Hủy đơn" chỉ hiển thị trên các mục ở trạng thái cho phép hủy. |
| BR-HISTORY-06 | Khi danh sách dài, hệ thống phân trang hoặc tải thêm theo cuộn (infinite scroll). |

---

## 7. Edge Cases

| Tình huống | Hành vi mong đợi |
|---|---|
| Người dùng nhấn hủy lịch hẹn đã được admin xác nhận | Nút "Hủy lịch" không hiển thị với trạng thái CONFIRMED trở đi. |
| Người dùng truy cập từ link trực tiếp đến chi tiết lịch hẹn | Hệ thống hiển thị đúng trang chi tiết nếu lịch hẹn thuộc về người dùng đó. |
| Lỗi kết nối khi tải danh sách | Hệ thống hiển thị thông báo lỗi và nút "Thử lại". |
| Danh sách quá dài | Hệ thống phân trang hoặc lazy loading, không tải toàn bộ một lúc. |

---

## 8. Acceptance Criteria (Given/When/Then)

### AC-01: Hiển thị danh sách lịch hẹn
- **Given:** Người dùng đã đăng nhập và có ít nhất 1 lịch hẹn.
- **When:** Người dùng vào trang Lịch sử hoạt động, tab "Lịch hẹn".
- **Then:** Hệ thống hiển thị danh sách lịch hẹn với tên dịch vụ, tên thợ, ngày giờ và trạng thái.

### AC-02: Hiển thị danh sách đơn hàng
- **Given:** Người dùng đã đăng nhập và có ít nhất 1 đơn hàng.
- **When:** Người dùng nhấn tab "Đơn hàng".
- **Then:** Hệ thống hiển thị danh sách đơn hàng với mã đơn, sản phẩm (rút gọn), tổng tiền và trạng thái.

### AC-03: Trạng thái trống khi chưa có dữ liệu
- **Given:** Người dùng chưa có lịch hẹn nào.
- **When:** Người dùng vào tab "Lịch hẹn".
- **Then:** Hệ thống hiển thị thông báo "Bạn chưa có lịch hẹn nào." và nút điều hướng đến trang đặt lịch.

### AC-04: Hủy lịch hẹn đang chờ xác nhận
- **Given:** Người dùng có lịch hẹn trạng thái "Chờ xác nhận".
- **When:** Người dùng nhấn "Hủy lịch" và xác nhận.
- **Then:** Trạng thái lịch hẹn cập nhật thành "Đã hủy" ngay trên danh sách.

### AC-05: Không thể hủy lịch hẹn đã được xác nhận
- **Given:** Người dùng có lịch hẹn trạng thái "Đã xác nhận".
- **When:** Người dùng xem mục lịch hẹn đó.
- **Then:** Nút "Hủy lịch" không xuất hiện.

### AC-06: Xem chi tiết lịch hẹn
- **Given:** Người dùng đang xem danh sách lịch hẹn.
- **When:** Người dùng nhấn vào một mục lịch hẹn.
- **Then:** Hệ thống hiển thị đầy đủ chi tiết: dịch vụ, thợ, giờ, địa chỉ salon.

---

## 9. Mapping Business Spec → UI Elements

| Phần nghiệp vụ | Thành phần giao diện |
|---|---|
| Điều hướng giữa hai loại lịch sử | Tab bar với 2 tab: "Lịch hẹn" và "Đơn hàng" |
| Mỗi mục lịch hẹn | Card hiển thị: dịch vụ, thợ, ngày giờ, badge trạng thái màu tương ứng |
| Mỗi mục đơn hàng | Card hiển thị: mã đơn, ảnh sản phẩm đầu tiên, tổng tiền, badge trạng thái |
| Bộ lọc trạng thái | Dropdown hoặc chip filter phía trên danh sách |
| Trạng thái trống | Illustration + text mô tả + nút CTA điều hướng |
| Nút hủy | Nút "Hủy lịch" / "Hủy đơn" màu đỏ, chỉ hiển thị với trạng thái PENDING |
| Xem chi tiết | Click vào card → mở trang chi tiết hoặc dialog |
| Phân trang | Pagination component hoặc "Xem thêm" ở cuối danh sách |
