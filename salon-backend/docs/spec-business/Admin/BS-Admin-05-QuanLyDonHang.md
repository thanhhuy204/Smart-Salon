# Business Specification — Quản lý đơn hàng (Admin)
**Module:** Admin / Shop
**Phiên bản:** 1.0
**Ngày tạo:** 2026-03-27
**Tác giả:** Business Analyst

---

## 1. Business Goal

Cho phép quản trị viên xem toàn bộ đơn hàng của khách, xác nhận và điều phối xử lý, cập nhật từng bước trạng thái giao hàng và xử lý hủy đơn kèm hoàn tiền — nhằm đảm bảo đơn hàng được thực hiện nhanh chóng và khách hàng nhận được hàng đúng hẹn.

---

## 2. Actors

| Actor | Mô tả |
|---|---|
| Quản trị viên (ADMIN) | Xem, xác nhận, cập nhật và hủy đơn hàng của toàn bộ khách |
| Hệ thống | Cập nhật trạng thái và gửi thông báo cho khách |

---

## 3. Preconditions

- Quản trị viên đã đăng nhập với quyền ADMIN.
- Đang ở trong Admin Dashboard, mục **"Quản lý đơn hàng"**.

---

## 4. Main Flow (Happy Path)

### 4.1 Xem danh sách đơn hàng
1. Admin truy cập mục **"Quản lý đơn hàng"**.
2. Hệ thống hiển thị toàn bộ đơn hàng, sắp xếp mới nhất trước.
3. Admin có thể lọc theo: trạng thái, ngày đặt hàng, phương thức thanh toán.
4. Admin có thể tìm kiếm theo: mã đơn hàng, tên khách, số điện thoại.
5. Mỗi đơn hiển thị: mã đơn, tên khách, ngày đặt, tổng tiền, phương thức thanh toán, trạng thái.

### 4.2 Xem chi tiết đơn hàng
6. Admin nhấn vào một đơn hàng.
7. Hệ thống hiển thị chi tiết đầy đủ: danh sách sản phẩm (tên, số lượng, giá), địa chỉ giao hàng, phương thức thanh toán, tổng tiền, trạng thái, lịch sử thay đổi trạng thái.

### 4.3 Xác nhận đơn hàng (PENDING → PROCESSING)
8. Admin thấy đơn hàng trạng thái **PENDING**, nhấn **"Xác nhận đơn"**.
9. Hệ thống cập nhật trạng thái thành **PROCESSING**.
10. Hệ thống gửi thông báo cho khách: *"Đơn hàng của bạn đang được xử lý."*

### 4.4 Cập nhật trạng thái giao hàng
11. Admin nhấn **"Chuyển sang Đang giao"** khi đơn đã được đóng gói xong (PROCESSING → SHIPPING).
12. Hệ thống cập nhật và gửi thông báo: *"Đơn hàng của bạn đang được giao."*
13. Admin nhấn **"Hoàn thành"** khi xác nhận đã giao đến tay khách (SHIPPING → COMPLETED).
14. Hệ thống cập nhật và gửi thông báo kèm lời mời đánh giá sản phẩm.

### 4.5 Hủy đơn hàng (kèm hoàn tiền)
15. Admin nhấn **"Hủy đơn"** — có thể hủy ở trạng thái PENDING hoặc PROCESSING.
16. Hệ thống hiển thị form: Admin nhập lý do hủy (bắt buộc) và chọn hình thức hoàn tiền (nếu không phải COD).
17. Admin xác nhận → hệ thống cập nhật trạng thái thành **CANCELLED**.
18. Hệ thống ghi nhận yêu cầu hoàn tiền (nếu có) vào lịch sử giao dịch.
19. Hệ thống gửi thông báo cho khách kèm lý do hủy và thông tin hoàn tiền.

---

## 5. Alternative Flows

### 5.1 Quên nhập lý do khi hủy
- Hệ thống hiển thị lỗi: *"Vui lòng nhập lý do hủy đơn."*

### 5.2 Đơn hàng đã ở SHIPPING khi cần hủy
- **Tại bước 15:** Admin cố hủy đơn trạng thái SHIPPING.
- Hệ thống cảnh báo: *"Đơn hàng đang trên đường giao. Hủy sẽ cần liên hệ đơn vị vận chuyển."*
- Admin tự quyết định, nếu xác nhận hủy thì quy trình hoàn tiền được ghi nhận.

### 5.3 Không có đơn nào trong bộ lọc đang áp dụng
- Hệ thống hiển thị: *"Không có đơn hàng nào phù hợp."*

### 5.4 Khách đồng thời hủy đơn khi Admin đang xác nhận
- Hệ thống thông báo: *"Đơn hàng đã bị hủy bởi khách."* — Admin không thể xác nhận thêm.

---

## 6. Business Rules

| Mã | Quy tắc |
|---|---|
| BR-ADMORD-01 | Chỉ Admin mới được xác nhận, cập nhật trạng thái và hủy đơn hàng. |
| BR-ADMORD-02 | Thứ tự trạng thái bắt buộc: PENDING → PROCESSING → SHIPPING → COMPLETED. Không được bỏ bước. |
| BR-ADMORD-03 | Admin có thể hủy đơn ở mọi trạng thái trước COMPLETED. |
| BR-ADMORD-04 | Lý do hủy đơn là bắt buộc khi Admin thực hiện hủy. |
| BR-ADMORD-05 | Khi hủy đơn đã thanh toán (chuyển khoản / ví điện tử), hệ thống ghi nhận yêu cầu hoàn tiền. |
| BR-ADMORD-06 | Đơn COD bị hủy không phát sinh hoàn tiền. |
| BR-ADMORD-07 | Đơn trạng thái COMPLETED và CANCELLED là cuối cùng — không thể thay đổi thêm. |
| BR-ADMORD-08 | Mọi thay đổi trạng thái đều phải gửi thông báo cho khách hàng. |

---

## 7. Edge Cases

| Tình huống | Hành vi mong đợi |
|---|---|
| Nhiều Admin cùng xử lý một đơn đồng thời | Hệ thống chỉ cho phép một thao tác thành công; người sau nhận thông báo đơn đã được xử lý. |
| Đơn hàng có sản phẩm đã bị xóa | Vẫn hiển thị đủ thông tin đơn — lịch sử được giữ nguyên dù sản phẩm không còn tồn tại. |
| Admin tìm kiếm đơn theo số điện thoại | Hệ thống hỗ trợ tìm kiếm theo số điện thoại người đặt. |

---

## 8. Acceptance Criteria (Given/When/Then)

### AC-01: Xem danh sách toàn bộ đơn hàng
- **Given:** Hệ thống có 50 đơn hàng của nhiều khách.
- **When:** Admin vào trang Quản lý đơn hàng.
- **Then:** Hiển thị toàn bộ đơn, có phân trang, lọc và tìm kiếm hoạt động đúng.

### AC-02: Xác nhận đơn hàng PENDING
- **Given:** Đơn hàng trạng thái PENDING.
- **When:** Admin nhấn "Xác nhận đơn".
- **Then:** Trạng thái chuyển PROCESSING, khách nhận thông báo.

### AC-03: Cập nhật đúng thứ tự trạng thái
- **Given:** Đơn hàng đang PROCESSING.
- **When:** Admin nhấn "Chuyển sang Đang giao".
- **Then:** Trạng thái chuyển SHIPPING; nút "Hoàn thành" xuất hiện, nút "Chuyển sang Đang giao" biến mất.

### AC-04: Hủy đơn kèm lý do
- **Given:** Đơn hàng PROCESSING, thanh toán chuyển khoản.
- **When:** Admin nhập lý do "Hết hàng" và xác nhận hủy.
- **Then:** Trạng thái CANCELLED, khách nhận thông báo kèm lý do và thông tin hoàn tiền.

### AC-05: Không hủy được khi thiếu lý do
- **Given:** Admin đang ở form hủy đơn.
- **When:** Admin để trống lý do và nhấn xác nhận.
- **Then:** Hệ thống hiển thị lỗi "Vui lòng nhập lý do hủy đơn.", không thực hiện hành động.

---

## 9. Mapping Business Spec → UI Elements

| Phần nghiệp vụ | Thành phần giao diện |
|---|---|
| Danh sách đơn hàng | Table với cột: mã đơn, khách, ngày, tổng tiền, PTTT, trạng thái, hành động |
| Tìm kiếm + Lọc | Search input + dropdown trạng thái + date range picker |
| Badge trạng thái | PENDING=vàng, PROCESSING=cam, SHIPPING=xanh dương, COMPLETED=xanh lá, CANCELLED=đỏ |
| Nút hành động | Hiển thị đúng theo trạng thái: "Xác nhận", "Đang giao", "Hoàn thành", "Hủy" |
| Form hủy đơn | Dialog: textarea lý do (bắt buộc) + radio hoàn tiền + nút xác nhận |
| Lịch sử trạng thái | Timeline trong trang chi tiết đơn hàng |
