# Business Specification — Trang chủ: Đội ngũ Barber

**Module:** Trang chủ
**Phiên bản:** 1.0
**Ngày tạo:** 2026-03-25
**Tác giả:** Business Analyst

---

## 1. Business Goal (Mục tiêu nghiệp vụ)

Xây dựng niềm tin với khách hàng bằng cách:
- Giới thiệu trực quan đội ngũ thợ cắt tóc của Salon.
- Tạo cảm giác gần gũi, chuyên nghiệp và minh bạch.
- Khuyến khích khách hàng chủ động chọn thợ khi đặt lịch.

---

## 2. Actors (Đối tượng sử dụng)

| Actor | Mô tả |
|-------|-------|
| **Khách vãng lai** | Người muốn biết ai sẽ phục vụ mình trước khi quyết định đặt lịch |
| **Khách tiềm năng** | Người đang so sánh và tìm kiếm thợ phù hợp |

---

## 3. Preconditions (Điều kiện tiên quyết)

- Section này nằm sau phần Dịch vụ - Sản phẩm trên trang chủ.
- Hệ thống phải có ít nhất 1 thông tin barber để hiển thị.
- Hiển thị với tất cả người dùng, không phân biệt trạng thái đăng nhập.

---

## 4. Main Flow (Luồng chính — Happy Path)

1. Người dùng cuộn xuống đến section Đội ngũ Barber.
2. Hệ thống hiển thị section với:
   - **Tiêu đề**: "ĐỘI NGŨ BARBER" — in đậm, nổi bật.
   - **Lưới ảnh chân dung** các barber: 2–3 cột, khoảng 6–8 ảnh.
   - Mỗi ảnh: phong cách chuyên nghiệp, tone đen trắng hoặc tối.
3. Người dùng xem qua các ảnh barber để cảm nhận đội ngũ.

---

## 5. Alternative Flows (Luồng thay thế)

### 5.1 Người dùng muốn xem thêm thông tin về một barber

- Nhấn vào ảnh barber → hệ thống hiển thị thông tin chi tiết (tên, chuyên môn, đánh giá) hoặc điều hướng đến trang chọn thợ trong luồng Đặt lịch.

### 5.2 Có nhiều hơn 8 barber

- Hiển thị tối đa 8 barber nổi bật trên trang chủ.
- Có nút "Xem tất cả" để xem đầy đủ danh sách.

---

## 6. Business Rules (Quy tắc nghiệp vụ)

| # | Quy tắc |
|---|---------|
| BR-01 | Hiển thị **6–8 barber nổi bật** trên trang chủ. |
| BR-02 | Ảnh chân dung phải có **phong cách chuyên nghiệp** — tone đen trắng hoặc tối. |
| BR-03 | Layout dạng **grid 2–3 cột**, đồng đều về kích thước ảnh. |
| BR-04 | Background section **trắng hoặc sáng** — tạo tương phản với các section tối xung quanh. |
| BR-05 | Mỗi ảnh barber ít nhất phải kèm **tên** của thợ đó. |

---

## 7. Edge Cases (Tình huống bất thường)

| Tình huống | Hành vi kỳ vọng |
|------------|-----------------|
| Ảnh barber không tải được | Hiển thị ảnh placeholder hình người, tên barber vẫn hiển thị |
| Ít hơn 6 barber | Hiển thị đúng số lượng hiện có, layout vẫn cân đối |
| Màn hình mobile | Grid chuyển sang 2 cột hoặc 1 cột, ảnh không bị vỡ |

---

## 8. Acceptance Criteria (Given / When / Then)

**AC-01**
- **Given:** Người dùng cuộn đến section Đội ngũ
- **When:** Nhìn vào section
- **Then:** Thấy tiêu đề "ĐỘI NGŨ BARBER" và lưới ảnh chân dung các barber

**AC-02**
- **Given:** Người dùng nhìn vào lưới ảnh
- **When:** Quan sát
- **Then:** Thấy từ 6–8 ảnh chân dung, đồng đều về kích thước, có tên kèm theo

**AC-03**
- **Given:** Ảnh của một barber không tải được
- **When:** Trang hiển thị
- **Then:** Hiển thị ảnh placeholder, tên barber vẫn hiển thị đầy đủ

---

## 9. Mapping Business Spec → UI Elements

| Business Requirement | UI Element tương ứng |
|----------------------|-----------------------|
| Xây dựng niềm tin | Ảnh chân dung thực tế, phong cách chuyên nghiệp |
| Giới thiệu đội ngũ | Grid ảnh 2–3 cột, 6–8 barber |
| Nhận diện từng thợ | Tên barber hiển thị dưới/trên mỗi ảnh |
| Khuyến khích chọn thợ | Có thể nhấn vào ảnh để xem chi tiết / đặt lịch với thợ đó |
