# Prompt: Business Spec → Backend API Spec

---
Bạn là một **Backend Architect** chuyên Spring Boot + MySQL.

Hãy chuyển đổi Business Spec dưới đây thành **Backend API Spec** chi tiết.

---

## Yêu cầu đầu ra

### 1. Tổng quan API

* Mục tiêu của API này là gì?
* Actor nào gọi API này? (USER / ADMIN / System)
* API có yêu cầu xác thực không? (Public / JWT Required / Admin only)

---

### 2. API Endpoint

Định nghĩa rõ:

| Thuộc tính       | Giá trị                          |
|------------------|----------------------------------|
| Method           | GET / POST / PUT / PATCH / DELETE |
| Path             | `/api/v1/...`                    |
| Auth required    | Không / JWT / ADMIN              |
| Content-Type     | `application/json`               |

---

### 3. Request

* **Path Variables** (nếu có): `{id}`, `{slug}`...
* **Query Parameters** (nếu có): `page`, `size`, `status`...
* **Request Body** (nếu có):
  * Liệt kê từng trường: tên, kiểu, bắt buộc/tùy chọn, mô tả
  * Ví dụ JSON request mẫu

---

### 4. Validation Rules

Với **mỗi trường** trong request, liệt kê đầy đủ:

| Rule             | Thông báo lỗi (tiếng Việt / EN) | HTTP Status |
|------------------|----------------------------------|-------------|
| Không được trống | `"X is required"`               | `400`       |
| Sai định dạng    | `"Invalid X format"`            | `400`       |
| Unique vi phạm   | `"X already exists"`            | `400/409`   |

**Thứ tự validate:**
> field presence → format → business rules → DB check

---

### 5. Business Logic (Flow xử lý)

Mô tả từng bước xử lý theo dạng tree:

```
POST /api/v1/...
  │
  ├─► [1] Validate request body
  │         └─► Lỗi → 400
  │
  ├─► [2] Kiểm tra business rule (unique, ownership, trạng thái...)
  │         └─► Vi phạm → 400 / 403 / 409
  │
  ├─► [3] Thực hiện logic chính
  │         ├─► Tính toán / transform data
  │         └─► Tương tác DB (INSERT / UPDATE / SELECT)
  │
  ├─► [4] Side effects (nếu có)
  │         ├─► Gửi notification
  │         ├─► Trừ stock_qty
  │         └─► Ghi lịch sử giao dịch
  │
  └─► [5] Trả về response
            └─► 200 / 201 / 204
```

---

### 6. Response

#### Thành công
* HTTP Status Code + ý nghĩa (200 OK / 201 Created / 204 No Content)
* Response body mẫu (JSON đầy đủ)
* Trường nào **KHÔNG được** trả về (password, sensitive data...)

#### Lỗi
Liệt kê tất cả trường hợp lỗi có thể xảy ra:

| HTTP Status | Message                  | Trường hợp xảy ra          |
|-------------|--------------------------|----------------------------|
| `400`       | `"X is required"`        | Thiếu field bắt buộc       |
| `401`       | `"Unauthorized"`         | Thiếu / hết hạn JWT        |
| `403`       | `"Forbidden"`            | Sai role, sai ownership    |
| `404`       | `"X not found"`          | Không tìm thấy resource    |
| `409`       | `"X already exists"`     | Unique constraint vi phạm  |
| `500`       | `"Internal server error"`| Lỗi hệ thống               |

---

### 7. Database

* **Bảng bị tác động**: tên bảng + thao tác (INSERT / UPDATE / SELECT / DELETE)
* **Các trường được ghi vào DB**: tên cột, giá trị, ghi chú
* **Index / Constraint cần lưu ý**: UNIQUE, FK, NOT NULL...
* **Trường KHÔNG lưu vào DB**: (ví dụ: `confirmPassword`)

---

### 8. Security & Phân quyền

* JWT payload cần những field nào? (`userId`, `role`...)
* Endpoint có kiểm tra ownership không?
  * Ví dụ: User chỉ được hủy lịch của **chính mình**
* Sensitive field nào cần ẩn khỏi response?
* Cần `@PreAuthorize` gì? (`hasRole('ADMIN')`, `hasRole('USER')`)

---

### 9. Edge Cases

Liệt kê **mọi tình huống bất thường** và cách xử lý:

| Tình huống                          | Xử lý                             |
|-------------------------------------|-----------------------------------|
| DB timeout / connection lỗi         | Trả `500`, log lỗi               |
| Duplicate request (idempotency)     | Trả lỗi hoặc bỏ qua tùy nghiệp vụ|
| Business rule bị vi phạm            | Trả `400` / `409` + message rõ   |
| User truy cập resource của người khác| Trả `403 Forbidden`             |

---

### 10. Acceptance Criteria (Backend)

Với **mỗi scenario**, viết theo chuẩn:

```
AC-BE-01: [Tên scenario]

Given  [điều kiện đầu vào]
When   [hành động: gọi API nào]
Then   [kết quả mong đợi: HTTP status, response body, DB state]
```

Phải cover đủ:
- ✅ Happy path (thành công)
- ❌ Validation errors (từng trường)
- ❌ Business rule violations
- ❌ Auth / Authorization failures
- ❌ Not found cases
- ❌ Server error

---

### 11. Mapping Business Spec → API Spec

Mỗi yêu cầu trong Business Spec phải được thể hiện rõ ở đây:

| Business Requirement          | Thể hiện trong API Spec tại        |
|-------------------------------|------------------------------------|
| User chỉ hủy khi PENDING      | Business Logic bước [2], AC-BE-02 |
| Gửi thông báo sau khi đặt lịch| Business Logic bước [4] side effect|
| Không expose password         | Response section + AC-BE-07        |

---

## Lưu ý quan trọng

- Validate **độc lập với FE** — BE phải tự validate hoàn toàn
- Không expose thông tin nhạy cảm trong response (password, internal ID logic...)
- Thứ tự validate: **presence → format → business rules → DB**
- Side effects (notification, stock update...) thực hiện **sau** khi DB commit thành công
- Dùng `ApiResponse<T>` wrapper: `{ status, message, data }`
- Pagination dùng `PageResponse<T>`: `{ content, page, size, totalElements, totalPages }`

---

## Business Spec:
[ Dán Business Spec vào đây ]

## Thông tin bổ sung (nếu có):
[ Mô tả thêm: module liên quan, bảng DB đã có, constraint đặc biệt... ]