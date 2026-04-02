# Business Specification — Quản lý sản phẩm (Admin)
**Module:** Admin / Shop
**Phiên bản:** 1.0
**Ngày tạo:** 2026-03-27
**Tác giả:** Business Analyst

---

## 1. Business Goal

Cho phép quản trị viên quản lý toàn bộ danh mục sản phẩm bán lẻ của salon — thêm mới, cập nhật thông tin, bật/tắt hiển thị và xóa sản phẩm — nhằm đảm bảo cửa hàng trực tuyến luôn hiển thị đúng sản phẩm đang cung cấp với thông tin chính xác.

---

## 2. Actors

| Actor | Mô tả |
|---|---|
| Quản trị viên (ADMIN) | Quản lý toàn bộ sản phẩm và danh mục |
| Hệ thống | Lưu trữ và phản ánh dữ liệu sản phẩm lên trang cửa hàng của khách |

---

## 3. Preconditions

- Quản trị viên đã đăng nhập với quyền ADMIN.
- Đang ở trong Admin Dashboard, mục **"Quản lý sản phẩm"**.

---

## 4. Main Flow (Happy Path)

### 4.1 Xem danh sách sản phẩm
1. Admin truy cập mục **"Quản lý sản phẩm"**.
2. Hệ thống hiển thị toàn bộ sản phẩm (cả đang hiển thị lẫn tạm ẩn), nhóm theo danh mục.
3. Mỗi sản phẩm hiển thị: ảnh, tên, danh mục, giá bán, số lượng tồn kho, trạng thái.
4. Admin có thể lọc theo danh mục, trạng thái; tìm kiếm theo tên.

### 4.2 Thêm sản phẩm mới
5. Admin nhấn **"Thêm sản phẩm"**.
6. Hệ thống hiển thị form gồm: Tên sản phẩm, Danh mục, Mô tả, Giá bán, Số lượng tồn kho ban đầu, Ảnh sản phẩm (nhiều ảnh, tối đa 5).
7. Admin điền đầy đủ thông tin bắt buộc và nhấn **"Lưu"**.
8. Hệ thống tạo sản phẩm ở trạng thái **Đang hiển thị** mặc định.
9. Sản phẩm mới xuất hiện ngay trên trang cửa hàng của khách.

### 4.3 Sửa thông tin sản phẩm
10. Admin nhấn **"Chỉnh sửa"** trên một sản phẩm.
11. Hệ thống hiển thị form chỉnh sửa với dữ liệu hiện tại.
12. Admin cập nhật thông tin và nhấn **"Lưu"**.
13. Hệ thống lưu thay đổi và cập nhật ngay trên trang cửa hàng.

### 4.4 Bật / Tắt hiển thị sản phẩm
14. Admin nhấn toggle **"Tắt hiển thị"** trên sản phẩm đang hiển thị.
15. Hệ thống hiển thị xác nhận: *"Sản phẩm sẽ bị ẩn khỏi cửa hàng. Tiếp tục?"*
16. Admin xác nhận → sản phẩm chuyển sang trạng thái **Tạm ẩn**.
17. Khách không còn thấy sản phẩm này trên trang Shop.
18. Admin có thể bật lại bất kỳ lúc nào qua toggle **"Bật hiển thị"**.

### 4.5 Xóa sản phẩm
19. Admin nhấn **"Xóa"** trên sản phẩm muốn xóa.
20. Hệ thống kiểm tra sản phẩm có đang được tham chiếu trong đơn hàng PENDING / PROCESSING.
21. Nếu không có tham chiếu: yêu cầu xác nhận → xóa vĩnh viễn.
22. Nếu có tham chiếu: cảnh báo và đề nghị **Tắt hiển thị** thay vì xóa.

---

## 5. Alternative Flows

### 5.1 Tên sản phẩm để trống
- Hệ thống hiển thị lỗi: *"Tên sản phẩm không được để trống."*

### 5.2 Giá bán không hợp lệ
- Giá âm hoặc bằng 0: *"Giá bán phải lớn hơn 0."*

### 5.3 Số lượng tồn kho âm
- Hệ thống hiển thị lỗi: *"Số lượng tồn kho không được nhỏ hơn 0."*

### 5.4 Ảnh không hợp lệ
- File không phải JPG/PNG hoặc > 5MB: *"Vui lòng chọn file ảnh JPG/PNG, tối đa 5MB mỗi ảnh."*

### 5.5 Xóa danh mục còn sản phẩm
- Hệ thống cảnh báo: *"Danh mục này còn [N] sản phẩm. Hãy chuyển hoặc xóa sản phẩm trước."*

---

## 6. Business Rules

| Mã | Quy tắc |
|---|---|
| BR-PROD-01 | Tên sản phẩm là bắt buộc. |
| BR-PROD-02 | Giá bán phải là số dương lớn hơn 0. |
| BR-PROD-03 | Số lượng tồn kho không được âm; mặc định là 0 nếu không nhập. |
| BR-PROD-04 | Sản phẩm **Tạm ẩn** không hiển thị trên trang Shop nhưng dữ liệu đơn hàng lịch sử vẫn được giữ. |
| BR-PROD-05 | Không xóa sản phẩm đang được tham chiếu trong đơn hàng PENDING / PROCESSING — chỉ tắt hiển thị. |
| BR-PROD-06 | Mỗi sản phẩm có thể có tối đa 5 ảnh; ảnh đầu tiên là ảnh đại diện. |
| BR-PROD-07 | Thay đổi giá chỉ áp dụng cho đơn hàng mới — không ảnh hưởng đơn đã đặt trước. |
| BR-PROD-08 | Ảnh sản phẩm chỉ nhận JPG/PNG, tối đa 5MB mỗi ảnh. |

---

## 7. Edge Cases

| Tình huống | Hành vi mong đợi |
|---|---|
| Tồn kho về 0 (bán hết) | Sản phẩm vẫn hiển thị với badge "Hết hàng", không cho khách thêm vào giỏ. |
| Khách đang xem sản phẩm thì Admin tắt hiển thị | Khi khách tải lại trang, sản phẩm không còn hiển thị. |
| Admin sửa giá khi đang có đơn PENDING với sản phẩm đó | Đơn PENDING giữ giá cũ; đơn mới dùng giá mới. |
| Xóa ảnh đại diện (ảnh đầu tiên) | Ảnh tiếp theo trong danh sách trở thành ảnh đại diện mới. |
| Sản phẩm không có ảnh | Hệ thống hiển thị ảnh placeholder mặc định trên trang Shop. |

---

## 8. Acceptance Criteria (Given/When/Then)

### AC-01: Thêm sản phẩm mới thành công
- **Given:** Admin ở trang Quản lý sản phẩm.
- **When:** Admin điền đủ thông tin hợp lệ và nhấn "Lưu".
- **Then:** Sản phẩm xuất hiện trong danh sách Admin và trên trang Shop của khách.

### AC-02: Tắt hiển thị sản phẩm
- **Given:** Sản phẩm "Dầu gội X" đang hiển thị.
- **When:** Admin tắt toggle và xác nhận.
- **Then:** Sản phẩm chuyển trạng thái "Tạm ẩn", biến mất khỏi trang Shop của khách.

### AC-03: Bật lại sản phẩm
- **Given:** Sản phẩm "Dầu gội X" đang tạm ẩn.
- **When:** Admin bật toggle hiển thị.
- **Then:** Sản phẩm xuất hiện lại trên trang Shop.

### AC-04: Cảnh báo khi xóa sản phẩm có đơn đang xử lý
- **Given:** Sản phẩm "Serum Y" có trong 2 đơn hàng PENDING.
- **When:** Admin cố xóa sản phẩm này.
- **Then:** Hệ thống hiển thị cảnh báo và đề nghị tắt hiển thị thay vì xóa.

### AC-05: Lỗi giá bán không hợp lệ
- **Given:** Admin đang điền form thêm sản phẩm.
- **When:** Admin nhập giá "0" và nhấn "Lưu".
- **Then:** Hệ thống hiển thị lỗi "Giá bán phải lớn hơn 0.", không lưu sản phẩm.

### AC-06: Sản phẩm hết hàng hiển thị badge
- **Given:** Sản phẩm có tồn kho = 0, đang ở trạng thái Đang hiển thị.
- **When:** Khách xem trang Shop.
- **Then:** Sản phẩm hiển thị với badge "Hết hàng", nút mua/giỏ bị disabled.

---

## 9. Mapping Business Spec → UI Elements

| Phần nghiệp vụ | Thành phần giao diện |
|---|---|
| Danh sách sản phẩm Admin | Table: thumbnail, tên, danh mục, giá, tồn kho, trạng thái, hành động |
| Thêm / Sửa sản phẩm | Dialog/form: input tên, select danh mục, textarea mô tả, input giá, input tồn kho, multi-image upload (tối đa 5) |
| Bật / Tắt hiển thị | Toggle switch trong mỗi row + dialog xác nhận khi tắt |
| Badge trạng thái | "Đang hiển thị" = xanh lá; "Tạm ẩn" = xám |
| Badge tồn kho | Số tồn kho; khi = 0 hiển thị badge đỏ "Hết hàng" |
| Xóa sản phẩm | Nút "Xóa" đỏ + dialog xác nhận; cảnh báo nếu có đơn đang dùng |
| Upload nhiều ảnh | Dropzone cho phép chọn/kéo thả tối đa 5 file, preview grid, xóa từng ảnh |
| Tìm kiếm + Lọc | Search input real-time + dropdown danh mục + dropdown trạng thái |
