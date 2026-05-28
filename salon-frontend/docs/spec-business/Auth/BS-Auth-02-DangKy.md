# Business Specification — Đăng ký tài khoản
**Module:** Auth
**Phiên bản:** 1.0
**Ngày tạo:** 2026-03-27
**Tác giả:** Business Analyst

---

## 1. Business Goal

Cho phép người dùng mới tạo tài khoản trên hệ thống bằng email hoặc số điện thoại, nhằm có thể sử dụng các tính năng yêu cầu xác thực như đặt lịch cắt tóc và mua hàng.

---

## 2. Actors

| Actor | Mô tả |
|---|---|
| Khách vãng lai | Người chưa có tài khoản, muốn tạo mới |
| Hệ thống | Kiểm tra dữ liệu, tạo tài khoản và ghi nhận phiên đăng nhập |

---

## 3. Preconditions

- Người dùng chưa đăng nhập vào hệ thống.
- Người dùng chưa có tài khoản với email / số điện thoại định đăng ký.
- Người dùng có thể truy cập trang Đăng ký qua liên kết từ trang Đăng nhập hoặc URL trực tiếp.

---

## 4. Main Flow (Happy Path)

1. Người dùng mở trang Đăng ký.
2. Hệ thống hiển thị form gồm các trường: **Họ tên**, **Email**, **Số điện thoại**, **Mật khẩu**, **Xác nhận mật khẩu**, cùng nút **"Đăng ký"** và liên kết **"Đã có tài khoản? Đăng nhập"**.
3. Người dùng điền đầy đủ thông tin vào tất cả các trường bắt buộc.
4. Người dùng nhấn nút **"Đăng ký"**.
5. Hệ thống kiểm tra định dạng và tính hợp lệ của các trường phía giao diện.
6. Hệ thống kiểm tra email và số điện thoại chưa được đăng ký bởi tài khoản khác.
7. Hệ thống tạo tài khoản mới với vai trò **USER**.
8. Hệ thống tự động đăng nhập người dùng vừa tạo.
9. Hệ thống chuyển hướng người dùng về trang chủ.
10. Thanh điều hướng cập nhật: hiển thị tên và avatar mặc định của người dùng.

---

## 5. Alternative Flows

### 5.1 Email sai định dạng
- **Tại bước 5:** Hệ thống phát hiện email không đúng định dạng.
- Hệ thống hiển thị lỗi ngay dưới trường Email: *"Email không đúng định dạng."*
- Yêu cầu không được gửi lên hệ thống.

### 5.2 Số điện thoại không hợp lệ
- **Tại bước 5:** Số điện thoại không đủ 10 chữ số hoặc chứa ký tự không phải số.
- Hệ thống hiển thị lỗi: *"Số điện thoại không hợp lệ (10 chữ số, bắt đầu bằng 0)."*

### 5.3 Mật khẩu quá ngắn
- **Tại bước 5:** Mật khẩu ít hơn 6 ký tự.
- Hệ thống hiển thị lỗi: *"Mật khẩu phải có ít nhất 6 ký tự."*

### 5.4 Xác nhận mật khẩu không khớp
- **Tại bước 5:** Nội dung trường "Xác nhận mật khẩu" khác trường "Mật khẩu".
- Hệ thống hiển thị lỗi: *"Mật khẩu xác nhận không khớp."*

### 5.5 Email đã tồn tại
- **Tại bước 6:** Email đã được đăng ký bởi tài khoản khác.
- Hệ thống hiển thị thông báo: *"Email này đã được sử dụng. Vui lòng đăng nhập hoặc dùng email khác."*

### 5.6 Số điện thoại đã tồn tại
- **Tại bước 6:** Số điện thoại đã được đăng ký bởi tài khoản khác.
- Hệ thống hiển thị thông báo: *"Số điện thoại này đã được sử dụng. Vui lòng dùng số khác."*

### 5.7 Bỏ trống trường bắt buộc
- **Tại bước 5:** Một hoặc nhiều trường bắt buộc để trống.
- Hệ thống hiển thị lỗi dưới từng trường bỏ trống: *"Trường này không được để trống."*

### 5.8 Nhấn "Đã có tài khoản? Đăng nhập"
- **Tại bất kỳ bước nào:** Người dùng nhấn liên kết đăng nhập.
- Hệ thống chuyển hướng sang trang Đăng nhập.

---

## 6. Business Rules

| Mã | Quy tắc |
|---|---|
| BR-REG-01 | Email phải đúng định dạng chuẩn và chưa được đăng ký trong hệ thống. |
| BR-REG-02 | Số điện thoại phải đủ 10 chữ số, bắt đầu bằng 0, chưa được đăng ký. |
| BR-REG-03 | Mật khẩu phải có tối thiểu 6 ký tự. |
| BR-REG-04 | Trường "Xác nhận mật khẩu" phải khớp chính xác với trường "Mật khẩu". |
| BR-REG-05 | Tài khoản mới luôn được gán vai trò USER — không thể tự đăng ký vai trò ADMIN. |
| BR-REG-06 | Sau đăng ký thành công, hệ thống tự động đăng nhập và chuyển người dùng về trang chủ. |
| BR-REG-07 | Trong khi hệ thống đang xử lý, nút "Đăng ký" phải ở trạng thái disabled để tránh gửi trùng lặp. |

---

## 7. Edge Cases

| Tình huống | Hành vi mong đợi |
|---|---|
| Người dùng đã đăng nhập vào trang /auth/register | Hệ thống tự động chuyển hướng về trang chủ. |
| Email hoặc số điện thoại có khoảng trắng ở đầu/cuối | Hệ thống tự động loại bỏ khoảng trắng trước khi kiểm tra. |
| Người dùng nhấn Enter ở bất kỳ trường nào | Hệ thống xử lý tương đương nhấn nút "Đăng ký". |
| Người dùng nhập tên chỉ có khoảng trắng | Hệ thống coi là trường trống và hiển thị lỗi. |
| Mất kết nối khi đang gửi yêu cầu | Hệ thống hiển thị thông báo: *"Không thể kết nối. Vui lòng kiểm tra mạng và thử lại."* |

---

## 8. Acceptance Criteria (Given/When/Then)

### AC-01: Đăng ký thành công
- **Given:** Người dùng chưa đăng nhập, đang ở trang Đăng ký.
- **When:** Người dùng điền đầy đủ thông tin hợp lệ và nhấn "Đăng ký".
- **Then:** Hệ thống tạo tài khoản, tự động đăng nhập, chuyển hướng về trang chủ, thanh điều hướng hiển thị tên người dùng.

### AC-02: Lỗi khi email đã tồn tại
- **Given:** Email "test@gmail.com" đã được đăng ký.
- **When:** Người dùng mới nhập đúng email đó và nhấn "Đăng ký".
- **Then:** Hệ thống hiển thị thông báo "Email này đã được sử dụng.", không tạo tài khoản mới.

### AC-03: Lỗi khi mật khẩu xác nhận không khớp
- **Given:** Người dùng đang ở trang Đăng ký.
- **When:** Người dùng nhập Mật khẩu "abc123" và Xác nhận mật khẩu "abc456", nhấn "Đăng ký".
- **Then:** Hệ thống hiển thị lỗi "Mật khẩu xác nhận không khớp." dưới trường xác nhận.

### AC-04: Lỗi khi bỏ trống trường bắt buộc
- **Given:** Người dùng đang ở trang Đăng ký.
- **When:** Người dùng để trống trường Họ tên và nhấn "Đăng ký".
- **Then:** Hệ thống hiển thị lỗi "Trường này không được để trống." ngay dưới trường Họ tên.

### AC-05: Trạng thái loading khi đang xử lý
- **Given:** Người dùng điền đầy đủ thông tin hợp lệ.
- **When:** Người dùng nhấn "Đăng ký" và hệ thống đang xử lý.
- **Then:** Nút "Đăng ký" hiển thị spinner và không thể nhấn thêm.

### AC-06: Người dùng đã đăng nhập không thấy trang đăng ký
- **Given:** Người dùng đã đăng nhập.
- **When:** Người dùng truy cập URL /auth/register.
- **Then:** Hệ thống tự động chuyển hướng về trang chủ.

---

## 9. Mapping Business Spec → UI Elements

| Phần nghiệp vụ | Thành phần giao diện |
|---|---|
| Nhập họ tên | Input field, label "Họ và tên", placeholder "Nguyễn Văn A" |
| Nhập email | Input field, label "Email", placeholder "example@email.com", kiểu email |
| Nhập số điện thoại | Input field, label "Số điện thoại", placeholder "0912345678", kiểu tel |
| Nhập mật khẩu | Input field, label "Mật khẩu", kiểu password, nút toggle hiện/ẩn |
| Xác nhận mật khẩu | Input field, label "Xác nhận mật khẩu", kiểu password, nút toggle hiện/ẩn |
| Gửi yêu cầu | Nút "Đăng ký" — CTA chính, full width, disabled khi đang xử lý |
| Thông báo lỗi trường | Text màu đỏ hiển thị ngay dưới trường bị lỗi |
| Chuyển sang đăng nhập | Link "Đã có tài khoản? Đăng nhập" phía dưới nút đăng ký |
