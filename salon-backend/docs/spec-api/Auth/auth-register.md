# Backend API Spec — Đăng ký tài khoản

**Module:** Auth
**Endpoint:** `POST /api/v1/auth/register`
**Phiên bản:** 1.0
**Ngày tạo:** 2026-03-27

---

## 1. Tổng quan API

| Mục | Nội dung |
|-----|----------|
| Mục tiêu | Tạo tài khoản USER mới, trả về JWT để tự động đăng nhập |
| Actor | Khách vãng lai (chưa đăng nhập) |
| Auth | **Public** — không yêu cầu JWT |

---

## 2. API Endpoint

| Thuộc tính | Giá trị |
|------------|---------|
| Method | `POST` |
| Path | `/api/v1/auth/register` |
| Auth required | Không |
| Content-Type | `application/json` |

---

## 3. Request

**Request Body:**

| Trường | Kiểu | Bắt buộc | Mô tả |
|--------|------|----------|-------|
| `fullName` | `String` | ✅ | Họ và tên người dùng |
| `email` | `String` | ✅ | Email đăng nhập |
| `phone` | `String` | ✅ | Số điện thoại 10 chữ số |
| `password` | `String` | ✅ | Mật khẩu, tối thiểu 6 ký tự |
| `confirmPassword` | `String` | ✅ | Phải khớp với `password` |

**Request mẫu:**
```json
{
  "fullName": "Nguyễn Văn A",
  "email": "nguyenvana@gmail.com",
  "phone": "0912345678",
  "password": "abc123",
  "confirmPassword": "abc123"
}
```

---

## 4. Validation Rules

| Trường | Rule | Thông báo lỗi | HTTP |
|--------|------|---------------|------|
| `fullName` | Không được trống / chỉ toàn khoảng trắng | `"Họ tên không được để trống"` | `400` |
| `fullName` | Tối đa 100 ký tự | `"Họ tên không được vượt quá 100 ký tự"` | `400` |
| `email` | Không được trống | `"Email không được để trống"` | `400` |
| `email` | Đúng định dạng email | `"Email không đúng định dạng"` | `400` |
| `email` | Tối đa 150 ký tự | `"Email không được vượt quá 150 ký tự"` | `400` |
| `email` | Chưa tồn tại trong DB | `"Email này đã được sử dụng"` | `409` |
| `phone` | Không được trống | `"Số điện thoại không được để trống"` | `400` |
| `phone` | Đúng 10 chữ số, bắt đầu bằng `0` | `"Số điện thoại không hợp lệ (10 chữ số, bắt đầu bằng 0)"` | `400` |
| `phone` | Chưa tồn tại trong DB | `"Số điện thoại này đã được sử dụng"` | `409` |
| `password` | Không được trống | `"Mật khẩu không được để trống"` | `400` |
| `password` | Tối thiểu 6 ký tự | `"Mật khẩu phải có ít nhất 6 ký tự"` | `400` |
| `confirmPassword` | Không được trống | `"Xác nhận mật khẩu không được để trống"` | `400` |
| `confirmPassword` | Phải khớp `password` | `"Mật khẩu xác nhận không khớp"` | `400` |

**Thứ tự validate:** `presence → format → business rules → DB check`

> `confirmPassword` kiểm tra khớp sau khi cả hai trường đã pass format check.
> `email` và `phone` được trim trước khi validate.

---

## 5. Business Logic

```
POST /api/v1/auth/register
  │
  ├─► [1] Trim email, phone (loại khoảng trắng đầu/cuối)
  │
  ├─► [2] Validate request body
  │         ├─► fullName: not blank, max 100
  │         ├─► email: not blank, format, max 150
  │         ├─► phone: not blank, regex ^0\d{9}$
  │         ├─► password: not blank, min 6
  │         └─► confirmPassword == password
  │                   └─► Lỗi bất kỳ → 400
  │
  ├─► [3] Kiểm tra unique trong DB
  │         ├─► email đã tồn tại? → 409
  │         └─► phone đã tồn tại? → 409
  │
  ├─► [4] Tạo tài khoản
  │         ├─► Hash password bằng BCrypt
  │         ├─► Gán role_id = 1 (USER) — cố định, không nhận từ request
  │         └─► INSERT vào bảng users
  │
  ├─► [5] Phát sinh JWT
  │         └─► Tạo access token với payload: userId, role
  │
  └─► [6] Trả về response 201 + token
```

---

## 6. Response

### Thành công — `201 Created`

```json
{
  "status": 201,
  "message": "Đăng ký thành công",
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

**Trường KHÔNG trả về:** `password`, `passwordHash`, `roleId`, `isActive`

---

### Lỗi

| HTTP | Message | Trường hợp |
|------|---------|------------|
| `400` | `"Họ tên không được để trống"` | fullName trống |
| `400` | `"Email không đúng định dạng"` | Email sai format |
| `400` | `"Số điện thoại không hợp lệ (10 chữ số, bắt đầu bằng 0)"` | Phone sai format |
| `400` | `"Mật khẩu phải có ít nhất 6 ký tự"` | Password < 6 ký tự |
| `400` | `"Mật khẩu xác nhận không khớp"` | confirmPassword ≠ password |
| `409` | `"Email này đã được sử dụng"` | Email đã tồn tại trong DB |
| `409` | `"Số điện thoại này đã được sử dụng"` | Phone đã tồn tại trong DB |
| `500` | `"Lỗi hệ thống, vui lòng thử lại"` | DB lỗi, lỗi hash,... |

---

## 7. Database

**Bảng tác động:** `users` — `INSERT`

| Cột | Giá trị | Ghi chú |
|-----|---------|---------|
| `full_name` | `request.fullName.trim()` | |
| `email` | `request.email.trim().toLowerCase()` | UNIQUE |
| `phone` | `request.phone.trim()` | UNIQUE |
| `password_hash` | `BCrypt.hash(request.password)` | BCryptPasswordEncoder |
| `avatar_url` | `NULL` | |
| `role_id` | `1` | Luôn là USER, không lấy từ request |
| `is_active` | `TRUE` | |

**Trường KHÔNG lưu vào DB:** `confirmPassword`

**Constraint cần lưu ý:**
- `email` — `UNIQUE` → bắt `DataIntegrityViolationException` → trả `409`
- `phone` — `UNIQUE` → bắt `DataIntegrityViolationException` → trả `409`
- `role_id` — FK → `roles(id)`, NOT NULL

---

## 8. Security & Phân quyền

- Endpoint **Public** — không cần JWT
- **Không** có `@PreAuthorize`
- `role_id` luôn được hardcode = `1` (USER) trong service — không đọc từ request body → tránh privilege escalation
- JWT payload: `{ "userId": 1, "role": "USER" }`
- Response **không** chứa `password_hash` hay bất kỳ thông tin nhạy cảm nào

---

## 9. Edge Cases

| Tình huống | Xử lý |
|------------|-------|
| Email/phone có khoảng trắng đầu/cuối | Trim trước khi validate và lưu DB |
| Tên chỉ có khoảng trắng | `@NotBlank` bắt được → 400 |
| DB timeout khi INSERT | Trả `500`, log lỗi chi tiết server-side |
| Race condition: 2 request cùng email đồng thời | DB UNIQUE constraint chặn → bắt exception → 409 |
| `confirmPassword` không gửi lên | `@NotBlank` → 400 |

---

## 10. Acceptance Criteria (Backend)

```
AC-BE-01: Đăng ký thành công

Given  Không có tài khoản nào với email "a@gmail.com" và phone "0912345678"
When   POST /api/v1/auth/register với body hợp lệ
Then   HTTP 201, response chứa accessToken và thông tin user
       DB: 1 bản ghi mới trong bảng users với role_id=1, is_active=true
```

```
AC-BE-02: Email đã tồn tại

Given  Email "a@gmail.com" đã có trong bảng users
When   POST /api/v1/auth/register với email "a@gmail.com"
Then   HTTP 409, message "Email này đã được sử dụng"
       DB: không có bản ghi mới
```

```
AC-BE-03: Số điện thoại đã tồn tại

Given  Phone "0912345678" đã có trong bảng users
When   POST /api/v1/auth/register với phone "0912345678"
Then   HTTP 409, message "Số điện thoại này đã được sử dụng"
       DB: không có bản ghi mới
```

```
AC-BE-04: Mật khẩu xác nhận không khớp

Given  Request body có password="abc123", confirmPassword="abc456"
When   POST /api/v1/auth/register
Then   HTTP 400, message "Mật khẩu xác nhận không khớp"
       DB: không có bản ghi mới
```

```
AC-BE-05: Bỏ trống trường bắt buộc

Given  Request body thiếu fullName (null hoặc "  ")
When   POST /api/v1/auth/register
Then   HTTP 400, message "Họ tên không được để trống"
```

```
AC-BE-06: Phone sai định dạng

Given  Request body có phone = "091234" (6 chữ số)
When   POST /api/v1/auth/register
Then   HTTP 400, message "Số điện thoại không hợp lệ (10 chữ số, bắt đầu bằng 0)"
```

```
AC-BE-07: Role không thể tự set thành ADMIN

Given  Request body hợp lệ, thêm field "role": "ADMIN"
When   POST /api/v1/auth/register
Then   HTTP 201, tài khoản được tạo với role=USER (field "role" trong request bị bỏ qua)
```

```
AC-BE-08: Không expose password trong response

Given  Đăng ký thành công
When   POST /api/v1/auth/register
Then   Response body không chứa bất kỳ field nào liên quan đến password
```

---

## 11. Mapping Business Spec → API Spec

| Business Requirement | Thể hiện trong API Spec |
|---------------------|------------------------|
| BR-REG-01: Email valid + unique | Validation §4, DB check §5[3], AC-BE-02 |
| BR-REG-02: Phone 10 số, bắt đầu 0, unique | Validation §4 regex, AC-BE-03, AC-BE-06 |
| BR-REG-03: Password min 6 ký tự | Validation §4, AC-BE-05 |
| BR-REG-04: confirmPassword phải khớp | Validation §4, AC-BE-04 |
| BR-REG-05: Luôn gán role USER | Business Logic §5[4], Security §8, AC-BE-07 |
| BR-REG-06: Auto login sau đăng ký | Response trả `accessToken`, §5[5] |
| Email/phone trim khoảng trắng | Business Logic §5[1], Edge Cases §9 |
| Không expose password | Response §6, Security §8, AC-BE-08 |
