Tổng quan nghiệp vụ hệ thống Salon
Mô tả: Hệ thống quản lý đặt lịch cắt tóc và bán hàng trực tuyến cho Salon tóc

1. Xác thực & Tài khoản
1.1 Người dùng (User)
Đăng ký tài khoản bằng email / số điện thoại
Đăng nhập / Đăng xuất
Quên mật khẩu (nhập email → nhận link reset → đặt mật khẩu mới)
Đổi mật khẩu (khi đã đăng nhập)
Cập nhật thông tin cá nhân (tên, ảnh đại diện, số điện thoại)
Xem lịch sử hoạt động (lịch đặt, đơn hàng)
1.2 Quản trị viên (Admin)
Đăng nhập vào trang quản trị (Admin Dashboard)

2. Nghiệp vụ đặt lịch cắt tóc
2.1 Người dùng
Đặt lịch (luồng 4 bước):
1.Xem danh sách dịch vụ theo danh mục và chọn gói dịch vụ (cắt, uốn, nhuộm,...)
2.Xem thông tin thợ (tên, ảnh, chuyên môn, đánh giá trung bình) và chọn thợ hoặc "bất kỳ thợ nào"
3.Chọn ngày và khung giờ còn trống
4.Xác nhận đặt lịch và nhận thông báo
Quản lý lịch của mình:
Xem danh sách lịch đã đặt (sắp tới / đã hoàn thành / đã hủy)
Xem chi tiết lịch hẹn (dịch vụ, thợ, giờ, địa chỉ salon)
Hủy lịch (chỉ được hủy khi trạng thái còn PENDING)
Đánh giá thợ sau khi lịch hoàn thành (1–5 sao + bình luận)
2.2 Quản trị viên
Quản lý lịch hẹn:
Xem toàn bộ lịch hẹn theo ngày / tuần / tháng (dạng lịch hoặc danh sách)
Duyệt xác nhận hoặc từ chối lịch hẹn (kèm lý do)
Hủy lịch hẹn của khách (kèm lý do, gửi thông báo cho khách)
Đánh dấu lịch hẹn đang thực hiện / hoàn thành
Gán thợ cho lịch có staff_id = NULL (lịch "bất kỳ thợ nào") khi duyệt
Quản lý nhân viên / Thợ:
Thêm / sửa / xóa / kích hoạt hồ sơ thợ (tên, ảnh, chuyên môn, mô tả)
Khóa khung giờ khi thợ nghỉ phép hoặc bận đột xuất
Xem hiệu suất thợ: số lịch hoàn thành, đánh giá trung bình
Quản lý dịch vụ:
Thêm / sửa / xóa gói dịch vụ
Thiết lập tên, mô tả, giá tiền, thời gian thực hiện cho mỗi dịch vụ
Bật / tắt hiển thị dịch vụ (tạm ngừng mà không cần xóa)
Phân loại dịch vụ theo danh mục (cắt, uốn, nhuộm, chăm sóc,...)

3. Nghiệp vụ bán hàng
3.1 Người dùng
Duyệt & tìm kiếm sản phẩm:
Xem danh sách sản phẩm theo danh mục (dầu gội, sáp wax, serum,...)
Xem chi tiết sản phẩm (ảnh, mô tả, giá, số lượng còn)
Giỏ hàng & Đặt hàng:
Thêm / cập nhật / xóa sản phẩm trong giỏ hàng
Chọn địa chỉ giao hàng (thêm / sửa / xóa / đặt mặc định)
Chọn phương thức thanh toán: COD / Chuyển khoản / MoMo / ZaloPay
Xác nhận và đặt hàng, nhận thông báo đặt hàng thành công
Theo dõi trạng thái đơn hàng
Quản lý đơn hàng:
Xem danh sách đơn hàng và trạng thái từng đơn
Xem chi tiết đơn hàng (sản phẩm, số lượng, giá, địa chỉ giao)
Hủy đơn hàng (chỉ khi trạng thái còn PENDING)
Đánh giá sản phẩm sau khi nhận hàng (1–5 sao + bình luận)
3.2 Quản trị viên
Quản lý đơn hàng:
Xem toàn bộ danh sách đơn hàng, lọc theo trạng thái
Xác nhận và xử lý đơn hàng
Cập nhật trạng thái đơn (Đang xử lý → Đang giao → Hoàn thành)
Hủy đơn hàng (kèm lý do), xử lý hoàn tiền cho khách
Quản lý sản phẩm:
Thêm / sửa / xóa sản phẩm
Thiết lập tên, mô tả, giá bán, ảnh sản phẩm, số lượng tồn kho
Bật / tắt hiển thị sản phẩm (tạm ngừng bán)

4. Thông báo (Notification)
Sự kiện	Kênh gửi	Đối tượng
Đặt lịch thành công	App / Email	Người dùng
Lịch được duyệt / từ chối	App / Email	Người dùng
Nhắc lịch trước 24h & 2h	App / Email	Người dùng
Lịch bị hủy (bởi admin)	App / Email	Người dùng
Đơn hàng được xác nhận	App / Email	Người dùng
Trạng thái đơn hàng thay đổi	App / Email	Người dùng
Gửi link reset mật khẩu	Email	Người dùng
Xác nhận đổi mật khẩu thành công	Email	Người dùng
Đơn hàng mới / lịch hẹn mới	Dashboard	Admin
Giai đoạn đầu: Ưu tiên thông báo In-app + Email. SMS để lại giai đoạn sau.

5. Thanh toán & Hoàn tiền
Hỗ trợ: COD, Chuyển khoản ngân hàng, MoMo, ZaloPay
Lịch hẹn không yêu cầu đặt cọc — thanh toán trực tiếp tại salon
Lưu lịch sử giao dịch của từng người dùng
Hoàn tiền khi admin hủy đơn hàng đã thanh toán

6. Trạng thái lịch hẹn & đơn hàng
Lịch hẹn:
PENDING → CONFIRMED → IN_PROGRESS → COMPLETED
   ↓            ↓
CANCELLED    CANCELLED
(user/admin) (chỉ admin)
Khi duyệt lịch có staff_id = NULL, admin bắt buộc gán thợ trước khi CONFIRMED.
Đơn hàng:
PENDING → PROCESSING → SHIPPING → COMPLETED
   ↓            ↓
CANCELLED    CANCELLED
(user/admin) (chỉ admin + hoàn tiền)

7. Tóm tắt phân quyền
Chức năng	User	Admin
Đăng ký / Đăng nhập / Quên mật khẩu	✅	✅
Cập nhật thông tin cá nhân	✅	✅
Đặt / hủy lịch của mình	✅	❌
Duyệt / hủy / cập nhật lịch của khách	❌	✅
Quản lý nhân viên & thợ	❌	✅
Quản lý dịch vụ	❌	✅
Thêm giỏ hàng / đặt hàng	✅	❌
Xác nhận / xử lý đơn hàng	❌	✅
Quản lý sản phẩm & tồn kho	❌	✅
Đánh giá dịch vụ / sản phẩm	✅	❌
Gửi thông báo cho khách	❌	✅

8. Danh sách nghiệp vụ đầy đủ
Module 1 – Xác thực
#	Nghiệp vụ	Vai trò
1.1	Đăng ký / Đăng nhập 
1.2	Quên mật khẩu (gửi link email → reset)	User
1.3	Đổi mật khẩu (khi đã đăng nhập)	User
1.4	Cập nhật thông tin cá nhân	User
1.5	Xem lịch sử (lịch đặt, đơn hàng)	User
1.6	Đăng nhập Admin Dashboard	Admin
Module 2 – Đặt lịch cắt tóc
#	Nghiệp vụ	Vai trò
2.1	Xem danh sách dịch vụ theo danh mục	User
2.2	Xem thông tin thợ (ảnh, chuyên môn, đánh giá)	User
2.3	Chọn thợ hoặc "bất kỳ thợ nào"	User
2.4	Chọn ngày & khung giờ còn trống	User
2.5	Đặt lịch & nhận thông báo xác nhận	User
2.6	Xem danh sách lịch của mình	User
2.7	Xem chi tiết lịch hẹn	User
2.8	Hủy lịch (chỉ khi PENDING)	User
2.9	Đánh giá thợ sau khi lịch hoàn thành	User
2.10	Duyệt / từ chối lịch hẹn (gán thợ nếu NULL)	Admin
2.11	Hủy lịch hẹn của khách (kèm lý do)	Admin
2.12	Cập nhật trạng thái lịch (IN_PROGRESS / COMPLETED)	Admin
2.13	Thêm / sửa / xóa / bật-tắt dịch vụ	Admin
2.14	Quản lý danh mục dịch vụ	Admin
2.15	Thêm / sửa / xóa / bật-tắt thợ	Admin
2.16	Khóa khung giờ nghỉ đột xuất cho thợ	Admin
2.17	Xem hiệu suất thợ (số lịch, đánh giá TB)	Admin
Module 3 – Bán hàng
#	Nghiệp vụ	Vai trò
3.1	Xem danh sách & chi tiết sản phẩm	User
3.2	Thêm / cập nhật / xóa sản phẩm trong giỏ	User
3.3	Chọn / thêm / sửa / xóa địa chỉ giao hàng	User
3.4	Đặt hàng & chọn phương thức thanh toán	User
3.5	Theo dõi trạng thái đơn hàng	User
3.6	Hủy đơn (chỉ khi PENDING)	User
3.7	Đánh giá sản phẩm sau khi nhận hàng	User
3.8	Xác nhận & cập nhật trạng thái đơn	Admin
3.9	Hủy đơn + xử lý hoàn tiền	Admin
3.10	Thêm / sửa / xóa / bật-tắt sản phẩm	Admin
3.11	Quản lý danh mục sản phẩm	Admin
Module 4 – Thông báo & Thanh toán
#	Nghiệp vụ	Vai trò
4.1	Thông báo lịch hẹn (đặt / duyệt / từ chối / hủy / nhắc)	System
4.2	Thông báo đơn hàng (xác nhận / đổi trạng thái)	System
4.3	Gửi email reset mật khẩu & xác nhận đổi thành công	System
4.4	Thanh toán COD / Chuyển khoản / MoMo / ZaloPay	User
4.5	Lưu lịch sử giao dịch	System
4.6	Nhắc lịch tự động (Cron 24h & 2h trước lịch hẹn)	System

