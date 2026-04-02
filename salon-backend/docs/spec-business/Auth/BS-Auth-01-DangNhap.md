# Business Specification — Đăng nhập
**Module:** Auth
**Phiên bản:** 1.0
**Ngày tạo:** 2026-03-25
**Tác giả:** Business Analyst

---

## 1. Business Goal

Cho phép người dùng đã có tài khoản xác thực danh tính và truy cập vào hệ thống để sử dụng các tính năng yêu cầu đăng nhập như đặt lịch, mua hàng, xem lịch sử.

---

## 2. Actors

| Actor | Mô tả |
|---|---|
| Khách vãng lai | Người chưa đăng nhập, có thể đã có tài khoản hoặc chưa |
| Hệ thống | Xác thực thông tin và cấp quyền truy cập |

---

## 3. Preconditions

- Người dùng chưa đăng nhập vào hệ thống.
- Người dùng đã có tài khoản được đăng ký trên hệ thống.
- Người dùng có thể truy cập trang đăng nhập qua URL trực tiếp hoặc được điều hướng tự động khi cố gắng truy cập tính năng yêu cầu đăng nhập.

---

## 4. Main Flow (Happy Path)

1. Người dùng mở trang Đăng nhập.
2. Hệ thống hiển thị form gồm hai trường: **Email** và **Mật khẩu**, cùng với:
   - Nút **"Đăng nhập"**
   - Liên kết **"Quên mật khẩu?"**
   - Liên kết **"Chưa có tài khoản? Đăng ký"**
3. Người dùng nhập địa chỉ email hợp lệ vào trường Email.
4. Người dùng nhập mật khẩu vào trường Mật khẩu (ký tự được ẩn bằng dấu chấm/sao).
5. Người dùng nhấn nút **"Đăng nhập"**.
6. Hệ thống kiểm tra định dạng email và độ dài mật khẩu phía giao diện.
7. Hệ thống xác thực thông tin đăng nhập.
8. Thông tin đúng: hệ thống ghi nhận phiên đăng nhập của người dùng.
9. Hệ thống tự động chuyển hướng người dùng về:
   - Trang người dùng định truy cập trước đó (nếu bị chặn do chưa đăng nhập), hoặc
   - Trang chủ (nếu vào thẳng trang đăng nhập).
10. Giao diện cập nhật: hiển thị thông tin người dùng (tên, avatar) trên thanh điều hướng.

---

## 5. Alternative Flows

### 5.1 Email sai định dạng
- **Tại bước 6:** Hệ thống phát hiện email không đúng định dạng (thiếu @, thiếu domain, v.v.).
- Hệ thống hiển thị thông báo lỗi ngay dưới trường Email: *"Email không đúng định dạng."*
- Người dùng chưa được gửi yêu cầu xác thực lên hệ thống.
- Người dùng sửa lại email và thử lại.

### 5.2 Mật khẩu quá ngắn
- **Tại bước 6:** Hệ thống phát hiện mật khẩu ít hơn 6 ký tự.
- Hệ thống hiển thị thông báo lỗi ngay dưới trường Mật khẩu: *"Mật khẩu phải có ít nhất 6 ký tự."*
- Người dùng chưa được gửi yêu cầu xác thực lên hệ thống.

### 5.3 Tài khoản không tồn tại
- **Tại bước 7:** Hệ thống không tìm thấy tài khoản với email đã nhập.
- Hệ thống hiển thị thông báo lỗi chung: *"Email hoặc mật khẩu không chính xác."*
- Không tiết lộ cụ thể email có tồn tại hay không (bảo mật).
- Người dùng có thể thử lại hoặc nhấn "Chưa có tài khoản? Đăng ký".

### 5.4 Mật khẩu sai
- **Tại bước 7:** Hệ thống tìm thấy tài khoản nhưng mật khẩu không khớp.
- Hệ thống hiển thị thông báo lỗi chung: *"Email hoặc mật khẩu không chính xác."*
- Người dùng có thể thử lại hoặc nhấn "Quên mật khẩu?".

### 5.5 Tài khoản bị khóa
- **Tại bước 7:** Hệ thống xác định tài khoản đang ở trạng thái bị khóa (banned).
- Hệ thống hiển thị thông báo: *"Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ."*
- Người dùng không được phép đăng nhập.

### 5.6 Mạng chậm hoặc lỗi kết nối
- **Tại bước 7:** Hệ thống không nhận được phản hồi trong thời gian chờ.
- Nút "Đăng nhập" hiển thị trạng thái đang xử lý (loading spinner) trong lúc chờ.
- Nếu quá thời gian chờ: hệ thống hiển thị thông báo: *"Không thể kết nối. Vui lòng kiểm tra mạng và thử lại."*
- Người dùng có thể nhấn lại nút "Đăng nhập" để thử lại.

### 5.7 Nhấn "Quên mật khẩu?"
- **Tại bước 2:** Người dùng nhấn liên kết "Quên mật khẩu?".
- Hệ thống hiển thị thông báo: *"Tính năng này đang được phát triển."* (placeholder, chưa triển khai).

### 5.8 Nhấn "Chưa có tài khoản? Đăng ký"
- **Tại bất kỳ bước nào:** Người dùng nhấn liên kết đăng ký.
- Hệ thống chuyển hướng sang trang Đăng ký.

---

## 6. Business Rules

| Mã | Quy tắc |
|---|---|
| BR-AUTH-01 | Email phải đúng định dạng chuẩn (có ký tự @, có domain hợp lệ). |
| BR-AUTH-02 | Mật khẩu phải có tối thiểu 6 ký tự. |
| BR-AUTH-03 | Khi thông tin đăng nhập sai, hệ thống chỉ hiển thị thông báo chung, không tiết lộ email có tồn tại hay không. |
| BR-AUTH-04 | Tài khoản bị khóa (banned) không được phép đăng nhập dù thông tin đúng. |
| BR-AUTH-05 | Sau đăng nhập thành công, người dùng được điều hướng về trang họ định truy cập hoặc trang chủ. |
| BR-AUTH-06 | Trong khi hệ thống đang xử lý đăng nhập, nút "Đăng nhập" phải ở trạng thái disabled để tránh gửi nhiều yêu cầu trùng lặp. |
| BR-AUTH-07 | Liên kết "Quên mật khẩu?" là placeholder — hiển thị thông báo chưa triển khai, không điều hướng. |

---

## 7. Edge Cases

| Tình huống | Hành vi mong đợi |
|---|---|
| Người dùng đã đăng nhập nhưng vào lại trang /auth/login | Hệ thống tự động chuyển hướng về trang chủ, không hiển thị form đăng nhập. |
| Người dùng nhập email có khoảng trắng ở đầu/cuối | Hệ thống tự động loại bỏ khoảng trắng trước khi xử lý. |
| Người dùng nhấn Enter thay vì nhấn nút "Đăng nhập" | Hệ thống xử lý tương đương nhấn nút "Đăng nhập". |
| Cả hai trường đều để trống khi nhấn "Đăng nhập" | Hệ thống hiển thị lỗi cho cả hai trường trước khi gửi yêu cầu. |
| Người dùng copy-paste mật khẩu có ký tự đặc biệt | Hệ thống chấp nhận mọi ký tự hợp lệ trong mật khẩu. |
| Phiên đăng nhập hết hạn trong khi đang dùng | Hệ thống chuyển hướng về trang đăng nhập với thông báo: *"Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại."* |

---

## 8. Acceptance Criteria (Given/When/Then)

### AC-01: Đăng nhập thành công với thông tin hợp lệ
- **Given:** Người dùng chưa đăng nhập và đang ở trang Đăng nhập.
- **When:** Người dùng nhập email và mật khẩu đúng, nhấn "Đăng nhập".
- **Then:** Hệ thống chuyển hướng người dùng về trang chủ (hoặc trang trước đó), thanh điều hướng hiển thị tên và avatar của người dùng.

### AC-02: Thông báo lỗi khi email sai định dạng
- **Given:** Người dùng đang ở trang Đăng nhập.
- **When:** Người dùng nhập "abc" vào trường Email và nhấn "Đăng nhập".
- **Then:** Hệ thống hiển thị thông báo lỗi "Email không đúng định dạng." ngay dưới trường Email, không gửi yêu cầu xác thực.

### AC-03: Thông báo lỗi khi mật khẩu quá ngắn
- **Given:** Người dùng đang ở trang Đăng nhập.
- **When:** Người dùng nhập email hợp lệ và mật khẩu "abc" (3 ký tự), nhấn "Đăng nhập".
- **Then:** Hệ thống hiển thị thông báo lỗi "Mật khẩu phải có ít nhất 6 ký tự." ngay dưới trường Mật khẩu.

### AC-04: Thông báo lỗi chung khi thông tin sai
- **Given:** Người dùng đang ở trang Đăng nhập.
- **When:** Người dùng nhập email tồn tại nhưng mật khẩu sai, nhấn "Đăng nhập".
- **Then:** Hệ thống hiển thị thông báo "Email hoặc mật khẩu không chính xác.", người dùng vẫn ở trang đăng nhập, form không bị xóa trắng.

### AC-05: Trạng thái loading trong khi xử lý
- **Given:** Người dùng đã điền đúng thông tin và nhấn "Đăng nhập".
- **When:** Hệ thống đang xử lý yêu cầu.
- **Then:** Nút "Đăng nhập" hiển thị spinner và không thể nhấn thêm lần nữa.

### AC-06: Tài khoản bị khóa không đăng nhập được
- **Given:** Người dùng có tài khoản đang ở trạng thái bị khóa.
- **When:** Người dùng nhập đúng email và mật khẩu, nhấn "Đăng nhập".
- **Then:** Hệ thống hiển thị thông báo "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ.", người dùng không được phép vào hệ thống.

### AC-07: Chuyển hướng đúng sau đăng nhập
- **Given:** Người dùng bị chuyển về trang đăng nhập khi cố truy cập trang /booking.
- **When:** Người dùng đăng nhập thành công.
- **Then:** Hệ thống chuyển hướng người dùng về trang /booking (không phải trang chủ).

### AC-08: Người dùng đã đăng nhập không thấy trang đăng nhập
- **Given:** Người dùng đã đăng nhập.
- **When:** Người dùng truy cập URL /auth/login.
- **Then:** Hệ thống tự động chuyển hướng về trang chủ.

---

## 9. Mapping Business Spec → UI Elements

| Phần nghiệp vụ | Thành phần giao diện |
|---|---|
| Nhập email | Input field có label "Email", placeholder "example@email.com", kiểu text/email |
| Nhập mật khẩu | Input field có label "Mật khẩu", placeholder "••••••", kiểu password, nút toggle hiện/ẩn mật khẩu |
| Xác nhận danh tính | Nút "Đăng nhập" — CTA chính, nổi bật, chiếm toàn bộ chiều rộng form |
| Trạng thái xử lý | Nút "Đăng nhập" chuyển sang disabled + hiển thị spinner khi đang gửi yêu cầu |
| Thông báo lỗi trường | Text màu đỏ hiển thị ngay dưới trường bị lỗi |
| Thông báo lỗi hệ thống | Alert/toast màu đỏ hiển thị phía trên form hoặc dưới nút đăng nhập |
| Quên mật khẩu | Link text nhỏ, căn phải, phía trên nút đăng nhập |
| Chuyển sang đăng ký | Link text "Chưa có tài khoản? Đăng ký" phía dưới nút đăng nhập |
| Ghi nhớ đăng nhập | Checkbox "Ghi nhớ đăng nhập" (nếu triển khai) bên trái liên kết "Quên mật khẩu?" |
