# Backend API Spec — Đăng nhập

**Module:** Auth
**Endpoint:** `POST /api/v1/auth/login`
**Phiên bản:** 1.0
**Ngày tạo:** 2026-03-27

---

## 1. Tổng quan API

| Mục | Nội dung |
|-----|----------|
| Mục tiêu | Xác thực thông tin đăng nhập, trả về JWT token để truy cập hệ thống |
| Actor | Khách vãng lai (đã có tài khoản) |
| Auth | **Public** — không yêu cầu JWT |

---

## 2. API Endpoint

| Thuộc tính | Giá trị |
|------------|---------|
| Method | `POST` |
| Path | `/api/v1/auth/login` |
| Auth required | Không |
| Content-Type | `application/json` |

---

## 3. Request

**Request Body:**

| Trường | Kiểu | Bắt buộc | Mô tả |
|--------|------|----------|-------|
| `email` | `String` | ✅ | Email đã đăng ký |
| `password` | `String` | ✅ | Mật khẩu tài khoản |

**Request mẫu:**
```json
{
  "email": "nguyenvana@gmail.com",
  "password": "abc123"
}
```

---

## 4. Validation Rules

| Trường | Rule | Thông báo lỗi | HTTP |
|--------|------|---------------|------|
| `email` | Không được trống | `"Email không được để trống"` | `400` |
| `email` | Đúng định dạng email | `"Email không đúng định dạng"` | `400` |
| `password` | Không được trống | `"Mật khẩu không được để trống"` | `400` |
| `password` | Tối thiểu 6 ký tự | `"Mật khẩu phải có ít nhất 6 ký tự"` | `400` |
| `email` + `password` | Tài khoản không tồn tại hoặc sai mật khẩu | `"Email hoặc mật khẩu không chính xác"` | `401` |
| `is_active` | Tài khoản bị khóa | `"Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ"` | `403` |

**Thứ tự validate:** `presence → format → DB lookup → password check → account status`

> **Bảo mật:** Lỗi "email không tồn tại" và "sai mật khẩu" trả về cùng một message `"Email hoặc mật khẩu không chính xác"` — tránh email enumeration attack (BR-AUTH-03).

---

## 5. Business Logic

```
POST /api/v1/auth/login
  │
  ├─► [1] Trim email (loại khoảng trắng đầu/cuối)
  │
  ├─► [2] Validate request body
  │         ├─► email: not blank, đúng format
  │         └─► password: not blank, min 6 ký tự
  │                   └─► Lỗi bất kỳ → 400
  │
  ├─► [3] Tìm user theo email trong bảng users
  │         └─► Không tìm thấy → 401 "Email hoặc mật khẩu không chính xác"
  │
  ├─► [4] So sánh password với password_hash (BCrypt)
  │         └─► Không khớp → 401 "Email hoặc mật khẩu không chính xác"
  │
  ├─► [5] Kiểm tra is_active
  │         └─► is_active = FALSE → 403 "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ"
  │
  ├─► [6] Tạo JWT access token
  │         └─► Payload: { userId, role }
  │
  └─► [7] Trả về 200 + token + thông tin user
```

> **Lưu ý thứ tự bước [3] và [5]:** Kiểm tra tài khoản tồn tại trước, sai password sau, khóa tài khoản cuối cùng — đảm bảo message lỗi đúng và nhất quán.

---

## 6. Response

### Thành công — `200 OK`

```json
{
  "status": 200,
  "message": "Đăng nhập thành công",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
    "tokenType": "Bearer",
    "user": {
      "id": 1,
      "fullName": "Nguyễn Văn A",
      "email": "nguyenvana@gmail.com",
      "phone": "0912345678",
      "avatarUrl": null,
      "role": "USER"
    }
  }
}
```

**Trường KHÔNG trả về:** `passwordHash`, `roleId`, `isActive`

---

### Lỗi

| HTTP | Message | Trường hợp |
|------|---------|------------|
| `400` | `"Email không được để trống"` | email null/blank |
| `400` | `"Email không đúng định dạng"` | Email sai format |
| `400` | `"Mật khẩu không được để trống"` | password null/blank |
| `400` | `"Mật khẩu phải có ít nhất 6 ký tự"` | Password < 6 ký tự |
| `401` | `"Email hoặc mật khẩu không chính xác"` | Email không tồn tại hoặc sai mật khẩu |
| `403` | `"Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ"` | is_active = FALSE |
| `500` | `"Lỗi hệ thống, vui lòng thử lại"` | DB lỗi, lỗi JWT... |

---

## 7. Database

**Bảng tác động:** `users` — `SELECT`

| Thao tác | Điều kiện | Mục đích |
|----------|-----------|---------|
| `SELECT *` | `WHERE email = ?` | Tìm tài khoản theo email |

**Trường sử dụng khi xác thực:**

| Cột | Mục đích |
|-----|---------|
| `password_hash` | So sánh với BCrypt |
| `is_active` | Kiểm tra tài khoản có bị khóa không |
| `role_id` | Lấy role để đưa vào JWT payload |

**Không ghi dữ liệu nào vào DB** (đây là read-only operation).

---

## 8. Security & Phân quyền

- Endpoint **Public** — không cần JWT
- Không có `@PreAuthorize`
- **Không phân biệt** message lỗi giữa "email không tồn tại" và "sai mật khẩu" — trả cùng `401` (BR-AUTH-03)
- **Phân biệt** message riêng cho tài khoản bị khóa — `403` (BR-AUTH-04)
- JWT payload: `{ "userId": 1, "role": "USER" }`
- `email` được trim trước khi query DB
- Response **không** chứa `passwordHash` hay `isActive`

---

## 9. Edge Cases

| Tình huống | Xử lý |
|------------|-------|
| Email có khoảng trắng đầu/cuối | Trim trước khi tìm kiếm |
| Password có ký tự đặc biệt (copy-paste) | BCrypt xử lý bình thường, không cần escape |
| Cả hai trường để trống | Trả 400 với lỗi cho từng trường |
| DB timeout | Trả `500`, log lỗi server-side |
| Gửi nhiều request liên tục (brute force) | Xử lý ở tầng rate-limit / gateway (ngoài scope API này) |

---

## 10. Acceptance Criteria (Backend)

```
AC-BE-01: Đăng nhập thành công

Given  User có email "a@gmail.com", password "abc123", is_active=TRUE
When   POST /api/v1/auth/login với body đúng
Then   HTTP 200, data chứa accessToken và thông tin user (không có passwordHash)
```

```
AC-BE-02: Sai mật khẩu — message chung

Given  Email "a@gmail.com" tồn tại trong DB
When   POST /api/v1/auth/login với password sai "wrongpass"
Then   HTTP 401, message "Email hoặc mật khẩu không chính xác"
```

```
AC-BE-03: Email không tồn tại — cùng message với sai password

Given  Email "notexist@gmail.com" chưa đăng ký
When   POST /api/v1/auth/login
Then   HTTP 401, message "Email hoặc mật khẩu không chính xác"
       (không tiết lộ email có tồn tại hay không)
```

```
AC-BE-04: Tài khoản bị khóa

Given  User có is_active=FALSE, email và password đúng
When   POST /api/v1/auth/login
Then   HTTP 403, message "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ"
```

```
AC-BE-05: Email sai định dạng

Given  Request body có email = "abc" (không có @)
When   POST /api/v1/auth/login
Then   HTTP 400, message "Email không đúng định dạng"
```

```
AC-BE-06: Password quá ngắn

Given  Request body có password = "abc" (3 ký tự)
When   POST /api/v1/auth/login
Then   HTTP 400, message "Mật khẩu phải có ít nhất 6 ký tự"
```

```
AC-BE-07: Cả hai trường để trống

Given  Request body có email = "", password = ""
When   POST /api/v1/auth/login
Then   HTTP 400, lỗi cho cả email và password
```

```
AC-BE-08: Email có khoảng trắng — vẫn tìm thấy

Given  User có email "a@gmail.com" trong DB
When   POST /api/v1/auth/login với email "  a@gmail.com  "
Then   HTTP 200, đăng nhập thành công (email đã được trim)
```

```
AC-BE-09: Response không chứa thông tin nhạy cảm

Given  Đăng nhập thành công
When   POST /api/v1/auth/login
Then   Response body không chứa passwordHash, isActive, roleId
```

---

## 11. Mapping Business Spec → API Spec

| Business Requirement | Thể hiện trong API Spec |
|---------------------|------------------------|
| BR-AUTH-01: Email đúng định dạng | Validation §4, AC-BE-05 |
| BR-AUTH-02: Password min 6 ký tự | Validation §4, AC-BE-06 |
| BR-AUTH-03: Message chung khi sai credentials | §4 note, §5[3,4], AC-BE-02, AC-BE-03 |
| BR-AUTH-04: Tài khoản bị khóa không đăng nhập được | §5[5], Response §6, AC-BE-04 |
| BR-AUTH-05: Redirect sau đăng nhập | Xử lý ở FE dựa trên `role` trong response |
| Email trim khoảng trắng | §5[1], Edge Cases §9, AC-BE-08 |
| Không expose thông tin nhạy cảm | Security §8, AC-BE-09 |
