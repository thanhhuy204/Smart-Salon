# Kỹ năng: Spec Sync — Kiểm tra Business Spec ↔ Code

## Nguyên tắc cốt lõi
> **Business Spec là nguồn sự thật.** Nếu có sai lệch, cập nhật code để khớp Business Spec — không làm ngược lại.

---

## Quy trình bắt buộc

### Bước 1 — Xác định phạm vi
- Nếu user chỉ định module → chỉ kiểm tra module đó
- Nếu không chỉ định → kiểm tra toàn bộ 12 module

### Bước 2 — So sánh theo tiêu chí

| Tiêu chí            | Kiểm tra                                                        |
|---------------------|-----------------------------------------------------------------|
| **API Endpoints**   | BE có đủ endpoint theo nghiệp vụ không?                        |
| **Request/Response**| DTO có đủ fields không?                                         |
| **Status Flow**     | Trạng thái có được handle đúng không?                          |
| **Phân quyền**      | USER/ADMIN được enforce đúng chưa?                              |
| **Business Rules**  | Các rule đặc thù có được implement không?                       |
| **UI Flow**         | Angular có đủ bước theo nghiệp vụ không?                        |

### Bước 3 — Phân loại lệch

| Ký hiệu         | Định nghĩa                                               |
|-----------------|----------------------------------------------------------|
| 🔴 MISSING      | Thiếu hoàn toàn — chưa có API/component/rule             |
| 🟠 CONFLICT     | Implement sai so với Business Spec                       |
| 🟡 INCOMPLETE   | Có nhưng chưa handle hết cases                           |
| ✅ OK           | Khớp Business Spec                                       |

---

## Business Rules đặc thù cần kiểm tra

### Module Booking
| Rule | BE kiểm tra | FE kiểm tra |
|------|-------------|-------------|
| User chỉ hủy lịch khi `PENDING` | `AppointmentServiceImpl.cancelByUser()` check status | Nút "Hủy" ẩn khi status ≠ PENDING |
| Admin hủy được mọi trạng thái | `cancelByAdmin()` không check status | Admin UI luôn hiện nút hủy |
| Đánh giá thợ chỉ sau `COMPLETED` | Check `appointment.status == COMPLETED` | Form đánh giá chỉ hiện sau COMPLETED |
| 1 lịch chỉ được đánh giá 1 lần | `staff_reviews.appointment_id UNIQUE` | Ẩn form nếu đã đánh giá |

### Module Sales
| Rule | BE kiểm tra | FE kiểm tra |
|------|-------------|-------------|
| User chỉ hủy đơn khi `PENDING` | `OrderServiceImpl.cancelByUser()` check status | Nút "Hủy đơn" ẩn khi status ≠ PENDING |
| Trừ `stock_qty` khi đặt hàng | `products.stock_qty -= quantity` | Hiển thị số lượng tồn kho |
| Hoàn `stock_qty` khi hủy đơn | Hoàn lại khi `status = CANCELLED` | — |
| Đánh giá sản phẩm chỉ sau `COMPLETED` | Check `order.status == COMPLETED` | Form đánh giá chỉ hiện sau COMPLETED |
| `price_snapshot` lưu đúng giá lúc mua | `order_items.price_snapshot = product.price` | Hiển thị giá tại thời điểm mua |

---

## Output báo cáo

```
## Kết quả Spec Sync — [Module Name]

### Tổng quan
- Tổng items: X | ✅ OK: X | 🔴 MISSING: X | 🟠 CONFLICT: X | 🟡 INCOMPLETE: X

### Backend — [module]
| # | Mức độ | Vấn đề | Gợi ý fix |
|---|--------|--------|-----------|
| 1 | 🔴 MISSING | Thiếu PATCH /appointments/{id}/complete | Thêm vào AppointmentController |
| 2 | 🟠 CONFLICT | User hủy được lịch CONFIRMED — sai spec | Check status == PENDING trước khi hủy |

### Frontend — [module]
| # | Mức độ | Vấn đề | Gợi ý fix |
|---|--------|--------|-----------|
| 1 | 🟡 INCOMPLETE | my-appointments chưa hiển thị cancel_reason | Thêm vào template |
```

---

## Câu lệnh kích hoạt

`spec-sync`, `check-spec`, `kiểm tra spec`, `đồng bộ spec`

Ví dụ:
- `/spec-sync` — kiểm tra toàn bộ
- `/spec-sync Booking` — chỉ module đặt lịch
- `/spec-sync Sales` — chỉ module bán hàng
- `/spec-sync Auth` — chỉ module xác thực