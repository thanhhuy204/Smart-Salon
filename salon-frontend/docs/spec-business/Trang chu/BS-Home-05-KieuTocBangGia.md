# Business Specification — Trang chủ: Kiểu tóc / Bảng giá

**Module:** Trang chủ
**Phiên bản:** 1.0
**Ngày tạo:** 2026-03-25
**Tác giả:** Business Analyst

---

## 1. Business Goal (Mục tiêu nghiệp vụ)

Giúp khách hàng hình dung và lựa chọn kiểu tóc phù hợp trước khi đặt lịch:
- Hiển thị trực quan các mẫu tóc nam đang có tại Salon.
- Giúp khách hàng dễ dàng tham khảo và đưa ra yêu cầu cụ thể khi gặp thợ.
- Kết hợp với thông tin bảng giá để hỗ trợ quyết định.

---

## 2. Actors (Đối tượng sử dụng)

| Actor | Mô tả |
|-------|-------|
| **Khách vãng lai** | Người đang tìm ý tưởng kiểu tóc phù hợp |
| **Khách tiềm năng** | Người muốn biết giá trước khi quyết định đặt lịch |

---

## 3. Preconditions (Điều kiện tiên quyết)

- Section này nằm sau phần Đội ngũ Barber trên trang chủ.
- Hệ thống phải có ảnh kiểu tóc và thông tin bảng giá để hiển thị.
- Hiển thị với tất cả người dùng, không phân biệt trạng thái đăng nhập.

---

## 4. Main Flow (Luồng chính — Happy Path)

1. Người dùng cuộn xuống đến section Kiểu tóc / Bảng giá.
2. Hệ thống hiển thị section với:
   - **Tiêu đề** liên quan đến kiểu tóc hoặc bảng giá dịch vụ.
   - **Lưới ảnh kiểu tóc**: 3–4 cột, khoảng 12–16 ảnh — mỗi ô là một kiểu tóc nam.
   - Ảnh tone tối, phong cách chuyên nghiệp.
3. Người dùng xem qua các kiểu tóc để tham khảo và tìm ý tưởng.
4. Người dùng nhấn vào một kiểu tóc để xem chi tiết hoặc đặt lịch với kiểu tóc đó.

---

## 5. Alternative Flows (Luồng thay thế)

### 5.1 Người dùng muốn xem thêm kiểu tóc

- Có nút "Xem thêm" hoặc "Xem toàn bộ bảng giá" ở cuối section.
- Nhấn vào điều hướng đến trang Bảng giá đầy đủ.

### 5.2 Người dùng muốn đặt lịch ngay sau khi chọn kiểu tóc

- Nhấn vào ảnh kiểu tóc → hệ thống điều hướng đến trang Đặt lịch, có thể kèm theo thông tin kiểu tóc đã chọn.

---

## 6. Business Rules (Quy tắc nghiệp vụ)

| # | Quy tắc |
|---|---------|
| BR-01 | Hiển thị **12–16 ảnh kiểu tóc** trên trang chủ. |
| BR-02 | Layout dạng **grid 3–4 cột**, ảnh đồng đều về kích thước. |
| BR-03 | Ảnh kiểu tóc phải là **tóc nam thực tế** — tone tối, chuyên nghiệp. |
| BR-04 | Mỗi ảnh phải kèm **tên kiểu tóc** hoặc **mức giá** tương ứng. |
| BR-05 | Phải có đường dẫn đến trang **Bảng giá đầy đủ** từ section này. |

---

## 7. Edge Cases (Tình huống bất thường)

| Tình huống | Hành vi kỳ vọng |
|------------|-----------------|
| Ảnh không tải được | Hiển thị placeholder, tên/giá kiểu tóc vẫn hiển thị |
| Số ảnh ít hơn 12 | Hiển thị đúng số lượng hiện có, layout vẫn cân đối |
| Màn hình mobile | Grid chuyển sang 2 cột, ảnh không bị vỡ hoặc tràn |

---

## 8. Acceptance Criteria (Given / When / Then)

**AC-01**
- **Given:** Người dùng cuộn đến section Kiểu tóc
- **When:** Nhìn vào section
- **Then:** Thấy tiêu đề và lưới ảnh kiểu tóc 3–4 cột với 12–16 ảnh

**AC-02**
- **Given:** Người dùng nhìn vào một ảnh kiểu tóc
- **When:** Quan sát
- **Then:** Thấy tên kiểu tóc hoặc mức giá tương ứng

**AC-03**
- **Given:** Người dùng muốn xem bảng giá đầy đủ
- **When:** Nhấn nút "Xem thêm" / "Xem toàn bộ bảng giá"
- **Then:** Hệ thống điều hướng đến trang Bảng giá

---

## 9. Mapping Business Spec → UI Elements

| Business Requirement | UI Element tương ứng |
|----------------------|-----------------------|
| Tham khảo kiểu tóc | Lưới ảnh 3–4 cột, 12–16 kiểu tóc |
| Thông tin giá dịch vụ | Tên/giá hiển thị trên mỗi ảnh |
| Điều hướng đến bảng giá | Nút "Xem thêm" / "Xem toàn bộ bảng giá" cuối section |
