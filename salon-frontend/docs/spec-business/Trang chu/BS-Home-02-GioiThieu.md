# Business Specification — Trang chủ: Giới thiệu Barbershop

**Module:** Trang chủ
**Phiên bản:** 1.0
**Ngày tạo:** 2026-03-25
**Tác giả:** Business Analyst

---

## 1. Business Goal (Mục tiêu nghiệp vụ)

Giới thiệu ngắn gọn về Salon để người dùng hiểu được:
- Salon là gì, phục vụ ai.
- Điểm khác biệt và giá trị của thương hiệu.
- Kêu gọi hành động đặt lịch ngay sau khi đọc giới thiệu.

---

## 2. Actors (Đối tượng sử dụng)

| Actor | Mô tả |
|-------|-------|
| **Khách vãng lai** | Người chưa biết về Salon, cần thông tin để quyết định |
| **Khách tiềm năng** | Người đang so sánh các tiệm, cần thấy lý do chọn Salon này |

---

## 3. Preconditions (Điều kiện tiên quyết)

- Section này nằm ngay sau Hero Section trên trang chủ.
- Hiển thị với tất cả người dùng, không phân biệt trạng thái đăng nhập.

---

## 4. Main Flow (Luồng chính — Happy Path)

1. Người dùng cuộn xuống sau Hero Section.
2. Hệ thống hiển thị section giới thiệu với:
   - **Tiêu đề lớn**: "BARBERSHOP CHUYÊN NGHIỆP" — nổi bật, font đậm, màu tối.
   - **Đoạn mô tả ngắn**: Giới thiệu về Salon bằng tiếng Việt — phong cách, dịch vụ, cam kết.
   - **Nút "ĐẶT LỊCH"**: Kêu gọi hành động rõ ràng.
3. Người dùng đọc phần giới thiệu.
4. Người dùng nhấn nút **"ĐẶT LỊCH"**.
5. Hệ thống điều hướng người dùng đến trang Đặt lịch.

---

## 5. Alternative Flows (Luồng thay thế)

### 5.1 Người dùng bỏ qua phần giới thiệu

- Người dùng tiếp tục cuộn xuống các section phía dưới.
- Nút "ĐẶT LỊCH" cũng xuất hiện ở các section khác để tiếp tục kêu gọi hành động.

---

## 6. Business Rules (Quy tắc nghiệp vụ)

| # | Quy tắc |
|---|---------|
| BR-01 | Tiêu đề "BARBERSHOP CHUYÊN NGHIỆP" phải **luôn hiển thị** và dễ đọc. |
| BR-02 | Nút "ĐẶT LỊCH" phải **điều hướng đến trang Đặt lịch** (`/booking`). |
| BR-03 | Đoạn mô tả phải **ngắn gọn** — không quá 3–4 câu, đủ để người dùng nắm được giá trị. |
| BR-04 | Background section này **màu trắng/sáng** — tạo tương phản rõ ràng với Hero Section tối. |

---

## 7. Edge Cases (Tình huống bất thường)

| Tình huống | Hành vi kỳ vọng |
|------------|-----------------|
| Người dùng chưa đăng nhập nhấn "ĐẶT LỊCH" | Điều hướng đến trang đặt lịch; nếu cần đăng nhập sẽ yêu cầu tại bước tiếp theo |
| Nội dung mô tả quá dài | Văn bản vẫn hiển thị đầy đủ, layout không bị vỡ |

---

## 8. Acceptance Criteria (Given / When / Then)

**AC-01**
- **Given:** Người dùng cuộn xuống qua Hero Section
- **When:** Nhìn vào section tiếp theo
- **Then:** Thấy tiêu đề "BARBERSHOP CHUYÊN NGHIỆP", đoạn mô tả và nút "ĐẶT LỊCH"

**AC-02**
- **Given:** Người dùng nhấn nút "ĐẶT LỊCH"
- **When:** Nhấn xong
- **Then:** Hệ thống điều hướng đến trang Đặt lịch

**AC-03**
- **Given:** Người dùng đọc đoạn mô tả
- **When:** Đọc xong
- **Then:** Hiểu được Salon làm gì và phục vụ ai trong không quá 30 giây đọc

---

## 9. Mapping Business Spec → UI Elements

| Business Requirement | UI Element tương ứng |
|----------------------|-----------------------|
| Giới thiệu thương hiệu | Tiêu đề lớn + đoạn mô tả ngắn |
| Kêu gọi đặt lịch | Nút "ĐẶT LỊCH" bo tròn, màu tối hoặc outline |
| Tạo tương phản với Hero | Background trắng/sáng |
