# Business Specification — Trang chủ: Dịch vụ - Sản phẩm

**Module:** Trang chủ
**Phiên bản:** 1.0
**Ngày tạo:** 2026-03-25
**Tác giả:** Business Analyst

---

## 1. Business Goal (Mục tiêu nghiệp vụ)

Giới thiệu tổng quan các dịch vụ nổi bật của Salon để người dùng:
- Nắm được Salon cung cấp những dịch vụ gì.
- Cảm nhận được chất lượng và phong cách thông qua hình ảnh minh họa.
- Được dẫn dắt tìm hiểu thêm hoặc đặt lịch trực tiếp.

---

## 2. Actors (Đối tượng sử dụng)

| Actor | Mô tả |
|-------|-------|
| **Khách vãng lai** | Người chưa biết Salon có những dịch vụ gì |
| **Khách tiềm năng** | Người đang cân nhắc chọn dịch vụ phù hợp |

---

## 3. Preconditions (Điều kiện tiên quyết)

- Section này nằm sau phần Giới thiệu trên trang chủ.
- Hiển thị với tất cả người dùng, không phân biệt trạng thái đăng nhập.
- Hệ thống phải có ít nhất 1 dịch vụ để hiển thị.

---

## 4. Main Flow (Luồng chính — Happy Path)

1. Người dùng cuộn xuống đến section Dịch vụ - Sản phẩm.
2. Hệ thống hiển thị section với:
   - **Tiêu đề section**: "DỊCH VỤ - SẢN PHẨM" — màu trắng/vàng trên nền xanh rêu đậm.
   - **Danh sách card dịch vụ**: Mỗi card gồm ảnh minh họa + tên dịch vụ + mô tả ngắn + nút "Xem thêm".
3. Người dùng đọc lướt qua các card dịch vụ.
4. Người dùng nhấn nút **"Xem thêm"** trên một card.
5. Hệ thống điều hướng đến trang chi tiết dịch vụ tương ứng hoặc trang Đặt lịch.

---

## 5. Alternative Flows (Luồng thay thế)

### 5.1 Người dùng muốn xem tất cả dịch vụ

- Có nút hoặc liên kết "Xem tất cả dịch vụ" ở cuối section.
- Nhấn vào điều hướng đến trang danh sách đầy đủ các dịch vụ.

---

## 6. Business Rules (Quy tắc nghiệp vụ)

| # | Quy tắc |
|---|---------|
| BR-01 | Mỗi card dịch vụ phải có đủ: **ảnh minh họa**, **tên dịch vụ**, **mô tả ngắn**, **nút hành động**. |
| BR-02 | Ảnh minh họa phải thể hiện **không gian hoặc hoạt động tại tiệm** — tone tối, phong cách vintage/classic. |
| BR-03 | Nút "Xem thêm" phải dẫn đến **thông tin chi tiết hoặc trang đặt lịch** của dịch vụ đó. |
| BR-04 | Background section phải là **màu xanh rêu đậm** — màu chủ đạo thương hiệu. |
| BR-05 | Tiêu đề và text trên nền xanh rêu phải **màu trắng hoặc vàng** để đảm bảo độ tương phản. |
| BR-06 | Section hiển thị **tối thiểu 2 dịch vụ nổi bật** trên trang chủ. |

---

## 7. Edge Cases (Tình huống bất thường)

| Tình huống | Hành vi kỳ vọng |
|------------|-----------------|
| Ảnh dịch vụ không tải được | Hiển thị ảnh placeholder, các thông tin khác trên card vẫn hiển thị đầy đủ |
| Mô tả dịch vụ quá dài | Cắt ngắn với dấu "…", người dùng nhấn "Xem thêm" để đọc đầy đủ |
| Không có dịch vụ nào | Section không hiển thị hoặc hiển thị thông báo "Đang cập nhật" |
| Màn hình mobile | Card dịch vụ hiển thị theo dạng 1 cột, không bị tràn |

---

## 8. Acceptance Criteria (Given / When / Then)

**AC-01**
- **Given:** Người dùng cuộn đến section Dịch vụ
- **When:** Nhìn vào section
- **Then:** Thấy tiêu đề "DỊCH VỤ - SẢN PHẨM" và các card dịch vụ trên nền xanh rêu đậm

**AC-02**
- **Given:** Người dùng nhìn vào một card dịch vụ
- **When:** Quan sát card
- **Then:** Thấy đủ: ảnh minh họa, tên dịch vụ, mô tả ngắn và nút "Xem thêm"

**AC-03**
- **Given:** Người dùng nhấn nút "Xem thêm" trên một card
- **When:** Nhấn xong
- **Then:** Hệ thống điều hướng đến trang chi tiết hoặc trang Đặt lịch của dịch vụ đó

**AC-04**
- **Given:** Ảnh của một card không tải được
- **When:** Trang hiển thị
- **Then:** Card vẫn hiển thị đầy đủ tên, mô tả và nút — chỉ ảnh được thay bằng placeholder

---

## 9. Mapping Business Spec → UI Elements

| Business Requirement | UI Element tương ứng |
|----------------------|-----------------------|
| Giới thiệu danh mục dịch vụ | Tiêu đề section + grid card dịch vụ |
| Hình ảnh chất lượng | Ảnh tone tối vintage trên mỗi card |
| Kêu gọi tìm hiểu thêm | Nút "Xem thêm" trên mỗi card |
| Nhận diện thương hiệu qua màu sắc | Background xanh rêu đậm toàn section |
