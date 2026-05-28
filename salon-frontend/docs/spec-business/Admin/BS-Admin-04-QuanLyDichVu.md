# Business Specification — Quản lý dịch vụ (Admin)
**Module:** Admin / Service
**Phiên bản:** 1.0
**Ngày tạo:** 2026-03-27
**Tác giả:** Business Analyst

---

## 1. Business Goal

Cho phép quản trị viên quản lý toàn bộ danh mục và gói dịch vụ của salon — thêm mới, cập nhật thông tin, bật/tắt hiển thị và phân loại theo danh mục — nhằm đảm bảo khách hàng luôn thấy đúng các dịch vụ đang cung cấp với thông tin chính xác.

---

## 2. Actors

| Actor | Mô tả |
|---|---|
| Quản trị viên (ADMIN) | Quản lý danh mục và gói dịch vụ |
| Hệ thống | Lưu trữ và phản ánh dữ liệu dịch vụ ngay lên trang đặt lịch của khách |

---

## 3. Preconditions

- Quản trị viên đã đăng nhập với quyền ADMIN.
- Đang ở trong Admin Dashboard, mục **"Quản lý dịch vụ"**.

---

## 4. Main Flow (Happy Path)

### 4.1 Xem danh sách dịch vụ
1. Admin truy cập mục **"Quản lý dịch vụ"**.
2. Hệ thống hiển thị danh sách tất cả dịch vụ, nhóm theo danh mục.
3. Mỗi dịch vụ hiển thị: tên, danh mục, giá tiền, thời gian thực hiện, trạng thái (Đang hiển thị / Tạm ẩn).

### 4.2 Thêm dịch vụ mới
4. Admin nhấn **"Thêm dịch vụ"**.
5. Hệ thống hiển thị form gồm: Tên dịch vụ, Danh mục (chọn từ danh sách hoặc tạo mới), Mô tả, Giá tiền, Thời gian thực hiện (phút), Ảnh minh họa (tuỳ chọn).
6. Admin điền đầy đủ thông tin bắt buộc và nhấn **"Lưu"**.
7. Hệ thống tạo dịch vụ mới ở trạng thái **Đang hiển thị** mặc định.
8. Dịch vụ mới xuất hiện ngay trong trang đặt lịch của khách.

### 4.3 Sửa thông tin dịch vụ
9. Admin nhấn **"Chỉnh sửa"** trên một dịch vụ.
10. Hệ thống hiển thị form chỉnh sửa với dữ liệu hiện tại.
11. Admin cập nhật thông tin (tên, giá, thời gian, mô tả,...) và nhấn **"Lưu"**.
12. Hệ thống cập nhật ngay — khách đặt lịch sau đó sẽ thấy thông tin mới.

### 4.4 Bật / Tắt hiển thị dịch vụ
13. Admin nhấn toggle **"Tắt hiển thị"** trên dịch vụ đang hiển thị.
14. Hệ thống hiển thị xác nhận: *"Dịch vụ sẽ bị ẩn khỏi trang đặt lịch. Tiếp tục?"*
15. Admin xác nhận → dịch vụ chuyển sang trạng thái **Tạm ẩn**.
16. Dịch vụ không còn hiển thị với khách, nhưng dữ liệu lịch hẹn cũ vẫn được giữ nguyên.
17. Admin có thể bật lại bằng toggle **"Bật hiển thị"** bất kỳ lúc nào.

### 4.5 Xóa dịch vụ
18. Admin nhấn **"Xóa"** trên dịch vụ muốn xóa.
19. Hệ thống kiểm tra dịch vụ có đang được tham chiếu trong lịch hẹn PENDING / CONFIRMED.
20. Nếu không có tham chiếu: hệ thống yêu cầu xác nhận → xóa vĩnh viễn.
21. Nếu có tham chiếu: hệ thống cảnh báo và đề nghị **Tắt hiển thị** thay vì xóa.

### 4.6 Quản lý danh mục dịch vụ
22. Admin truy cập tab **"Danh mục"** trong trang Quản lý dịch vụ.
23. Hệ thống hiển thị danh sách các danh mục (Cắt, Uốn, Nhuộm, Chăm sóc,...).
24. Admin có thể thêm danh mục mới, đổi tên hoặc xóa danh mục không còn dịch vụ nào.

---

## 5. Alternative Flows

### 5.1 Tên dịch vụ để trống
- Hệ thống hiển thị lỗi: *"Tên dịch vụ không được để trống."*

### 5.2 Giá tiền hoặc thời gian nhập không hợp lệ
- Giá tiền âm hoặc bằng 0: *"Giá tiền phải lớn hơn 0."*
- Thời gian thực hiện nhỏ hơn 15 phút hoặc không phải số nguyên: *"Thời gian thực hiện tối thiểu là 15 phút."*

### 5.3 Xóa danh mục còn dịch vụ bên trong
- Hệ thống hiển thị cảnh báo: *"Danh mục này đang có [N] dịch vụ. Hãy chuyển hoặc xóa các dịch vụ trước."*
- Không cho xóa danh mục.

### 5.4 Tắt hiển thị dịch vụ khi có lịch hẹn PENDING đang chọn dịch vụ đó
- Hệ thống cho phép tắt — các lịch hẹn đang chờ không bị ảnh hưởng.
- Dịch vụ chỉ ẩn với khách đặt lịch mới.

---

## 6. Business Rules

| Mã | Quy tắc |
|---|---|
| BR-SVC-01 | Tên dịch vụ là bắt buộc và phải là duy nhất trong cùng một danh mục. |
| BR-SVC-02 | Giá tiền phải là số dương (lớn hơn 0). |
| BR-SVC-03 | Thời gian thực hiện phải là số nguyên dương, tối thiểu 15 phút. |
| BR-SVC-04 | Dịch vụ **Tạm ẩn** không hiển thị với khách khi đặt lịch nhưng dữ liệu lịch sử vẫn được giữ. |
| BR-SVC-05 | Không xóa dịch vụ đang được tham chiếu trong lịch hẹn PENDING / CONFIRMED — chỉ tắt hiển thị. |
| BR-SVC-06 | Thay đổi giá dịch vụ chỉ áp dụng cho lịch hẹn mới — không ảnh hưởng đến lịch hẹn đã đặt trước. |
| BR-SVC-07 | Mỗi dịch vụ phải thuộc ít nhất một danh mục. |

---

## 7. Edge Cases

| Tình huống | Hành vi mong đợi |
|---|---|
| Khách đang xem dịch vụ thì Admin tắt hiển thị | Khách tải lại trang, dịch vụ đó không còn hiển thị. |
| Admin sửa thời gian thực hiện từ 60 phút xuống 30 phút | Lịch hẹn cũ không bị ảnh hưởng; lịch đặt mới sẽ dùng 30 phút. |
| Tìm kiếm dịch vụ theo tên | Hệ thống hỗ trợ filter/search real-time theo tên dịch vụ. |
| Không có dịch vụ nào trong danh mục | Danh mục vẫn hiển thị (cho Admin) nhưng ẩn với khách khi đặt lịch. |

---

## 8. Acceptance Criteria (Given/When/Then)

### AC-01: Thêm dịch vụ mới thành công
- **Given:** Admin ở trang Quản lý dịch vụ.
- **When:** Admin điền tên "Nhuộm Ombre", danh mục "Nhuộm", giá 500.000đ, 120 phút và nhấn "Lưu".
- **Then:** Dịch vụ mới xuất hiện trong danh sách Admin và trong trang đặt lịch của khách.

### AC-02: Tắt hiển thị dịch vụ
- **Given:** Dịch vụ "Cắt layer" đang ở trạng thái "Đang hiển thị".
- **When:** Admin tắt toggle hiển thị và xác nhận.
- **Then:** Dịch vụ chuyển trạng thái "Tạm ẩn", không xuất hiện khi khách đặt lịch mới.

### AC-03: Bật lại dịch vụ đã tắt
- **Given:** Dịch vụ "Cắt layer" đang ở trạng thái "Tạm ẩn".
- **When:** Admin bật toggle hiển thị.
- **Then:** Dịch vụ trở lại trạng thái "Đang hiển thị", xuất hiện lại trong trang đặt lịch.

### AC-04: Cảnh báo khi xóa dịch vụ có lịch chưa hoàn thành
- **Given:** Dịch vụ "Uốn xoăn" đang được dùng trong 3 lịch hẹn PENDING.
- **When:** Admin cố xóa dịch vụ này.
- **Then:** Hệ thống hiển thị cảnh báo và đề nghị tắt hiển thị thay vì xóa.

### AC-05: Lỗi khi nhập giá tiền không hợp lệ
- **Given:** Admin đang điền form thêm dịch vụ.
- **When:** Admin nhập giá tiền là "-100" và nhấn "Lưu".
- **Then:** Hệ thống hiển thị lỗi "Giá tiền phải lớn hơn 0.", không lưu dịch vụ.

### AC-06: Sửa giá không ảnh hưởng lịch hẹn cũ
- **Given:** Dịch vụ "Cắt nam" có giá 100.000đ và đã có lịch hẹn CONFIRMED.
- **When:** Admin sửa giá thành 120.000đ.
- **Then:** Lịch hẹn CONFIRMED hiện có vẫn hiển thị giá 100.000đ; lịch đặt mới dùng 120.000đ.

---

## 9. Mapping Business Spec → UI Elements

| Phần nghiệp vụ | Thành phần giao diện |
|---|---|
| Danh sách dịch vụ | Table nhóm theo danh mục, hoặc accordion theo category |
| Thêm / Sửa dịch vụ | Dialog/form: input tên, select danh mục, textarea mô tả, input giá (number), input thời gian (number), upload ảnh |
| Bật / Tắt hiển thị | Toggle switch trong mỗi row, có dialog xác nhận khi tắt |
| Badge trạng thái | "Đang hiển thị" = badge xanh lá; "Tạm ẩn" = badge xám |
| Xóa dịch vụ | Nút "Xóa" màu đỏ với dialog xác nhận; cảnh báo nếu có lịch đang dùng |
| Quản lý danh mục | Tab riêng: danh sách chip/tag danh mục, nút thêm/đổi tên/xóa |
| Tìm kiếm | Search input real-time phía trên danh sách |
