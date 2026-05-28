# Business Specification — Trang chủ: Hero Section (Banner chính)

**Module:** Trang chủ
**Phiên bản:** 1.0
**Ngày tạo:** 2026-03-25
**Tác giả:** Business Analyst

---

## 1. Business Goal (Mục tiêu nghiệp vụ)

Tạo ấn tượng đầu tiên mạnh mẽ với người dùng ngay khi vào trang chủ:
- Truyền tải hình ảnh thương hiệu chuyên nghiệp, ấm áp của Salon.
- Thu hút sự chú ý ngay lập tức bằng visual nổi bật toàn màn hình.
- Gợi cảm giác tin tưởng thông qua hình ảnh thực tế của tiệm và đội ngũ.

---

## 2. Actors (Đối tượng sử dụng)

| Actor | Mô tả |
|-------|-------|
| **Khách vãng lai** | Người dùng lần đầu ghé thăm, cần được thu hút và tạo ấn tượng |
| **Khách quay lại** | Người dùng đã biết thương hiệu, xác nhận đúng trang |

---

## 3. Preconditions (Điều kiện tiên quyết)

- Người dùng truy cập vào trang chủ (`/`).
- Hero Section là phần đầu tiên hiển thị, ngay bên dưới Navbar.

---

## 4. Main Flow (Luồng chính — Happy Path)

1. Người dùng mở trang chủ.
2. Hệ thống hiển thị ngay lập tức một banner toàn chiều rộng màn hình với:
   - **Ảnh nền** chụp thực tế tại tiệm — nhóm thợ và khách hàng, tone màu tối ấm.
   - **Slogan thương hiệu** hiển thị đè lên ảnh — dòng chữ lớn, nổi bật, font phong cách (serif/display), màu trắng hoặc vàng.
3. Người dùng nhìn thấy toàn bộ banner mà không cần cuộn trang.

---

## 5. Alternative Flows (Luồng thay thế)

### 5.1 Ảnh nền chưa tải xong

- Hệ thống hiển thị màu nền tối thay thế trong khi ảnh đang tải.
- Slogan vẫn hiển thị đầy đủ.

---

## 6. Business Rules (Quy tắc nghiệp vụ)

| # | Quy tắc |
|---|---------|
| BR-01 | Hero Section phải chiếm **toàn bộ chiều rộng** màn hình (full-width). |
| BR-02 | Slogan phải **luôn hiển thị rõ ràng**, không bị che khuất bởi ảnh nền. |
| BR-03 | Ảnh nền phải thể hiện **không gian thực tế của tiệm** — có người, có bầu không khí. |
| BR-04 | Tone màu ảnh phải **tối ấm** — phù hợp thương hiệu barber chuyên nghiệp. |

---

## 7. Edge Cases (Tình huống bất thường)

| Tình huống | Hành vi kỳ vọng |
|------------|-----------------|
| Ảnh nền không tải được | Hiển thị màu nền tối thay thế, slogan vẫn hiển thị đầy đủ |
| Màn hình rất nhỏ (mobile) | Ảnh crop vừa khung, slogan không bị tràn hoặc che khuất |
| Màn hình rất rộng (4K) | Ảnh scale đẹp, không bị vỡ hoặc lặp lại |

---

## 8. Acceptance Criteria (Given / When / Then)

**AC-01**
- **Given:** Người dùng mở trang chủ
- **When:** Trang được tải
- **Then:** Banner toàn chiều rộng hiển thị ngay lập tức với ảnh nền thực tế của tiệm

**AC-02**
- **Given:** Banner đã hiển thị
- **When:** Người dùng nhìn vào màn hình
- **Then:** Slogan thương hiệu hiển thị rõ ràng, dễ đọc, đè lên ảnh nền

**AC-03**
- **Given:** Ảnh nền không tải được
- **When:** Trang được tải
- **Then:** Khu vực banner vẫn hiển thị với màu nền tối và slogan đầy đủ

---

## 9. Mapping Business Spec → UI Elements

| Business Requirement | UI Element tương ứng |
|----------------------|-----------------------|
| Ấn tượng thương hiệu đầu tiên | Banner full-width, ảnh thực tế tiệm |
| Nhận diện thương hiệu | Slogan lớn, font display, màu trắng/vàng đè lên ảnh |
| Bầu không khí chuyên nghiệp | Tone màu tối ấm trên toàn banner |
