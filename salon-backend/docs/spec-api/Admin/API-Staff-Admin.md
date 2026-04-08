# Backend API Spec — Quản lý nhân viên / Thợ (ADMIN)

## 1. Tổng quan
* **Mục tiêu:** CRUD dữ liệu nhân viên (thợ cắt tóc), khóa khung giờ, kích hoạt/vô hiệu hoá.
* **Actor:** ADMIN
* **Xác thực:** **JWT Required** + `@PreAuthorize("hasRole('ADMIN')")`.

---

## 2. API Endpoints

| Method | Path | Mục đích |
|---|---|---|
| GET | `/api/v1/admin/staffs` | Danh sách thợ (có phân trang/lọc) |
| POST | `/api/v1/admin/staffs` | Thêm thợ mới |
| PUT | `/api/v1/admin/staffs/{id}` | Cập nhật hồ sơ thợ |
| PUT | `/api/v1/admin/staffs/{id}/status` | Đổi trạng thái (Hoạt động / Tạm nghỉ) |
| POST | `/api/v1/admin/staffs/{id}/blocked-slots` | Khóa khung giờ nghỉ (Thêm blocked slot) |
| DELETE| `/api/v1/admin/staffs/blocked-slots/{slotId}` | Mở khóa (Xóa blocked slot) |
| GET | `/api/v1/admin/staffs/{id}/performance` | Thống kê lịch hoàn thành và rating thợ |

---

## 3. Quản lý hồ sơ
### Thêm mới thợ (POST `/api/v1/admin/staffs`)
* **Request:** `fullName` (NotBlank), `avatarUrl`, `phone`, `bio`...
* **Logic:** Tạo bảng `staff`, mặc định `is_active = TRUE`.

### Thay đổi trạng thái vô hiệu hoá (PUT `/api/v1/admin/staffs/{id}/status`)
* **Request Body:** `{ "isActive": false }`
* **Quy tắc (BR-STAFF-02):** Không được XOÁ thợ đã có lịch PENDING/CONFIRMED, thay vào đó dùng API thay đổi trạng thái này. Nếu ADMIN vẫn gọi `DELETE /api/v1/admin/staffs/{id}` (nếu có API đó), hệ thống bắt exception và báo lỗi yêu cầu đổi trạng thái.
* **Trả về:** 200 OK.

---

## 4. Khóa khung giờ (POST `/api/v1/admin/staffs/{id}/blocked-slots`)
### Request Body
```json
{
  "blockDate": "2026-04-10",
  "startTime": "14:00",
  "endTime": "17:00",
  "note": "Xin nghỉ phép cá nhân"
}
```
### Validation Rules & Logic
1. `blockDate`: Không được ở quá khứ. FORMAT: YYYY-MM-DD.
2. `startTime` < `endTime`.
3. Kiểm tra DB xem trong đoạn thời gian này, thợ đã có lịch nào `CONFIRMED`/`PENDING` chưa. NẾU CÓ, tùy thuộc vào nghiệp vụ, hiển thị WARNING (frontend cần cảnh báo) nhưng Server có thể cho phép lưu (dựa theo business rule: admin sẽ tự xử lý tay) hoặc Server ném status **409 Conflict** yêu cầu xử lý lịch đó trước. Ta sẽ throw 409 Conflict với message "Thợ đang có lịch hẹn trong khoảng thời gian này".
4. INSERT vào bảng `staff_blocked_slots`.

---

## 5. Xem hiệu suất (GET `/api/v1/admin/staffs/{id}/performance`)
1. COUNT số lịch trong `appointments` có `staff_id = {id}` và `status = 'COMPLETED'`.
2. Truy xuất `staff_reviews` lấy average rating.
3. Trả kết quả thống kê.

---

## 6. Acceptance Criteria
```text
AC-BE-01: Valid payload khi lưu blocked slot
Given thợ id=1 ko có vướng bận. 
When POST payload khoá 14:00 đến 17:00 ngày hôm sau.
Then 201 Created, insert success vào staff_blocked_slots.

AC-BE-02: Blocked slot bị vướng lịch
Given thợ id=1 có lịch hẹn CONFIRMED lúc 15:00.
When POST payload khoá 14:00 - 17:00.
Then trả về 409 Conflict ("Có lịch hẹn đang chờ trong khoảng thời gian này").
```
