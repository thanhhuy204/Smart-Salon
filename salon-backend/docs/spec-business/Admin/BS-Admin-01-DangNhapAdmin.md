# Business Specification — Đăng nhập Admin Dashboard
**Module:** Admin
**Phiên bản:** 1.0
**Ngày tạo:** 2026-03-27
**Tác giả:** Business Analyst

---

## 1. Business Goal

Cho phép quản trị viên (Admin) xác thực danh tính và truy cập vào khu vực quản trị hệ thống (Admin Dashboard) để thực hiện các nghiệp vụ quản lý như duyệt lịch hẹn, quản lý sản phẩm, xử lý đơn hàng và xem báo cáo doanh thu.

---

## 2. Actors

| Actor | Mô tả |
|---|---|
| Quản trị viên (Admin) | Người được cấp quyền ADMIN trong hệ thống |
| Hệ thống | Xác thực vai trò và cấp quyền truy cập khu vực quản trị |

---

## 3. Preconditions

- Người dùng chưa đăng nhập vào hệ thống, hoặc đang đăng nhập với tài khoản không có quyền ADMIN.
- Tài khoản Admin đã được tạo sẵn bởi hệ thống (không đăng ký bằng form công khai).
- Người dùng cố truy cập đường dẫn /admin hoặc một trang con trong khu vực quản trị.

---

## 4. Main Flow (Happy Path)

1. Quản trị viên truy cập URL `/admin` hoặc bất kỳ trang con nào trong khu vực quản trị.
2. Hệ thống kiểm tra: người dùng chưa đăng nhập → chuyển hướng về trang Đăng nhập tại `/auth/login`.
3. Quản trị viên nhập **Email** và **Mật khẩu** của tài khoản Admin.
4. Quản trị viên nhấn **"Đăng nhập"**.
5. Hệ thống xác thực thông tin đăng nhập.
6. Hệ thống kiểm tra tài khoản có vai trò **ADMIN**.
7. Xác thực thành công: hệ thống ghi nhận phiên và chuyển hướng về trang `/admin` (Admin Dashboard).
8. Giao diện Admin Dashboard hiển thị: tổng quan thống kê, menu quản trị đầy đủ.

---

## 5. Alternative Flows

### 5.1 Đăng nhập thành công nhưng không có quyền ADMIN
- **Tại bước 6:** Tài khoản hợp lệ nhưng chỉ có vai trò USER.
- Hệ thống hiển thị thông báo: *"Bạn không có quyền truy cập khu vực quản trị."*
- Người dùng được giữ ở trang đăng nhập hoặc chuyển về trang chủ của USER.

### 5.2 Email hoặc mật khẩu sai
- **Tại bước 5:** Thông tin không khớp với tài khoản nào.
- Hệ thống hiển thị thông báo: *"Email hoặc mật khẩu không chính xác."*
- Không tiết lộ tài khoản Admin có tồn tại hay không.

### 5.3 Tài khoản Admin bị khóa
- **Tại bước 6:** Tài khoản Admin đang ở trạng thái bị vô hiệu hóa.
- Hệ thống hiển thị thông báo: *"Tài khoản đã bị khóa. Vui lòng liên hệ quản trị cấp cao."*

### 5.4 Admin đã đăng nhập truy cập lại trang /auth/login
- **Tại bước 2:** Quản trị viên đã có phiên ADMIN hợp lệ.
- Hệ thống tự động chuyển hướng về `/admin` mà không hiển thị form đăng nhập.

### 5.5 USER đăng nhập cố truy cập /admin
- **Tại bất kỳ lúc nào:** Người dùng có vai trò USER cố truy cập bất kỳ trang `/admin/**`.
- Hệ thống hiển thị trang lỗi **403 - Không có quyền truy cập** hoặc chuyển hướng về trang chủ.

---

## 6. Business Rules

| Mã | Quy tắc |
|---|---|
| BR-ADMIN-01 | Chỉ tài khoản có vai trò ADMIN mới được phép truy cập khu vực /admin. |
| BR-ADMIN-02 | Tài khoản Admin không được tạo thông qua form đăng ký công khai — chỉ do hệ thống cấp. |
| BR-ADMIN-03 | Khi thông tin đăng nhập sai, thông báo lỗi phải chung chung, không tiết lộ email Admin có tồn tại hay không. |
| BR-ADMIN-04 | Phiên Admin có thời gian hiệu lực — hết hạn phải đăng nhập lại. |
| BR-ADMIN-05 | Người dùng đã đăng nhập với vai trò ADMIN truy cập /auth/login sẽ được tự động chuyển về /admin. |
| BR-ADMIN-06 | Mọi trang trong /admin phải được bảo vệ — không truy cập được khi chưa xác thực vai trò ADMIN. |

---

## 7. Edge Cases

| Tình huống | Hành vi mong đợi |
|---|---|
| Admin mở nhiều tab, phiên hết hạn ở một tab | Tất cả tab chuyển hướng về đăng nhập khi thực hiện tác vụ tiếp theo. |
| Admin nhấn nút Back sau khi đăng xuất | Hệ thống phát hiện phiên không còn hợp lệ và chuyển về trang đăng nhập. |
| URL trực tiếp đến trang con như /admin/appointments | Hệ thống kiểm tra xác thực trước, sau đó chuyển đến đúng trang nếu hợp lệ. |
| Đăng nhập đồng thời từ hai thiết bị khác nhau | Hệ thống cho phép (không giới hạn phiên đơn) — cả hai phiên đều hợp lệ. |

---

## 8. Acceptance Criteria (Given/When/Then)

### AC-01: Admin đăng nhập thành công
- **Given:** Quản trị viên có tài khoản ADMIN hợp lệ, đang ở trang Đăng nhập.
- **When:** Admin nhập đúng email và mật khẩu, nhấn "Đăng nhập".
- **Then:** Hệ thống chuyển hướng về trang /admin, hiển thị Admin Dashboard với menu quản trị đầy đủ.

### AC-02: USER không vào được khu vực Admin
- **Given:** Người dùng đang đăng nhập với vai trò USER.
- **When:** Người dùng truy cập URL /admin.
- **Then:** Hệ thống hiển thị thông báo lỗi 403 hoặc chuyển hướng về trang chủ USER.

### AC-03: Chưa đăng nhập bị chặn tại /admin
- **Given:** Người dùng chưa đăng nhập.
- **When:** Người dùng truy cập URL /admin/dashboard.
- **Then:** Hệ thống chuyển hướng về /auth/login.

### AC-04: Admin đã đăng nhập không thấy trang đăng nhập
- **Given:** Admin đang có phiên đăng nhập hợp lệ.
- **When:** Admin truy cập /auth/login.
- **Then:** Hệ thống tự động chuyển hướng về /admin.

### AC-05: Thông báo lỗi khi không có quyền Admin
- **Given:** Người dùng với vai trò USER đăng nhập thành công.
- **When:** Hệ thống kiểm tra vai trò sau đăng nhập khi người dùng cố vào /admin.
- **Then:** Hệ thống hiển thị thông báo "Bạn không có quyền truy cập khu vực quản trị.", không mở Admin Dashboard.

### AC-06: Phiên Admin hết hạn
- **Given:** Admin đang làm việc trên Dashboard, phiên hết hạn.
- **When:** Admin thực hiện bất kỳ tác vụ nào cần xác thực.
- **Then:** Hệ thống chuyển hướng về trang đăng nhập với thông báo: *"Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại."*

---

## 9. Mapping Business Spec → UI Elements

| Phần nghiệp vụ | Thành phần giao diện |
|---|---|
| Form đăng nhập Admin | Cùng form với đăng nhập USER tại /auth/login (không có trang login riêng) |
| Phân biệt Admin Dashboard | Layout riêng với sidebar menu quản trị, header khác với giao diện người dùng |
| Menu quản trị | Sidebar với các mục: Tổng quan, Lịch hẹn, Nhân viên, Dịch vụ, Sản phẩm, Đơn hàng, Báo cáo |
| Bảo vệ route Admin | AdminGuard — hiển thị trang 403 hoặc redirect nếu không đủ quyền |
| Thông báo hết hạn phiên | Toast/alert ở góc màn hình trước khi redirect về đăng nhập |
