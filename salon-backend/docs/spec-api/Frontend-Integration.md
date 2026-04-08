# Tài Liệu Tích Hợp API Dành Cho Frontend (FE Integration Guide)

Tài liệu này tổng hợp toàn bộ các Endpoints cốt lõi (User Flow) mà Frontend cần gọi để thực hiện chức năng **Đặt Lịch Cắt Tóc** và **Quản lý Dịch Vụ / Booking**. 

Tất cả cấu trúc đều chung 1 format Response tiêu chuẩn:
```json
{
  "status": 200, // HTTP status nội bộ
  "message": "Thành công",
  "data": { ... } // Payload chứa dữ liệu thực tế
}
```

---

## 1. Flow Chọn Dịch Vụ

**Lấy danh sách dịch vụ (đã gom nhóm theo Danh mục)**
- **Endpoint:** `GET /api/v1/services`
- **Mục đích:** Hiển thị menu cho user chọn các dịch vụ muốn cắt/uốn/nhuộm.
- **Role:** Dùng public, không cần Token.
- **Ví dụ Response Data:**
```json
"data": [
  {
    "categoryId": 1,
    "categoryName": "Cắt Tạo Kiểu",
    "services": [
      {
        "id": 1,
        "name": "Cắt Tóc Nam Chuẩn",
        "price": 80000,
        "durationM": 30, // Thời gian (phút)
        "description": "Cắt, cạo, kẹp tạo kiểu"
      }
    ]
  }
]
```

---

## 2. Flow Chọn Thợ

**Lấy danh sách Thợ (Staff) đang hoạt động**
- **Endpoint:** `GET /api/v1/staffs`
- **Mục đích:** Danh sách thợ để user chọn (hoặc click button "Bất kì thợ nào").
- **Ví dụ Response Data:**
```json
"data": [
  {
    "id": 1,
    "fullName": "Trần Văn A",
    "avatarUrl": "https://...",
    "bio": "Chuyên gia Master Stylist",
    "averageRating": 4.8, 
    "totalCompletedAppointments": 120
  }
]
```

---

## 3. Flow Đặt Lịch (Booking)

### 3.1. Tìm Khung Giờ Trống (Available Slots)
- **Endpoint:** `GET /api/v1/appointments/available-slots`
- **Query Params:** 
  - `date`: Ngày muốn đặt (Format chuẩn ISO: `YYYY-MM-DD`). VD: `date=2026-04-10`
  - `staffId`: (Tuỳ chọn). Bỏ trống nếu chọn thợ bất kì. Truyền vào sẽ tự động gạch bỏ các khung giờ thợ đó bận.
- **Lưu ý UI:** Nếu `isAvailable = false`, FE cần disable cái nút chọn giờ tương ứng và đổi màu theo `status` (`BOOKED` hoặc `BLOCKED`).
- **Ví dụ Response Data:**
```json
"data": [
  {
    "startTime": "08:30:00",
    "endTime": "09:00:00",
    "isAvailable": true,
    "status": "AVAILABLE"
  },
  {
    "startTime": "09:00:00",
    "endTime": "09:30:00",
    "isAvailable": false,
    "status": "BOOKED"
  }
]
```

### 3.2. Gửi Đặt Lịch (Submit Booking)
- **Endpoint:** `POST /api/v1/appointments`
- **Header:** Cần gửi Access Token (Bearer).
- **Body gửi đi:**
```json
{
  "serviceIds": [1, 5],
  "staffId": 2, // Gửi null nếu chọn form "Bất kì thợ nào"
  "apptDate": "2026-04-10",
  "startTime": "08:30:00",
  "note": "Xin vui lòng cắt tông đơ nhẹ"
}
```

---

## 4. Flow Quản Lý Lịch Hẹn Chứa Của User

### 4.1. Lấy danh sách Lịch đặt của tôi (Có phân trang)
- **Endpoint:** `GET /api/v1/appointments/my-appointments`
- **Query Params:** 
  - `status` (Tuỳ chọn): Lọc theo Trạng thái hẹn. VD: `PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`.
  - `page` (Default = 0)
  - `size` (Default = 10)
- **Ví dụ Response (Lưu ý có chứa Page Metadata):**
```json
"data": {
    "page": 0,
    "size": 10,
    "totalElements": 25,
    "totalPages": 3,
    "content": [
        {
          "id": 101,
          "staffName": "Trần Văn A",
          "apptDate": "2026-04-10",
          "startTime": "08:30:00",
          "totalPrice": 160000,
          "status": "PENDING"
        }
    ]
}
```

### 4.2. Huỷ Lịch (Chỉ tác dụng khi trạng thái là PENDING)
- **Endpoint:** `PUT /api/v1/appointments/{id}/cancel`
- **Body gửi đi (Bắt buộc phải có lý do):**
```json
{
  "cancelReason": "Tôi bận việc đột xuất không đến được"
}
```

---

## 💡 Ghi Chú Dành Cho Đội Frontend

1. **Xử lý Thời Gian (Time):** Các Field backend hứng vào chỉ cần format `HH:mm:ss` (Cho LocalTime) và `YYYY-MM-DD` (Cho LocalDate). Không cần ném cả ISO DateTime dài ngoằng vào nếu không có yêu cầu đặc biệt.
2. **Xử Lý Lỗi API:** Khi có bất kì lỗi nào xảy ra (VD: Chọn sai giờ, Thợ bị trùng giờ), Backend sẽ xuất mã trạng thái HTTP như `400 Bad Request` hoặc `409 Conflict`, JSON nhận được sẽ có `status` và chuỗi câu thông báo ở field `message`. **Frontend chỉ cần lấy field `message` này Toast popup/Alert thẳng cho người xem** mà không cần translate hay mapping mã lỗi cực khổ. 
   - VD: `error.response.data.message` -> *"Khung giờ này đã được đặt hoặc bị khóa"*.
3. **Price Snapshot:** Tiền trên list `my-appointments` đã được backend tự cộng dồn, FE không cần phải mò array service tự tính lấy tổng phí.
