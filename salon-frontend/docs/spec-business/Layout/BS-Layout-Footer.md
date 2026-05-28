# Business Specification — Layout: Footer

## 1. Business Goal (Mục tiêu nghiệp vụ)

Cung cấp khu vực cuối trang nhất quán trên toàn bộ ứng dụng, giúp người dùng:
- Kết nối với các kênh mạng xã hội của Salon.
- Tìm thông tin liên hệ nhanh (số điện thoại, địa chỉ).
- Xác nhận thông tin bản quyền của thương hiệu.

---

## 2. Actors (Đối tượng sử dụng)

| Actor | Mô tả |
|-------|-------|
| **Khách vãng lai** | Người dùng chưa đăng nhập, xem thông tin và truy cập mạng xã hội |
| **Người dùng đã đăng nhập (USER)** | Tương tự khách vãng lai đối với Footer |

> Footer không phân biệt trạng thái đăng nhập — hiển thị giống nhau với mọi người dùng.

---

## 3. Preconditions (Điều kiện tiên quyết)

- Footer hiển thị trên **tất cả các trang** của ứng dụng.
- Footer luôn nằm **ở cuối nội dung trang**.

---

## 4. Main Flow (Luồng chính — Happy Path)

1. Người dùng cuộn xuống cuối bất kỳ trang nào.
2. Hệ thống hiển thị footer với:
   - **Tiêu đề "FOLLOW US"** kêu gọi theo dõi mạng xã hội.
   - **4 biểu tượng mạng xã hội**: Facebook, Instagram, TikTok, YouTube — mỗi icon có thể nhấn để mở trang mạng xã hội tương ứng trong tab mới.
   - **Thông tin liên hệ**: số điện thoại, địa chỉ Salon.
   - **Dòng bản quyền** ở vị trí cuối cùng.
3. Người dùng nhấn vào một icon mạng xã hội.
4. Hệ thống mở trang mạng xã hội tương ứng của Salon trong **tab mới**.

---

## 5. Alternative Flows (Luồng thay thế)

### 5.1 Liên kết mạng xã hội chưa được cấu hình

- Icon vẫn hiển thị nhưng không điều hướng, hoặc ẩn icon đó cho đến khi có cấu hình.

---

## 6. Business Rules (Quy tắc nghiệp vụ)

| # | Quy tắc |
|---|---------|
| BR-01 | Footer phải hiển thị ở **tất cả các trang**. |
| BR-02 | Các icon mạng xã hội phải mở đúng trang và **mở trong tab mới**. |
| BR-03 | Footer phải hiển thị **số điện thoại** và **địa chỉ** của Salon. |
| BR-04 | Dòng bản quyền phải cập nhật đúng **năm hiện tại**. |
| BR-05 | Footer có nền **màu tối (đen)**, text màu trắng/xám. |
| BR-06 | Có đủ **4 icon mạng xã hội**: Facebook, Instagram, TikTok, YouTube. |

---

## 7. Edge Cases (Tình huống bất thường)

| Tình huống | Hành vi kỳ vọng |
|------------|-----------------|
| Liên kết mạng xã hội chưa được cấu hình | Icon vẫn hiển thị nhưng không điều hướng, hoặc ẩn icon đó |
| Màn hình rất nhỏ (< 375px) | Footer vẫn hiển thị đầy đủ, không bị tràn nội dung |

---

## 8. Acceptance Criteria (Given / When / Then)

**AC-01**
- **Given:** Người dùng cuộn xuống cuối trang
- **When:** Nhìn vào khu vực footer
- **Then:** Thấy tiêu đề "FOLLOW US", 4 icon mạng xã hội, thông tin liên hệ và dòng bản quyền

**AC-02**
- **Given:** Người dùng nhấn vào icon mạng xã hội bất kỳ trong Footer
- **When:** Nhấn xong
- **Then:** Trang mạng xã hội tương ứng của Salon mở ra trong **tab mới**

**AC-03**
- **Given:** Người dùng đọc thông tin liên hệ trong Footer
- **When:** Đọc xong
- **Then:** Thấy rõ **số điện thoại** và **địa chỉ** của Salon

**AC-04**
- **Given:** Người dùng nhìn vào dòng cuối Footer
- **When:** Đọc xong
- **Then:** Thấy dòng bản quyền với **năm hiện tại** chính xác

---

## 9. Mapping Business Spec → UI Elements

| Business Requirement | UI Element tương ứng |
|----------------------|-----------------------|
| Kết nối mạng xã hội | Tiêu đề "FOLLOW US" + 4 icon social media |
| Thông tin liên hệ | Text số điện thoại + địa chỉ |
| Nhận diện pháp lý | Dòng bản quyền cuối Footer |
