# Business Specification — Layout: Navbar

## 1. Business Goal (Mục tiêu nghiệp vụ)

Cung cấp thanh điều hướng nhất quán xuyên suốt toàn bộ ứng dụng, giúp người dùng:
- Dễ dàng di chuyển giữa các khu vực chính của Salon.
- Nhận diện thương hiệu ngay lập tức khi vào trang.
- Truy cập nhanh vào tài khoản cá nhân (đăng nhập / đăng xuất).

---

## 2. Actors (Đối tượng sử dụng)

| Actor | Mô tả |
|-------|-------|
| **Khách vãng lai** | Người dùng chưa đăng nhập, chỉ có thể xem và điều hướng |
| **Người dùng đã đăng nhập (USER)** | Khách hàng đã có tài khoản, thấy trạng thái đã đăng nhập |
| **Quản trị viên (ADMIN)** | Đăng nhập với quyền quản trị, có thể thấy thêm các mục quản lý |

---

## 3. Preconditions (Điều kiện tiên quyết)

- Navbar hiển thị trên **tất cả các trang** của ứng dụng.
- Navbar luôn **cố định ở đầu trang** (sticky/fixed), không bị cuộn mất khi người dùng scroll xuống.

---

## 4. Main Flow (Luồng chính — Happy Path)

1. Người dùng truy cập bất kỳ trang nào của ứng dụng.
2. Hệ thống hiển thị thanh điều hướng cố định phía trên cùng với:
   - **Logo thương hiệu** ở góc trái — biểu tượng huy hiệu tròn hình ảnh kéo/barber, khi nhấn vào sẽ về trang chủ.
   - **Menu điều hướng** ở giữa gồm 4 mục: *Giới thiệu*, *Đặt lịch*, *Bảng giá*, *Sản phẩm*.
   - **Nút Đăng nhập** ở góc phải.
3. Người dùng nhấn vào một mục trong menu.
4. Hệ thống điều hướng người dùng đến trang tương ứng.
5. Mục menu đang được chọn có trạng thái **active** (nổi bật so với các mục còn lại).

---

## 5. Alternative Flows (Luồng thay thế)

### 5.1 Người dùng đã đăng nhập

- Thay vì hiển thị nút **Đăng nhập**, hệ thống hiển thị **avatar / tên người dùng** hoặc menu tài khoản.
- Người dùng có thể truy cập hồ sơ cá nhân hoặc đăng xuất từ menu này.

### 5.2 Quản trị viên đăng nhập

- Hệ thống có thể hiển thị thêm mục **Quản trị** hoặc đường dẫn tới trang Admin Dashboard.

### 5.3 Màn hình nhỏ / Mobile

- Menu điều hướng thu gọn thành **hamburger menu** (☰).
- Khi nhấn vào, danh sách điều hướng mở ra theo dạng dropdown hoặc drawer.

---

## 6. Business Rules (Quy tắc nghiệp vụ)

| # | Quy tắc |
|---|---------|
| BR-01 | Navbar phải hiển thị ở **tất cả các trang**, kể cả trang lỗi 404. |
| BR-02 | Logo luôn điều hướng về **trang chủ (`/`)**. |
| BR-03 | Menu điều hướng gồm đúng 4 mục: *Giới thiệu*, *Đặt lịch*, *Bảng giá*, *Sản phẩm*. |
| BR-04 | Nút **Đăng nhập** chỉ hiển thị khi người dùng **chưa đăng nhập**. |
| BR-05 | Khi người dùng đã đăng nhập, hệ thống **thay thế** nút Đăng nhập bằng thông tin tài khoản. |
| BR-06 | Navbar có nền **trắng nhẹ**, chiều cao nhỏ gọn. |

---

## 7. Edge Cases (Tình huống bất thường)

| Tình huống | Hành vi kỳ vọng |
|------------|-----------------|
| Người dùng nhấn logo khi đang ở trang chủ | Không có gì thay đổi hoặc trang reload nhẹ, không lỗi |
| Trang đang tải chậm | Navbar vẫn hiển thị đầy đủ ngay lập tức (không phụ thuộc dữ liệu API) |
| Người dùng đăng nhập trên một tab, tab khác vẫn mở | Navbar cập nhật trạng thái đăng nhập khi người dùng tương tác lại |
| Màn hình rất nhỏ (< 375px) | Navbar vẫn hiển thị đầy đủ, không bị tràn nội dung |

---

## 8. Acceptance Criteria (Given / When / Then)

### Điều hướng

**AC-01**
- **Given:** Người dùng ở bất kỳ trang nào trong ứng dụng
- **When:** Trang được tải
- **Then:** Navbar hiển thị cố định ở đầu trang với logo, menu 4 mục và nút Đăng nhập

**AC-02**
- **Given:** Người dùng nhìn vào menu điều hướng
- **When:** Trang hiện tại khớp với một mục trong menu
- **Then:** Mục đó được hiển thị ở trạng thái **active** (khác biệt về màu sắc hoặc gạch chân)

**AC-03**
- **Given:** Người dùng nhấn vào một mục trong menu
- **When:** Nhấn xong
- **Then:** Hệ thống điều hướng đến trang tương ứng với mục đó

**AC-04**
- **Given:** Người dùng nhấn vào Logo
- **When:** Nhấn xong
- **Then:** Hệ thống điều hướng về trang chủ (`/`)

### Trạng thái đăng nhập

**AC-05**
- **Given:** Người dùng **chưa đăng nhập**
- **When:** Nhìn vào góc phải của Navbar
- **Then:** Thấy nút **Đăng nhập**

**AC-06**
- **Given:** Người dùng **đã đăng nhập**
- **When:** Nhìn vào góc phải của Navbar
- **Then:** Không thấy nút Đăng nhập, thay vào đó thấy thông tin tài khoản hoặc avatar

---

## 9. Mapping Business Spec → UI Elements

| Business Requirement | UI Element tương ứng |
|----------------------|-----------------------|
| Nhận diện thương hiệu | Logo huy hiệu tròn góc trái |
| Điều hướng chính | Menu 4 mục ở giữa |
| Truy cập tài khoản | Nút Đăng nhập / Avatar góc phải |
