# Business Specification — Cập nhật thông tin cá nhân
**Module:** Profile
**Phiên bản:** 1.0
**Ngày tạo:** 2026-03-27
**Tác giả:** Business Analyst

---

## 1. Business Goal

Cho phép người dùng đã đăng nhập xem và cập nhật thông tin cá nhân của mình (họ tên, ảnh đại diện, số điện thoại) nhằm đảm bảo dữ liệu trên hệ thống luôn chính xác và phản ánh đúng danh tính người dùng.

---

## 2. Actors

| Actor | Mô tả |
|---|---|
| Người dùng đã đăng nhập (USER) | Chủ sở hữu tài khoản, tự cập nhật thông tin của mình |
| Hệ thống | Kiểm tra dữ liệu và lưu thay đổi |

---

## 3. Preconditions

- Người dùng đã đăng nhập vào hệ thống.
- Người dùng đang ở trang Trang cá nhân (/profile).

---

## 4. Main Flow (Happy Path)

1. Người dùng truy cập trang **Trang cá nhân** từ dropdown menu trên thanh điều hướng.
2. Hệ thống hiển thị thông tin hiện tại của người dùng: **Ảnh đại diện**, **Họ tên**, **Email** (chỉ đọc), **Số điện thoại**.
3. Người dùng nhấn nút **"Chỉnh sửa"** (hoặc các trường tự động ở chế độ có thể chỉnh sửa).
4. Người dùng thay đổi một hoặc nhiều trường: Họ tên, Số điện thoại.
5. Người dùng nhấn vào vùng ảnh đại diện để tải lên ảnh mới.
6. Hệ thống hiển thị trình chọn file — người dùng chọn ảnh từ thiết bị.
7. Hệ thống hiển thị preview ảnh vừa chọn.
8. Người dùng nhấn nút **"Lưu thay đổi"**.
9. Hệ thống kiểm tra tính hợp lệ của dữ liệu.
10. Hệ thống lưu thông tin mới.
11. Hệ thống hiển thị thông báo: *"Cập nhật thông tin thành công."*
12. Thanh điều hướng cập nhật ngay: hiển thị tên và ảnh đại diện mới.

---

## 5. Alternative Flows

### 5.1 Số điện thoại không hợp lệ
- **Tại bước 9:** Số điện thoại không đúng định dạng (không đủ 10 chữ số, có ký tự lạ).
- Hệ thống hiển thị lỗi: *"Số điện thoại không hợp lệ (10 chữ số, bắt đầu bằng 0)."*
- Thông tin không được lưu.

### 5.2 Số điện thoại đã được dùng bởi tài khoản khác
- **Tại bước 10:** Số điện thoại mới đã tồn tại trong hệ thống của người dùng khác.
- Hệ thống hiển thị lỗi: *"Số điện thoại này đã được sử dụng bởi tài khoản khác."*

### 5.3 File ảnh không hợp lệ
- **Tại bước 6:** Người dùng chọn file không phải định dạng ảnh (PDF, exe, v.v.) hoặc ảnh quá lớn (> 5MB).
- Hệ thống hiển thị thông báo: *"Vui lòng chọn file ảnh (JPG, PNG) và dung lượng không quá 5MB."*
- Ảnh cũ vẫn được giữ nguyên.

### 5.4 Người dùng nhấn "Hủy" khi đang chỉnh sửa
- **Tại bước 4–7:** Người dùng nhấn "Hủy".
- Hệ thống khôi phục lại dữ liệu gốc, không lưu thay đổi.

### 5.5 Không thay đổi gì rồi nhấn "Lưu"
- **Tại bước 8:** Dữ liệu không có gì thay đổi so với ban đầu.
- Hệ thống vẫn xử lý bình thường và hiển thị: *"Thông tin của bạn đã được cập nhật."* (hoặc bỏ qua nếu không có thay đổi).

---

## 6. Business Rules

| Mã | Quy tắc |
|---|---|
| BR-PROFILE-01 | Trường Email là chỉ đọc — người dùng không thể thay đổi email sau khi đăng ký. |
| BR-PROFILE-02 | Họ tên không được để trống và không được chỉ gồm khoảng trắng. |
| BR-PROFILE-03 | Số điện thoại phải đúng định dạng 10 chữ số bắt đầu bằng 0 và chưa được dùng bởi tài khoản khác. |
| BR-PROFILE-04 | Ảnh đại diện chỉ chấp nhận định dạng JPG, PNG; dung lượng tối đa 5MB. |
| BR-PROFILE-05 | Người dùng chỉ có thể chỉnh sửa thông tin của chính mình — không được sửa thông tin tài khoản khác. |
| BR-PROFILE-06 | Sau khi lưu thành công, thanh điều hướng phải cập nhật ngay tên và ảnh đại diện mới. |

---

## 7. Edge Cases

| Tình huống | Hành vi mong đợi |
|---|---|
| Họ tên nhập toàn khoảng trắng | Hệ thống coi là trống, hiển thị lỗi "Họ tên không được để trống." |
| Chọn ảnh xong nhưng mất mạng khi lưu | Hệ thống hiển thị lỗi kết nối, thông tin cũ được giữ nguyên. |
| Người dùng tải trang lại khi đang chỉnh sửa chưa lưu | Hệ thống khôi phục về dữ liệu gốc (trước khi sửa). |
| Họ tên chứa ký tự đặc biệt (emoji, ký tự lạ) | Hệ thống hiển thị thông báo lỗi "Họ tên chỉ được chứa chữ cái và khoảng trắng." |

---

## 8. Acceptance Criteria (Given/When/Then)

### AC-01: Cập nhật tên thành công
- **Given:** Người dùng đang ở trang Trang cá nhân, ở chế độ chỉnh sửa.
- **When:** Người dùng thay đổi tên thành "Nguyễn Văn B" và nhấn "Lưu thay đổi".
- **Then:** Hệ thống lưu tên mới, hiển thị thông báo thành công, thanh điều hướng hiển thị "Nguyễn Văn B".

### AC-02: Cập nhật ảnh đại diện thành công
- **Given:** Người dùng ở trang Trang cá nhân.
- **When:** Người dùng chọn file ảnh JPG hợp lệ (< 5MB) và nhấn "Lưu thay đổi".
- **Then:** Ảnh mới được hiển thị trên trang cá nhân và trên thanh điều hướng.

### AC-03: Lỗi khi số điện thoại không hợp lệ
- **Given:** Người dùng đang chỉnh sửa thông tin.
- **When:** Người dùng nhập số điện thoại "12345" và nhấn "Lưu thay đổi".
- **Then:** Hệ thống hiển thị lỗi "Số điện thoại không hợp lệ.", không lưu thay đổi.

### AC-04: Email không thể chỉnh sửa
- **Given:** Người dùng đang ở trang Trang cá nhân.
- **When:** Người dùng cố nhấn vào trường Email.
- **Then:** Trường Email không cho phép nhập liệu (disabled/readonly), hiển thị tooltip giải thích nếu cần.

### AC-05: Lỗi khi ảnh quá lớn
- **Given:** Người dùng đang chỉnh sửa ảnh đại diện.
- **When:** Người dùng chọn file ảnh có dung lượng 10MB.
- **Then:** Hệ thống hiển thị thông báo "Dung lượng ảnh không được vượt quá 5MB.", ảnh không được tải lên.

---

## 9. Mapping Business Spec → UI Elements

| Phần nghiệp vụ | Thành phần giao diện |
|---|---|
| Hiển thị ảnh đại diện | Avatar tròn, kích thước lớn, có overlay icon camera khi hover |
| Tải ảnh mới | Click vào avatar → input file ẩn được kích hoạt, chỉ nhận image/* |
| Preview ảnh | Ảnh được hiển thị ngay sau khi chọn, trước khi lưu |
| Trường Họ tên | Input text có thể chỉnh sửa |
| Trường Email | Input text ở trạng thái disabled, màu xám, có chú thích "Không thể thay đổi" |
| Trường Số điện thoại | Input tel có thể chỉnh sửa |
| Lưu thay đổi | Nút "Lưu thay đổi" — CTA chính |
| Hủy chỉnh sửa | Nút "Hủy" — secondary, khôi phục dữ liệu gốc |
| Thông báo thành công | Toast/snackbar xanh lá ở góc màn hình |
| Thông báo lỗi trường | Text màu đỏ dưới trường bị lỗi |
