# Business Specification — Quản lý đơn hàng & Đánh giá sản phẩm (Người dùng)
**Module:** Shop
**Phiên bản:** 1.0
**Ngày tạo:** 2026-03-27
**Tác giả:** Business Analyst

---

## 1. Business Goal

Cho phép người dùng theo dõi trạng thái tất cả đơn hàng đã đặt, xem chi tiết từng đơn, hủy đơn khi chưa được xử lý, và đánh giá sản phẩm sau khi nhận hàng — nhằm tạo trải nghiệm mua sắm minh bạch và tin cậy.

---

## 2. Actors

| Actor | Mô tả |
|---|---|
| Người dùng đã đăng nhập (USER) | Xem lịch sử đơn hàng, hủy đơn, đánh giá sản phẩm |
| Hệ thống | Cập nhật trạng thái đơn hàng và lưu đánh giá |

---

## 3. Preconditions

- Người dùng đã đăng nhập.
- Người dùng có ít nhất một đơn hàng trong lịch sử.

---

## 4. Main Flow (Happy Path)

### 4.1 Xem danh sách đơn hàng
1. Người dùng truy cập **"Đơn hàng của tôi"** (từ Profile hoặc Lịch sử hoạt động, tab "Đơn hàng").
2. Hệ thống hiển thị danh sách đơn hàng sắp xếp mới nhất trước.
3. Người dùng có thể lọc theo trạng thái: **Tất cả / Chờ xác nhận / Đang xử lý / Đang giao / Hoàn thành / Đã hủy**.
4. Mỗi mục hiển thị: mã đơn hàng, ngày đặt, ảnh sản phẩm đầu tiên (+ số còn lại nếu nhiều), tổng tiền, trạng thái.

### 4.2 Xem chi tiết đơn hàng
5. Người dùng nhấn vào một đơn hàng.
6. Hệ thống hiển thị trang chi tiết gồm: mã đơn, ngày đặt, danh sách sản phẩm (ảnh, tên, số lượng, đơn giá, thành tiền), địa chỉ giao hàng, phương thức thanh toán, tổng tiền hàng, phí vận chuyển, tổng cộng, trạng thái đơn hàng, timeline tiến trình.

### 4.3 Hủy đơn hàng
7. Người dùng thấy đơn hàng trạng thái **PENDING**, nhấn **"Hủy đơn"**.
8. Hệ thống hiển thị hộp thoại xác nhận: *"Bạn có chắc muốn hủy đơn hàng này không?"*
9. Người dùng xác nhận → Hệ thống cập nhật trạng thái thành **CANCELLED**.
10. Hệ thống hiển thị thông báo: *"Đã hủy đơn hàng thành công."*
11. Danh sách cập nhật: đơn hàng chuyển sang tab "Đã hủy".

### 4.4 Đánh giá sản phẩm
12. Người dùng thấy đơn hàng trạng thái **COMPLETED**, nhấn **"Đánh giá"**.
13. Hệ thống hiển thị form đánh giá cho từng sản phẩm trong đơn: chọn số sao (1–5), nhập nhận xét (tuỳ chọn).
14. Người dùng chọn sao và nhấn **"Gửi đánh giá"**.
15. Hệ thống lưu đánh giá và hiển thị thông báo: *"Cảm ơn bạn đã đánh giá!"*
16. Nút "Đánh giá" chuyển thành "Đã đánh giá" — không cho đánh giá lần 2.

---

## 5. Alternative Flows

### 5.1 Đơn hàng không ở trạng thái PENDING khi người dùng cố hủy
- Nút "Hủy đơn" không hiển thị với các trạng thái PROCESSING trở đi.
- Người dùng chỉ có thể xem chi tiết.

### 5.2 Người dùng nhấn "Không" tại hộp thoại hủy đơn
- Hộp thoại đóng lại, đơn hàng giữ nguyên trạng thái PENDING.

### 5.3 Chưa có đơn hàng nào
- Hệ thống hiển thị: *"Bạn chưa có đơn hàng nào."* kèm nút **"Mua sắm ngay"**.

### 5.4 Đơn hàng đã được đánh giá
- Nút "Đánh giá" thay bằng "Đã đánh giá" (disabled).
- Người dùng có thể xem lại đánh giá đã gửi nhưng không sửa được.

---

## 6. Business Rules

| Mã | Quy tắc |
|---|---|
| BR-MYORDER-01 | Người dùng chỉ xem và quản lý đơn hàng của chính mình. |
| BR-MYORDER-02 | Chỉ hủy được đơn hàng khi trạng thái là **PENDING** (Chờ xác nhận). |
| BR-MYORDER-03 | Đơn hàng ở trạng thái PROCESSING / SHIPPING / COMPLETED / CANCELLED không có nút hủy. |
| BR-MYORDER-04 | Chỉ được đánh giá sản phẩm khi đơn hàng ở trạng thái **COMPLETED**. |
| BR-MYORDER-05 | Mỗi sản phẩm trong mỗi đơn hàng chỉ được đánh giá **một lần**. |
| BR-MYORDER-06 | Đánh giá tối thiểu phải chọn số sao — phần nhận xét là tuỳ chọn. |

---

## 7. Edge Cases

| Tình huống | Hành vi mong đợi |
|---|---|
| Admin xử lý đơn đồng thời khi người dùng nhấn "Hủy đơn" | Hệ thống trả về lỗi "Đơn hàng đang được xử lý, không thể hủy." Cập nhật lại trạng thái mới. |
| Người dùng truy cập link chi tiết đơn hàng của người khác | Hệ thống trả về lỗi 403 — không cho xem. |
| Đơn hàng có nhiều sản phẩm, đánh giá từng cái | Form đánh giá hiển thị riêng từng sản phẩm trong đơn. |

---

## 8. Acceptance Criteria (Given/When/Then)

### AC-01: Xem danh sách đơn hàng
- **Given:** Người dùng có 3 đơn hàng ở các trạng thái khác nhau.
- **When:** Người dùng vào "Đơn hàng của tôi".
- **Then:** Hệ thống hiển thị 3 đơn, sắp xếp mới nhất trước, với mã đơn và trạng thái rõ ràng.

### AC-02: Xem chi tiết đơn hàng
- **Given:** Người dùng có đơn hàng với 2 sản phẩm.
- **When:** Người dùng nhấn vào đơn đó.
- **Then:** Hiển thị đầy đủ: 2 sản phẩm với số lượng/giá, địa chỉ giao, phương thức thanh toán, tổng tiền, timeline trạng thái.

### AC-03: Hủy đơn PENDING thành công
- **Given:** Người dùng có đơn hàng trạng thái PENDING.
- **When:** Người dùng nhấn "Hủy đơn" và xác nhận.
- **Then:** Trạng thái chuyển CANCELLED, thông báo thành công hiển thị.

### AC-04: Không có nút hủy với đơn PROCESSING
- **Given:** Đơn hàng trạng thái PROCESSING.
- **When:** Người dùng xem chi tiết đơn đó.
- **Then:** Không có nút "Hủy đơn" — chỉ hiển thị thông tin và trạng thái.

### AC-05: Đánh giá sản phẩm sau khi nhận hàng
- **Given:** Đơn hàng trạng thái COMPLETED, chưa được đánh giá.
- **When:** Người dùng nhấn "Đánh giá", chọn 5 sao và nhấn "Gửi đánh giá".
- **Then:** Đánh giá được lưu, nút "Đánh giá" chuyển thành "Đã đánh giá", rating của sản phẩm cập nhật.

### AC-06: Không đánh giá được lần 2
- **Given:** Sản phẩm đã được đánh giá trong đơn hàng COMPLETED.
- **When:** Người dùng xem lại đơn hàng đó.
- **Then:** Nút "Đã đánh giá" hiển thị disabled — không có option gửi đánh giá mới.

---

## 9. Mapping Business Spec → UI Elements

| Phần nghiệp vụ | Thành phần giao diện |
|---|---|
| Danh sách đơn hàng | Card list: mã đơn, thumbnail sản phẩm, tổng tiền, badge trạng thái |
| Lọc theo trạng thái | Tab bar hoặc dropdown filter phía trên danh sách |
| Badge trạng thái đơn | PENDING=vàng, PROCESSING=cam, SHIPPING=xanh dương, COMPLETED=xanh lá, CANCELLED=đỏ |
| Trang chi tiết đơn | Full page: product list, địa chỉ, phương thức, price breakdown, timeline |
| Timeline trạng thái | Stepper ngang/dọc thể hiện tiến trình đơn hàng |
| Nút hủy đơn | Nút đỏ "Hủy đơn" — chỉ hiển thị với PENDING |
| Form đánh giá | Modal: từng sản phẩm với star picker (1–5) + textarea nhận xét |
| Trạng thái đã đánh giá | Nút "Đã đánh giá" disabled màu xám |
