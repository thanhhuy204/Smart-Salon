# Backend API Spec — Quản lý lịch hẹn (ADMIN)

## 1. Tổng quan API
* **Mục tiêu:** Cung cấp các endpoint cho quản trị viên xem, xác nhận, từ chối, hủy, và đánh dấu hoàn thành lịch hẹn của toàn bộ hệ thống.
* **Actor:** ADMIN
* **Xác thực:** Bảo mật cao. **JWT Required** + `@PreAuthorize("hasRole('ADMIN')")`.

---

## 2. API Endpoints

| Method | Path | Auth required | Mục đích |
|---|---|---|---|
| GET | `/api/v1/admin/appointments` | JWT (`ADMIN`) | Danh sách theo ngày/tuần/tháng |
| PUT | `/api/v1/admin/appointments/{id}/confirm` | JWT (`ADMIN`) | Xác nhận lịch (cần gán thợ nếu null) |
| PUT | `/api/v1/admin/appointments/{id}/reject` | JWT (`ADMIN`) | Từ chối lịch hẹn (từ PENDING -> CANCELLED) |
| PUT | `/api/v1/admin/appointments/{id}/cancel` | JWT (`ADMIN`) | Hủy lịch (trước COMPLETED) |
| PUT | `/api/v1/admin/appointments/{id}/complete`| JWT (`ADMIN`) | Đánh dấu hoàn thành lịch |

---

## 3. Xem danh sách lịch hẹn (GET `/api/v1/admin/appointments`)
* **Query Parameters:**
  * `startDate`, `endDate` (String YYYY-MM-DD)
  * `status` (String, tuỳ chọn)
  * `staffId` (Long, tuỳ chọn)
* **Response 200 OK:**
  * Trả về danh sách chứa các thông tin tổng quát để render Calendar hoặc List.

---

## 4. Duyệt xác nhận lịch hẹn (PUT `/api/v1/admin/appointments/{id}/confirm`)
### Request Body
```json
{
  "staffId": 5  // Bắt buộc nếu lịch đang là "bất kỳ thợ nào" (staffId trong DB = NULL)
}
```

### Validation Rules & Business Logic
1. Tìm lịch hẹn (404 nếu không thấy).
2. Rule: Lịch phải đang ở trạng thái `PENDING` (Nếu khác -> 400).
3. Rule: Nếu `appointment.staff_id == null`, `request.staffId` bắt buộc phải có giá trị. Nếu request không có -> **400 Bad Request: "Phải gán thợ cụ thể khi xác nhận lịch này"**.
4. Logic: Cập nhật `status = 'CONFIRMED'`. Nếu có gán `staffId`, cập nhật `staff_id` vào DB.
5. Side Effect: Lưu notification (APPT_CONFIRMED) cho `user_id`.

---

## 5. Từ chối / Hủy lịch hẹn (PUT `/api/v1/admin/appointments/{id}/cancel`)
Gộp chung API hủy và từ chối, vì bản chất đều cập nhật trạng thái `CANCELLED` dựa vào Admin action.

### Request Body
```json
{
  "reason": "Thợ nghỉ đột xuất"
}
```
### Validation & Logic
1. Cần nhập lý do. Nếu `reason` trống -> **400 Bad Request**.
2. Kiểm tra status: Nếu status là `COMPLETED` hoặc `CANCELLED` thì báo lỗi **400: "Không thể hủy lịch đã hoàn thành hoặc đã hủy"**.
3. (Nếu từ PENDING -> được coi là Reject, từ các trạng thái khác -> được coi là Canceled bởi Admin).
4. Cập nhật `status = 'CANCELLED'`, `cancel_reason = request.reason`, `cancelled_by = 'ADMIN'`.
5. Tạo thông báo (APPT_CANCELLED / REJECTED) kèm lý do cho khách hàng.

---

## 6. Đánh dấu hoàn thành (PUT `/api/v1/admin/appointments/{id}/complete`)
### Validation & Logic
1. Chỉ cho phép nếu trạng thái hiện tại là `CONFIRMED` hoặc `IN_PROGRESS`.
2. Cập nhật `status = 'COMPLETED'`.
3. Side Effect: Tự động gửi notification mời khách hàng feedback thợ.

---

## 7. Security & Edge Cases
* **Security:** Mọi endpoint bắt buộc gọi hàm authorization check Role là ADMIN.
* **Edge case:** Đồng thời khách hủy lịch `PENDING` và Admin bấm duyệt `PENDING`. Dùng transaction isolation level hoặc optimistic locking (`@Version`) (nếu cấu hình) hoặc dựa trên update affected rows để đảm bảo không bị conflict. Nếu lúc Admin lưu mà status đã qua `CANCELLED` thì văng exception 409 Conflict.

---

## 8. Acceptance Criteria
```text
AC-BE-01: Admin xác nhận lịch yêu cầu gán thợ
Given lịch id=1 có staff_id = null.
When ADMIN gọi PUT /api/v1/admin/appointments/1/confirm không truyền body.
Then API trả 400 "Vui lòng chọn thợ xác nhận".

AC-BE-02: Admin huỷ lịch thiếu lý do
Given lịch id=2 đang PENDING.
When ADMIN gọi PUT /api/v1/admin/appointments/2/cancel body: { reason: "" }
Then API trả 400 "Lý do huỷ không được để trống".
```
