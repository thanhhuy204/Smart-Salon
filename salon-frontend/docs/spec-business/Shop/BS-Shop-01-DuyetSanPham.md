# Business Specification — Duyệt & Tìm kiếm sản phẩm
**Module:** Shop
**Phiên bản:** 1.0
**Ngày tạo:** 2026-03-27
**Tác giả:** Business Analyst

---

## 1. Business Goal

Cho phép người dùng (bao gồm cả khách vãng lai) duyệt danh mục sản phẩm, tìm kiếm theo từ khóa và xem chi tiết từng sản phẩm, nhằm hỗ trợ quyết định mua hàng trước khi tiến hành đặt đơn.

---

## 2. Actors

| Actor | Mô tả |
|---|---|
| Khách vãng lai | Duyệt và xem sản phẩm nhưng chưa đặt hàng |
| Người dùng đã đăng nhập (USER) | Duyệt, xem và tiến hành đặt hàng |
| Hệ thống | Hiển thị danh sách và chi tiết sản phẩm đang ở trạng thái hiển thị |

---

## 3. Preconditions

- Hệ thống có ít nhất một sản phẩm đang ở trạng thái **Đang bán**.
- Người dùng có thể truy cập trang Shop (`/shop`) mà không cần đăng nhập.

---

## 4. Main Flow (Happy Path)

### 4.1 Duyệt danh sách sản phẩm
1. Người dùng truy cập trang **Cửa hàng** (`/shop`).
2. Hệ thống hiển thị danh sách sản phẩm đang bán, nhóm theo danh mục (Dầu gội, Sáp wax, Serum,...).
3. Mỗi sản phẩm trong danh sách hiển thị: ảnh đại diện, tên, giá bán, số lượng còn trong kho (hoặc badge "Còn hàng" / "Hết hàng").
4. Người dùng có thể lọc theo danh mục hoặc sắp xếp theo giá (thấp → cao / cao → thấp), mới nhất.

### 4.2 Tìm kiếm sản phẩm
5. Người dùng nhập từ khóa vào ô tìm kiếm.
6. Hệ thống cập nhật danh sách ngay — hiển thị các sản phẩm có tên hoặc mô tả khớp với từ khóa.
7. Nếu không có kết quả: hệ thống hiển thị *"Không tìm thấy sản phẩm nào phù hợp."*

### 4.3 Xem chi tiết sản phẩm
8. Người dùng nhấn vào một sản phẩm.
9. Hệ thống hiển thị trang chi tiết gồm: bộ ảnh sản phẩm, tên, mô tả đầy đủ, giá bán, số lượng còn trong kho, danh mục, đánh giá từ người mua (nếu có).
10. Người dùng có thể chọn số lượng muốn mua.
11. Nút **"Thêm vào giỏ hàng"** và **"Mua ngay"** hiển thị rõ ràng.

---

## 5. Alternative Flows

### 5.1 Sản phẩm hết hàng
- **Tại bước 9:** Sản phẩm có số lượng tồn kho = 0.
- Hệ thống hiển thị badge **"Hết hàng"**, nút "Thêm vào giỏ hàng" và "Mua ngay" bị disabled.

### 5.2 Không có sản phẩm nào trong danh mục được lọc
- Hệ thống hiển thị: *"Chưa có sản phẩm nào trong danh mục này."*

### 5.3 Người dùng chưa đăng nhập nhấn "Thêm vào giỏ" hoặc "Mua ngay"
- Hệ thống chuyển hướng về trang Đăng nhập, sau khi đăng nhập quay lại trang sản phẩm đó.

---

## 6. Business Rules

| Mã | Quy tắc |
|---|---|
| BR-SHOP-01 | Chỉ hiển thị sản phẩm ở trạng thái **Đang bán** — sản phẩm tạm ẩn không hiển thị. |
| BR-SHOP-02 | Sản phẩm hết hàng vẫn hiển thị nhưng không cho phép thêm vào giỏ hoặc mua. |
| BR-SHOP-03 | Số lượng chọn mua tối thiểu là 1 và không vượt quá số lượng tồn kho. |
| BR-SHOP-04 | Trang chi tiết sản phẩm có thể truy cập bởi cả khách vãng lai (chỉ xem). |
| BR-SHOP-05 | Đánh giá sản phẩm chỉ hiển thị từ người dùng đã mua và đã nhận hàng. |

---

## 7. Edge Cases

| Tình huống | Hành vi mong đợi |
|---|---|
| Người dùng nhập số lượng lớn hơn tồn kho | Hệ thống tự giới hạn về số lượng tối đa còn trong kho. |
| Sản phẩm bị tắt khi người dùng đang xem trang chi tiết | Khi người dùng tải lại hoặc thực hiện hành động, hệ thống thông báo sản phẩm không còn bán. |
| Tìm kiếm với từ khóa chỉ có khoảng trắng | Hệ thống bỏ qua và hiển thị toàn bộ danh sách. |
| Ảnh sản phẩm lỗi không tải được | Hệ thống hiển thị ảnh placeholder mặc định. |

---

## 8. Acceptance Criteria (Given/When/Then)

### AC-01: Hiển thị danh sách sản phẩm
- **Given:** Có 10 sản phẩm đang bán thuộc 3 danh mục.
- **When:** Người dùng truy cập trang /shop.
- **Then:** Hệ thống hiển thị đủ 10 sản phẩm nhóm theo danh mục với ảnh, tên, giá.

### AC-02: Tìm kiếm sản phẩm theo tên
- **Given:** Có sản phẩm tên "Dầu gội Argan".
- **When:** Người dùng nhập "argan" vào ô tìm kiếm.
- **Then:** Hệ thống hiển thị sản phẩm "Dầu gội Argan" trong kết quả.

### AC-03: Sản phẩm hết hàng không cho mua
- **Given:** Sản phẩm "Sáp wax X" có tồn kho = 0.
- **When:** Người dùng xem trang chi tiết sản phẩm này.
- **Then:** Badge "Hết hàng" hiển thị, các nút mua/thêm giỏ bị disabled.

### AC-04: Lọc theo danh mục
- **Given:** Có 5 sản phẩm danh mục "Serum" và 5 sản phẩm danh mục khác.
- **When:** Người dùng chọn filter "Serum".
- **Then:** Chỉ hiển thị 5 sản phẩm danh mục Serum.

### AC-05: Yêu cầu đăng nhập khi thêm giỏ hàng
- **Given:** Người dùng chưa đăng nhập, đang xem chi tiết sản phẩm.
- **When:** Người dùng nhấn "Thêm vào giỏ hàng".
- **Then:** Hệ thống chuyển về trang đăng nhập; sau khi đăng nhập quay lại đúng trang sản phẩm.

---

## 9. Mapping Business Spec → UI Elements

| Phần nghiệp vụ | Thành phần giao diện |
|---|---|
| Danh sách sản phẩm | Grid card responsive: ảnh, tên, giá, badge tồn kho |
| Tìm kiếm | Search input với debounce, placeholder "Tìm sản phẩm..." |
| Lọc danh mục | Chip filter hoặc sidebar category list |
| Sắp xếp | Dropdown: "Mới nhất", "Giá thấp → cao", "Giá cao → thấp" |
| Trang chi tiết | Bộ ảnh (carousel), thông tin đầy đủ, bộ chọn số lượng, 2 nút CTA |
| Badge trạng thái | "Còn hàng" = xanh lá, "Hết hàng" = đỏ/xám |
| Đánh giá sản phẩm | Star rating + danh sách nhận xét phía dưới trang chi tiết |
