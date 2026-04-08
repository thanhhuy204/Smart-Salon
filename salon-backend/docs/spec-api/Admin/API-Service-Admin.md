# Backend API Spec — Quản lý dịch vụ (ADMIN)

## 1. Tổng quan
* **Mục tiêu:** Quản lý Service Category và Services.
* **Actor:** ADMIN
* **Xác thực:** **JWT Required** + `@PreAuthorize("hasRole('ADMIN')")`.

---

## 2. API Endpoints

| Method | Path | Mục đích |
|---|---|---|
| GET | `/api/v1/admin/service-categories` | Lấy danh mục |
| GET | `/api/v1/admin/services` | Danh sách dịch vụ |
| POST | `/api/v1/admin/services` | Thêm mới dịch vụ |
| PUT | `/api/v1/admin/services/{id}` | Cập nhật dịch vụ |
| PUT | `/api/v1/admin/services/{id}/status` | Bật/tắt trạng thái hiển thị |
| DELETE| `/api/v1/admin/services/{id}` | Xóa dịch vụ |

---

## 3. Thêm mới / Cập nhật Dịch vụ (POST / PUT `/api/v1/admin/services`)
### Request Body
```json
{
  "categoryId": 1,
  "name": "Nhuộm Ombre",
  "description": "Nhuộm phong cách mới",
  "price": 500000.00,
  "durationM": 120
}
```

### Validation Rules
* `categoryId`: Không trống, tồn tại trong `service_categories`.
* `name`: Bắt buộc. Unique trong cùng `categoryId` (Kiểm tra DB).
* `price`: `> 0`. (400 Bad request nếu `<= 0`).
* `durationM`: Integer tối thiểu 15 (`>= 15`). (400 Bad request nếu sai quy tắc).

### Logic Database
* INSERT/UPDATE bảng `services`.
* Update không ảnh hưởng tới `appointment_services` ở các lịch hẹn cũ vì `appointment_services` lưu giá snapshot `price_snapshot`.

---

## 4. Bật / Tắt trạng thái và Xóa Dịch Vụ
### Đổi trạng thái (`PUT /api/v1/admin/services/{id}/status`)
Cập nhật `is_active` (True/False).

### Xóa Dịch Vụ (`DELETE /api/v1/admin/services/{id}`)
1. Check xem `id` có trong `appointment_services` đối với các lịch hẹn `PENDING` hoặc `CONFIRMED` hay không?
2. NẾU CÓ, cấm xóa -> Trả về lỗi `409 Conflict: "Dịch vụ đang có lịch hẹn. Hãy tắt hiển thị thay vì xóa."`
3. NẾU KHÔNG CÓ (nhưng có ở lịch cũ), do ràng buộc khóa ngoại (Constraint FK), không thể thực sự `DELETE` cứng nếu bảng `appointment_services` không dùng cascade delete. Do quy định không xóa nếu có tham chiếu, có thể xóa mềm (cập nhật `is_active = false` hoặc flag `is_deleted`). Nếu thật sự chưa từng được mua, thì xoá vật lý. (Khuyến nghị là xoá mềm).

---

## 5. Acceptance Criteria
```text
AC-BE-01: Validation giá tiền dịch vụ
Given admin thêm dịch vụ.
When nhập "price": -100
Then API trả 400 Bad Request kèm message "Giá tiền phải lớn hơn 0".

AC-BE-02: Cố xoá dịch vụ đang có lịch
Given dịch vụ id=5 đã từng được đặt lịch và còn PENDING.
When DELETE /api/v1/admin/services/5
Then trả 409 Conflict ("Dịch vụ đang được tham chiếu, hãy tắt hiển thị thay vì xoá").
```
