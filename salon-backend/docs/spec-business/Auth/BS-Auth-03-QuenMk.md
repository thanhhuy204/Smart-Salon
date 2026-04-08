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

Bước 1: Nhập Email xác thực
1. Người dùng nhấn “Quên mật khẩu?” trên trang Đăng nhập.
2. Hệ thống chuyển đến trang “Tìm tài khoản của bạn”.
3. Màn hình yêu cầu: "Hãy nhập email của bạn".
4. Người dùng nhập Email hợp lệ và nhấn nút “Tiếp tục”.
5. Frontend gọi API `POST /api/v1/auth/forgot-password` (kèm email). Backend tự động gửi mã OTP vào email. Giao diện chuyển thẳng sang Bước 2 (Màn hình nhập OTP).

Bước 2: Xác nhận tài khoản (Nhập mã OTP)
6. Hệ thống chuyển đến trang “Xác nhận tài khoản”.
7. Người dùng mở Email lấy OTP 6 số do hệ thống vừa gửi và nhập vào ô “Nhập mã”.
8. Nhấn nút “Tiếp tục”.
9. Frontend gọi API `POST /api/v1/auth/verify-reset-otp` (kèm email + otp). Backend kiểm tra và trả về `resetToken`. Frontend cất (lưu tạm) `resetToken` này đi. Tiép tục chuyển sang Bước 3.

Bước 3: Tạo mật khẩu mới
10. Hệ thống chuyển đến trang “Tạo mật khẩu mới”.
11. Trang hiển thị:
- Tiêu đề: “Tạo mật khẩu mới”
- Hướng dẫn: “Bạn sẽ dùng mật khẩu này để đăng nhập vào tài khoản. Hãy sử dụng tối thiểu 8 ký tự gồm chữ, số và ký tự đặc biệt.”
- Thông tin tài khoản (avatar + tên) (Nếu lấy được từ màn hình trước, hoặc bỏ qua)
- Ô nhập “Mật khẩu mới” (có icon mắt để hiện/ẩn)
12. Người dùng nhập mật khẩu mới.
13. Nhấn nút “Tiếp tục”.
14. Frontend gọi API `POST /api/v1/auth/reset-password` (gửi kèm `resetToken` và `newPassword`). 
15. Hệ thống Backend cập nhật mật khẩu mới thành công. Hiển thị thông báo “Mật khẩu đã được thay đổi thành công!”.
16. Người dùng được chuyển về trang Đăng nhập để đăng nhập bằng mật khẩu mới.

## 5. Alternative Flows

5.1: Nhập Email không tồn tại trong hệ thống → API trả về 400/404, hiển thị thông báo “Không tìm thấy tài khoản với email này”
5.2: Mã OTP sai hoặc hết hạn (quá 15 phút) → API trả về lỗi 400, hiển thị thông báo lỗi và gửi thông điệp yêu cầu “Gửi lại mã”.
5.3: Nhấn nút quay lại hoặc thoát ngang ở bất kỳ bước nào → Hệ thống quay lại trang Đăng nhập.

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

AC-01: Bước 1 – Gửi Email xác thực

Given
Người dùng đang ở trang “Tìm tài khoản của bạn”
When
Nhập email hợp lệ (đã tồn tại trong hệ thống) và bấm "Tiếp tục"
Then
API `forgot-password` thực thi thành công, gửi mã OTP vào email.
Hệ thống chuyển sang trang "Xác nhận tài khoản" (Nhập mã OTP).

AC-02: Bước 2 – Nhập mã OTP hợp lệ

Given
Người dùng đang ở trang “Xác nhận tài khoản”
When
Nhập đúng mã OTP 6 số nhận từ email và nhấn “Tiếp tục”
Then
API `verify-reset-otp` trả về thành công kèm `resetToken`.
Hệ thống chuyển đến trang “Tạo mật khẩu mới”.

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