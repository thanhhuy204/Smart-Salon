# Business Specification — Đặt hàng & Thanh toán
**Module:** Shop
**Phiên bản:** 1.0
**Ngày tạo:** 2026-03-27
**Tác giả:** Business Analyst

---

## 1. Business Goal

Cho phép người dùng đã đăng nhập thêm sản phẩm vào giỏ hàng, chọn địa chỉ giao hàng, chọn phương thức thanh toán và đặt đơn hàng — nhận thông báo xác nhận ngay sau khi đơn được tạo thành công.

---

## 2. Actors

| Actor | Mô tả |
|---|---|
| Người dùng đã đăng nhập (USER) | Thêm vào giỏ hàng, chọn địa chỉ, thanh toán |
| Hệ thống | Kiểm tra tồn kho, tạo đơn hàng, gửi thông báo |

---

## 3. Preconditions

- Người dùng đã đăng nhập.
- Sản phẩm muốn mua đang ở trạng thái **Đang bán** và còn hàng.

---

## 4. Main Flow (Happy Path)

### 4.1 Thêm vào giỏ hàng
1. Từ trang danh sách hoặc chi tiết sản phẩm, người dùng chọn số lượng và nhấn **"Thêm vào giỏ hàng"**.
2. Hệ thống thêm sản phẩm vào giỏ, cập nhật số lượng trên icon giỏ hàng ở Navbar.
3. Hệ thống hiển thị thông báo: *"Đã thêm vào giỏ hàng."*

### 4.2 Xem và chỉnh sửa giỏ hàng
4. Người dùng mở giỏ hàng (nhấn icon giỏ trên Navbar).
5. Hệ thống hiển thị danh sách sản phẩm trong giỏ: ảnh, tên, giá, số lượng, thành tiền từng dòng và tổng tiền.
6. Người dùng có thể: tăng/giảm số lượng từng sản phẩm, hoặc xóa sản phẩm khỏi giỏ.
7. Người dùng nhấn **"Đặt hàng"** để tiến hành thanh toán.

### 4.3 Chọn địa chỉ giao hàng
8. Hệ thống hiển thị danh sách địa chỉ đã lưu của người dùng.
9. Người dùng chọn một địa chỉ làm địa chỉ giao hàng.
10. Nếu muốn, người dùng nhấn **"Thêm địa chỉ mới"** để thêm địa chỉ.

### 4.4 Thêm / Sửa / Xóa địa chỉ
11. Người dùng điền form địa chỉ: Họ tên người nhận, Số điện thoại, Tỉnh/Thành, Quận/Huyện, Phường/Xã, Địa chỉ cụ thể.
12. Người dùng có thể đặt làm **địa chỉ mặc định**.
13. Người dùng nhấn **"Lưu địa chỉ"**.

### 4.5 Chọn phương thức thanh toán
14. Hệ thống hiển thị các phương thức: **COD** (Thanh toán khi nhận hàng), **Chuyển khoản ngân hàng**, **Ví điện tử** (MoMo, ZaloPay).
15. Người dùng chọn một phương thức.

### 4.6 Xác nhận đặt hàng
16. Hệ thống hiển thị trang tóm tắt đơn hàng: sản phẩm, địa chỉ giao, phương thức thanh toán, tổng tiền hàng, phí vận chuyển (nếu có), tổng cộng.
17. Người dùng nhấn **"Xác nhận đặt hàng"**.
18. Hệ thống kiểm tra lại tồn kho lần cuối.
19. Hệ thống tạo đơn hàng trạng thái **PENDING**.
20. Hệ thống gửi thông báo xác nhận cho người dùng (in-app / email).
21. Hệ thống hiển thị trang thành công với mã đơn hàng và nút **"Xem đơn hàng"**.

---

## 5. Alternative Flows

### 5.1 Sản phẩm hết hàng khi xác nhận (bước 18)
- Trong lúc người dùng chọn địa chỉ/thanh toán, sản phẩm vừa hết hàng.
- Hệ thống hiển thị: *"Sản phẩm [tên] đã hết hàng. Vui lòng cập nhật giỏ hàng."*
- Đơn hàng không được tạo; người dùng quay lại giỏ để xử lý.

### 5.2 Số lượng trong giỏ vượt tồn kho
- **Tại bước 6:** Người dùng tăng số lượng vượt quá tồn kho.
- Hệ thống giới hạn số lượng về mức tối đa và thông báo: *"Chỉ còn [N] sản phẩm trong kho."*

### 5.3 Giỏ hàng trống khi nhấn "Đặt hàng"
- Hệ thống hiển thị: *"Giỏ hàng của bạn đang trống."* và nút **"Tiếp tục mua sắm"**.

### 5.4 Chưa có địa chỉ nào
- **Tại bước 8:** Người dùng chưa lưu địa chỉ nào.
- Hệ thống tự động mở form thêm địa chỉ mới.

### 5.5 Chọn Chuyển khoản ngân hàng
- **Tại bước 15:** Người dùng chọn Chuyển khoản.
- Sau khi xác nhận đơn, hệ thống hiển thị thông tin tài khoản ngân hàng và nội dung chuyển khoản (mã đơn hàng).
- Đơn giữ trạng thái PENDING cho đến khi Admin xác nhận đã nhận được tiền.

### 5.6 Xóa sản phẩm khỏi giỏ
- **Tại bước 6:** Người dùng nhấn icon xóa trên một sản phẩm.
- Hệ thống hiển thị xác nhận nhanh → xóa và cập nhật tổng tiền.

---

## 6. Business Rules

| Mã | Quy tắc |
|---|---|
| BR-ORDER-01 | Người dùng phải đăng nhập mới được đặt hàng. |
| BR-ORDER-02 | Số lượng trong giỏ không được vượt quá tồn kho hiện tại. |
| BR-ORDER-03 | Phải có ít nhất một địa chỉ giao hàng trước khi xác nhận đơn. |
| BR-ORDER-04 | Phải chọn phương thức thanh toán trước khi xác nhận đơn. |
| BR-ORDER-05 | Đơn hàng mới tạo luôn ở trạng thái **PENDING** — chờ Admin xác nhận. |
| BR-ORDER-06 | Hệ thống kiểm tra tồn kho lần cuối tại thời điểm xác nhận đặt hàng. |
| BR-ORDER-07 | Tổng tiền hiển thị bao gồm giá sản phẩm × số lượng; phí vận chuyển tính thêm nếu có. |
| BR-ORDER-08 | Sau khi đặt hàng thành công, giỏ hàng tự động được xóa sạch. |

---

## 7. Edge Cases

| Tình huống | Hành vi mong đợi |
|---|---|
| Người dùng thêm cùng sản phẩm vào giỏ nhiều lần | Hệ thống gộp thành một dòng và cộng dồn số lượng. |
| Giá sản phẩm thay đổi khi đang trong giỏ | Giỏ hàng hiển thị giá mới khi tải lại; thông báo nếu giá tăng. |
| Sản phẩm bị tắt hiển thị khi đang trong giỏ | Hệ thống đánh dấu sản phẩm đó là "Không còn bán" trong giỏ, không cho tiến hành đặt. |
| Mất mạng khi đang xác nhận đơn | Hệ thống giữ lại thông tin giỏ và địa chỉ; nút xác nhận có thể nhấn lại sau khi có mạng. |
| Người dùng xóa địa chỉ mặc định | Hệ thống yêu cầu chọn hoặc thêm địa chỉ mới trước khi đặt hàng. |

---

## 8. Acceptance Criteria (Given/When/Then)

### AC-01: Thêm vào giỏ hàng thành công
- **Given:** Người dùng đang xem chi tiết sản phẩm còn hàng.
- **When:** Người dùng chọn số lượng 2 và nhấn "Thêm vào giỏ hàng".
- **Then:** Icon giỏ hàng trên Navbar hiển thị số lượng tăng lên, toast thông báo thành công.

### AC-02: Đặt hàng thành công với COD
- **Given:** Giỏ có 2 sản phẩm, người dùng đã có địa chỉ lưu sẵn.
- **When:** Người dùng chọn địa chỉ, chọn COD và nhấn "Xác nhận đặt hàng".
- **Then:** Đơn hàng tạo trạng thái PENDING, giỏ hàng xóa sạch, trang thành công hiển thị mã đơn.

### AC-03: Sản phẩm hết hàng khi xác nhận
- **Given:** Sản phẩm A trong giỏ vừa hết hàng.
- **When:** Người dùng nhấn "Xác nhận đặt hàng".
- **Then:** Hệ thống hiển thị thông báo sản phẩm hết hàng, không tạo đơn, yêu cầu cập nhật giỏ.

### AC-04: Thêm địa chỉ mới trong luồng đặt hàng
- **Given:** Người dùng chưa có địa chỉ nào.
- **When:** Người dùng tiến hành đặt hàng.
- **Then:** Hệ thống hiển thị form thêm địa chỉ, sau khi lưu địa chỉ người dùng tiếp tục đặt hàng được.

### AC-05: Gộp sản phẩm trùng trong giỏ
- **Given:** Giỏ đang có sản phẩm X số lượng 1.
- **When:** Người dùng thêm sản phẩm X số lượng 2 từ trang khác.
- **Then:** Giỏ hàng hiển thị sản phẩm X số lượng 3 (gộp lại).

---

## 9. Mapping Business Spec → UI Elements

| Phần nghiệp vụ | Thành phần giao diện |
|---|---|
| Giỏ hàng (Navbar) | Icon giỏ hàng với badge số lượng sản phẩm |
| Trang giỏ hàng | Table/list: ảnh, tên, giá đơn vị, stepper số lượng, thành tiền, nút xóa |
| Tổng tiền | Summary card bên phải: tổng hàng, phí ship, tổng cộng, nút "Đặt hàng" |
| Chọn địa chỉ | Radio list địa chỉ đã lưu + nút "Thêm địa chỉ mới" |
| Form địa chỉ | Modal/drawer với các input bắt buộc + checkbox địa chỉ mặc định |
| Phương thức thanh toán | Radio group: COD, Chuyển khoản, MoMo, ZaloPay (có logo) |
| Tóm tắt đơn hàng | Card tổng hợp trước khi xác nhận |
| Nút xác nhận | "Xác nhận đặt hàng" — CTA chính, disabled khi đang xử lý + spinner |
| Trang thành công | Checkmark animation, mã đơn hàng, nút "Xem đơn hàng" + "Tiếp tục mua sắm" |
