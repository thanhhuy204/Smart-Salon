# Backend API Spec — Đặt lịch cắt tóc & Quản lý lịch hẹn (USER)

## 1. Tổng quan API
* **Mục tiêu:** Cung cấp các endpoint cho người dùng xem dịch vụ, thợ, khung giờ trống, đặt lịch hẹn và quản lý lịch hẹn (xem danh sách, chi tiết, hủy lịch) của chính họ.
* **Actor:** USER đã đăng nhập. (Có vài endpoint danh sách dịch vụ/thợ có thể là Public).
* **Xác thực:** Hầu hết yêu cầu **JWT Required** (Role: `USER`). `GET` dịch vụ và thợ có thể **Public**.

---

## 2. Các API Endpoints

| Method | Path | Auth required | Mục đích |
|---|---|---|---|
| GET | `/api/v1/services` | Không | Xem danh sách dịch vụ (nhóm theo danh mục) |
| GET | `/api/v1/staffs` | Không | Xem danh sách thợ (có thể lọc theo service) |
| GET | `/api/v1/appointments/available-slots` | Không / JWT | Lấy các khung giờ còn trống trong ngày |
| POST | `/api/v1/appointments` | JWT (`USER`) | Đặt lịch hẹn mới |
| GET | `/api/v1/appointments/my-appointments` | JWT (`USER`) | Xem danh sách lịch hẹn của tôi |
| GET | `/api/v1/appointments/{id}` | JWT (`USER`) | Xem chi tiết lịch hẹn |
| PUT | `/api/v1/appointments/{id}/cancel` | JWT (`USER`) | Hủy lịch hẹn (chỉ PENDING) |
| POST| `/api/v1/appointments/{id}/reviews`| JWT (`USER`) | Đánh giá thợ (khi lịch COMPLETED) |

---

## 3. Xem danh sách dịch vụ (GET `/api/v1/services`)
### Request
* **Query Parameters:**
  * `categoryId` (Long, optional): Lọc theo danh mục.
* **Response 200 OK:**
```json
{
  "status": 200,
  "message": "Success",
  "data": [
    {
      "categoryId": 1,
      "categoryName": "Cắt tóc",
      "services": [
        { "id": 1, "name": "Cắt tạo kiểu", "price": 100000, "durationM": 30, "description": "Cắt tóc nam" }
      ]
    }
  ]
}
```

---

## 4. Lấy khung giờ trống (GET `/api/v1/appointments/available-slots`)
### Request
* **Query Parameters:**
  * `date` (String, YYYY-MM-DD, **Required**): Ngày muốn xem giờ trống.
  * `staffId` (Long, Optional): ID của thợ (null nếu chọn bất kỳ).
  * `totalDuration` (Integer, **Required**): Tổng thời gian thực hiện (phút).

### Validation Rules
* `date`: Không để trống, format YYYY-MM-DD. Phải >= ngày hiện tại (+ giờ làm việc hợp lệ).
* `totalDuration`: Số nguyên > 0.

### Business Logic
1. Validate format & presence.
2. Kiểm tra `date` không nằm trong quá khứ.
3. Lấy `salon_working_hours` của thứ tương ứng.
4. Nếu có `staffId`: loại bỏ các khung giờ nằm trong `staff_blocked_slots` và các `appointments` (PENDING/CONFIRMED) của thợ này.
5. Nếu không có `staffId`: tổng hợp giờ trống của tất cả thợ (cần ít nhất 1 thợ rảnh đủ `totalDuration`).
6. Trả về mảng các `startTime` (VD: `["09:00", "09:30"]`).

---

## 5. Đặt lịch hẹn mới (POST `/api/v1/appointments`)
### Request Body
```json
{
  "serviceIds": [1, 2],
  "staffId": 3, 
  "apptDate": "2026-03-30",
  "startTime": "10:00"
}
```
* `staffId`: Tùy chọn (null = "Bất kỳ thợ nào").

### Validation Rules
| Field | Rules | HTTP Status |
|---|---|---|
| `serviceIds` | Không trống, size >= 1 | 400 |
| `apptDate` | Format YYYY-MM-DD, >= today | 400 |
| `startTime` | Format HH:mm | 400 |
| (Business) | Khung giờ không hợp lệ / đã bị đặt | 409 Conflict |

### Business Logic
```
POST /api/v1/appointments
  ├─► [1] Validate body (not null, format)
  ├─► [2] Check Business Rules:
  │    ├─► Dịch vụ tồn tại và đang active.
  │    ├─► Lấy tổng thời gian (totalDuration) và giá. Tính endTime.
  │    ├─► Thợ (nếu có) phải active.
  │    └─► Kiểm tra khung giờ trùng lặp / blocked qua DB `appointments` và `staff_blocked_slots`.
  ├─► [3] Ghi DB:
  │    ├─► INSERT INTO `appointments` (user_id, staff_id, appt_date, start_time, end_time, total_price, status='PENDING')
  │    └─► INSERT INTO `appointment_services` cho từng dịch vụ và lưu `price_snapshot`.
  ├─► [4] Side Effect: Lưu notification (APPT_BOOKED), có thể push email.
  └─► [5] Trả về 201 Created cùng mã lịch.
```

---

## 6. Xem danh sách lịch hẹn của tôi (GET `/api/v1/appointments/my-appointments`)
### Request
* **Auth:** Bắt buộc (JWT)
* **Query Parameters:**
  * `tab` (String, Optional): `UPCOMING` (PENDING, CONFIRMED trong tg lai) / `COMPLETED` / `CANCELLED`.
  * `page`, `size`.

### Response 200 OK
Trả về `PageResponse<MyAppointmentDTO>`, sắp xếp theo ngày/giờ giảm dần hoặc tăng dần tuỳ tab.

---

## 7. Hủy lịch hẹn (PUT `/api/v1/appointments/{id}/cancel`)
### Business / Security
* **Security:** Cần JWT (`user`). Verify `appointments.user_id == jwt.userId` (Ownership check - **403 Forbidden** nếu vi phạm).
* **Business Rule:** Chỉ cho phép nếu `status == 'PENDING'`. Nếu sai, ném lỗi **400 Bad Request**.

### Logic
1. Lấy lịch hẹn từ DB (`findById`). Nếu ko có → 404.
2. Check ownership.
3. Check status == PENDING.
4. UPDATE `appointments` set `status = 'CANCELLED'`, `cancelled_by = 'USER'`.
5. Tạo `notification` gửi user xác nhận.
6. Return 200 OK.

---

## 8. Database Tác Động
* Bảng `appointments`: `INSERT` (khi đặt lịch), `UPDATE` (khi hủy).
* Bảng `appointment_services`: `INSERT` (khi đặt lịch).
* Bảng `notifications`: `INSERT`.

---

## 9. Acceptance Criteria (Backend)
```text
AC-BE-01: Đặt lịch thành công
Given payload đúng định dạng, khung giờ rảnh.
When POST /api/v1/appointments
Then trả về 201 Created, db appointments tạo mới 1 row có status PENDING.

AC-BE-02: User hủy lịch PENDING của mình
Given appointment_id = 1, user_id=1, status=PENDING. User1 login gọi API huỷ.
When PUT /api/v1/appointments/1/cancel
Then trả về 200 OK. DB status -> CANCELLED, cancelled_by = USER.

AC-BE-03: User huỷ lịch CONFIRMED
Given appointment_id=2, status=CONFIRMED.
When user gọi PUT /api/v1/appointments/2/cancel
Then trả về 400 Bad Request ("Chỉ được huỷ lịch khi đang ở trạng thái PENDING").

AC-BE-04: Đặt vào khung giờ bị trùng
Given thợ 3 đã có lịch CONFIRMED lúc 10:00 ngày 2026-04-01.
When gửi POST đăt lịch cho thợ 3 lúc 10:00.
Then trả về 409 Conflict ("Khung giờ này đã được đặt").
```
