Feature: Quên mật khẩu (Forgot Password)

## 1. Business Goal

Cho phép người dùng khôi phục quyền truy cập vào tài khoản khi quên mật khẩu một cách an toàn, rõ ràng và dễ sử dụng.
Quy trình gồm 4 bước giúp người dùng tìm lại tài khoản, xác thực danh tính và thiết lập mật khẩu mới, giảm tỷ lệ người dùng bị khóa ngoài và nâng cao trải nghiệm.
## 2. Actors


User

## 3. Preconditions


Người dùng đang ở trang Đăng nhập
Người dùng có tài khoản đã đăng ký với số điện thoại hoặc email hợp lệ

## 4. Main Flow

Bước 1: Tìm tài khoản

Người dùng nhấn “Quên mật khẩu?” trên trang Đăng nhập.
Hệ thống chuyển đến trang “Tìm tài khoản của bạn”.
Hãy nhập số điện thoại hoặc email của bạn.
Người dùng nhập Số điện thoại hoặc email.
Nhấn nút “Tiếp tục”.

Bước 2: Chọn phương thức đăng nhập

5. Hệ thống hiển thị trang “Chọn phương thức đăng nhập”, hiển thị thông tin tài khoản (avatar + tên).
6. Người dùng chọn một phương thức:

Nhận mã qua email
Nhận mã qua SMS
Tiếp tục bằng mật khẩu


Nhấn nút “Tiếp tục”.

Bước 3: Xác nhận tài khoản (Nhập mã OTP)
8. Hệ thống gửi mã OTP đến phương thức đã chọn.
9. Hệ thống chuyển đến trang “Xác nhận tài khoản”.
10. Người dùng nhập mã OTP vào ô “Nhập mã”.
11. Nhấn nút “Tiếp tục”.
Bước 4: Tạo mật khẩu mới
12. Hệ thống chuyển đến trang “Tạo mật khẩu mới”.
13. Trang hiển thị:
- Tiêu đề: “Tạo mật khẩu mới”
- Hướng dẫn: “Bạn sẽ dùng mật khẩu này để đăng nhập vào tài khoản. Hãy sử dụng tối thiểu 8 ký tự gồm chữ, số và ký tự đặc biệt.”
- Thông tin tài khoản (avatar + tên)
- Ô nhập “Mật khẩu mới” (có icon mắt để hiện/ẩn)
14. Người dùng nhập mật khẩu mới.
15. Người dùng nhấn nút “Tiếp tục”.
16. Hệ thống cập nhật mật khẩu mới thành công và thông báo “Mật khẩu đã được thay đổi thành công!”.
17. Người dùng được chuyển về trang Đăng nhập để đăng nhập bằng mật khẩu mới.

## 5. Alternative Flows


5.1: Không tìm thấy tài khoản → hiển thị thông báo “Không tìm thấy tài khoản với thông tin này”
5.2: Chọn “Tiếp tục bằng mật khẩu” → chuyển thẳng về trang Đăng nhập
5.3: Mã OTP sai hoặc hết hạn → hiển thị lỗi và nút “Gửi lại mã”
5.4: Người dùng nhấn “Bỏ qua” → hệ thống hỏi xác nhận hoặc quay về trang Đăng nhập

## 6. Business Rules


Người dùng phải nhập đúng số điện thoại hoặc email đã đăng ký để tìm tài khoản
Phải có ít nhất một phương thức nhận mã (email hoặc SMS)
Mã OTP có thời hạn sử dụng từ 8-10 phút
Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm chữ cái, số và ký tự đặc biệt
Sau khi tạo mật khẩu mới thành công, người dùng phải đăng nhập lại

## 7. Edge Cases


Người dùng nhập sai email/số điện thoại nhiều lần
Người dùng không nhận được mã OTP
Người dùng muốn thay đổi phương thức nhận mã giữa chừng
Màn hình mobile – các ô nhập và nút phải dễ chạm
Người dùng tick/uncheck checkbox “Đăng xuất ở mọi nơi khác” ở bước tạo mật khẩu mới

## 8. Acceptance Criteria

AC-01: Bước 1 – Tìm tài khoản

Given

Người dùng đang ở trang Đăng nhập
When
Nhấn “Quên mật khẩu?” và nhập email/số điện thoại hợp lệ
Then
Chuyển đến trang “Tìm tài khoản của bạn”
Nhấn “Tiếp tục” → chuyển sang bước chọn phương thức

AC-02: Bước 2 – Chọn phương thức

Given

Người dùng đã tìm thấy tài khoản
When
Chọn phương thức và nhấn “Tiếp tục”
Then
Hệ thống gửi mã OTP và chuyển đến trang “Xác nhận tài khoản”

AC-03: Bước 3 – Nhập mã OTP

Given

Người dùng đang ở trang “Xác nhận tài khoản”
When
Nhập đúng mã OTP và nhấn “Tiếp tục”
Then
Chuyển đến trang “Tạo mật khẩu mới”

AC-04: Bước 4 – Tạo mật khẩu mới

Given

Người dùng đang ở trang “Tạo mật khẩu mới”
When
Nhập mật khẩu mới (ít nhất 8 ký tự, có chữ cái, số và ký tự đặc biệt) và nhấn “Tiếp tục”
Then
Hiển thị thông báo “Mật khẩu đã được thay đổi thành công!”
Chuyển về trang Đăng nhập

AC-05: Giao diện thân thiện trên mobile

Given

Người dùng thực hiện toàn bộ quy trình trên điện thoại
When
Xem các trang
Then
Tiêu đề, hướng dẫn, ô nhập và nút hiển thị rõ ràng, dễ chạm