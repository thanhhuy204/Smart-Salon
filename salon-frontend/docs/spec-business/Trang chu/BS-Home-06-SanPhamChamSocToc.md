# Business Specification — Trang chủ: Sản phẩm chăm sóc tóc

**Module:** Trang chủ
**Phiên bản:** 1.0
**Ngày tạo:** 2026-03-25
**Tác giả:** Business Analyst

---

## 1. Business Goal (Mục tiêu nghiệp vụ)

Giới thiệu và thúc đẩy mua sắm sản phẩm chăm sóc tóc tại Salon:
- Hiển thị các sản phẩm tiêu biểu đang bán tại Salon.
- Tạo cơ hội bán hàng thêm (upsell) cho khách hàng đã hoặc sắp sử dụng dịch vụ.
- Kêu gọi người dùng khám phá đầy đủ danh mục sản phẩm.

---

## 2. Actors (Đối tượng sử dụng)

| Actor | Mô tả |
|-------|-------|
| **Khách vãng lai** | Người tìm kiếm sản phẩm chăm sóc tóc tại nhà |
| **Khách hàng dịch vụ** | Người đã/sắp sử dụng dịch vụ cắt tóc, muốn mua thêm sản phẩm |

---

## 3. Preconditions (Điều kiện tiên quyết)

- Section này là section cuối cùng trên trang chủ, trước Footer.
- Hệ thống phải có ít nhất 1 sản phẩm đang bán để hiển thị.
- Hiển thị với tất cả người dùng, không phân biệt trạng thái đăng nhập.

---

## 4. Main Flow (Luồng chính — Happy Path)

1. Người dùng cuộn xuống đến section Sản phẩm chăm sóc tóc.
2. Hệ thống hiển thị section với:
   - **Tiêu đề**: "SẢN PHẨM CHĂM SÓC TÓC" — nổi bật trên nền tối.
   - **Danh sách card sản phẩm**: Dạng card ngang hoặc grid 2 cột.
   - Mỗi card có: ảnh sản phẩm + tên sản phẩm + mô tả ngắn + nút hành động.
3. Người dùng xem qua các sản phẩm.
4. Người dùng nhấn nút **"Mua ngay"** hoặc **"Xem chi tiết"** trên một sản phẩm.
5. Hệ thống điều hướng đến trang chi tiết sản phẩm hoặc trang Shop.

---

## 5. Alternative Flows (Luồng thay thế)

### 5.1 Người dùng chưa đăng nhập nhấn "Mua ngay"

- Hệ thống điều hướng đến trang chi tiết sản phẩm.
- Nếu người dùng muốn thêm vào giỏ hàng, hệ thống yêu cầu đăng nhập.

### 5.2 Người dùng muốn xem toàn bộ sản phẩm

- Có nút "Xem tất cả sản phẩm" ở cuối section.
- Nhấn vào điều hướng đến trang Shop đầy đủ.

---

## 6. Business Rules (Quy tắc nghiệp vụ)

| # | Quy tắc |
|---|---------|
| BR-01 | Mỗi card sản phẩm phải có đủ: **ảnh sản phẩm**, **tên**, **mô tả ngắn**, **nút hành động**. |
| BR-02 | Nút hành động phải dẫn đến **trang chi tiết sản phẩm** hoặc **trang Shop**. |
| BR-03 | Background section phải là **màu tối** (dark green hoặc đen) — đồng nhất với tone thương hiệu. |
| BR-04 | Chỉ hiển thị **sản phẩm đang còn hàng** trên trang chủ. |
| BR-05 | Phải có đường dẫn đến **trang Shop đầy đủ** từ section này. |
| BR-06 | Ảnh sản phẩm phải rõ nét, thể hiện đúng sản phẩm thực tế (wax tóc, dầu gội, v.v.). |

---

## 7. Edge Cases (Tình huống bất thường)

| Tình huống | Hành vi kỳ vọng |
|------------|-----------------|
| Ảnh sản phẩm không tải được | Hiển thị ảnh placeholder, tên và mô tả sản phẩm vẫn đầy đủ |
| Sản phẩm hết hàng | Không hiển thị trên trang chủ hoặc hiển thị nhãn "Hết hàng" |
| Không có sản phẩm nào | Section không hiển thị hoặc hiển thị thông báo "Đang cập nhật" |
| Màn hình mobile | Card hiển thị 1 cột, ảnh và text không bị vỡ |

---

## 8. Acceptance Criteria (Given / When / Then)

**AC-01**
- **Given:** Người dùng cuộn đến section Sản phẩm
- **When:** Nhìn vào section
- **Then:** Thấy tiêu đề "SẢN PHẨM CHĂM SÓC TÓC" và các card sản phẩm trên nền tối

**AC-02**
- **Given:** Người dùng nhìn vào một card sản phẩm
- **When:** Quan sát card
- **Then:** Thấy đủ: ảnh sản phẩm, tên, mô tả ngắn và nút hành động

**AC-03**
- **Given:** Người dùng nhấn nút "Xem chi tiết" trên một sản phẩm
- **When:** Nhấn xong
- **Then:** Hệ thống điều hướng đến trang chi tiết của sản phẩm đó

**AC-04**
- **Given:** Người dùng nhấn nút "Xem tất cả sản phẩm"
- **When:** Nhấn xong
- **Then:** Hệ thống điều hướng đến trang Shop

**AC-05**
- **Given:** Một sản phẩm đang hết hàng
- **When:** Trang chủ được tải
- **Then:** Sản phẩm đó không xuất hiện trong section này

---

## 9. Mapping Business Spec → UI Elements

| Business Requirement | UI Element tương ứng |
|----------------------|-----------------------|
| Giới thiệu sản phẩm | Tiêu đề + grid/card ngang sản phẩm |
| Hình ảnh thu hút | Ảnh sản phẩm rõ nét trên mỗi card |
| Kêu gọi mua hàng | Nút "Mua ngay" / "Xem chi tiết" trên mỗi card |
| Điều hướng đến Shop | Nút "Xem tất cả sản phẩm" cuối section |
| Tone thương hiệu | Background tối (dark green / đen) toàn section |
