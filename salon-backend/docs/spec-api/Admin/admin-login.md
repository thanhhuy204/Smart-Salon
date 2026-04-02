# Backend API Spec — Đăng nhập Admin Dashboard

**Module:** Admin
**Phiên bản:** 1.0
**Ngày tạo:** 2026-03-27

> **Lưu ý kiến trúc:** Admin KHÔNG có endpoint đăng nhập riêng.
> Admin sử dụng lại `POST /api/v1/auth/login` (xem [auth-login.md](../Auth/auth-login.md)).
> Sự khác biệt nằm ở `role` trong JWT — FE đọc để redirect, BE dùng để bảo vệ endpoint.
>
> File này đặc tả:
> 1. Hành vi login khi role = ADMIN
> 2. Cơ chế bảo vệ toàn bộ `/admin/**` endpoints

---

## PHẦN 1 — Đăng nhập (Reuse auth-login)

### 1. Tổng quan

| Mục | Nội dung |
|-----|----------|
| Endpoint | `POST /api/v1/auth/login` (dùng chung với User) |
| Actor | Quản trị viên (Admin) |
| Auth | **Public** |

### 2. Sự khác biệt so với User Login

| Điều kiện | Kết quả |
|-----------|---------|
| Credentials đúng + `role = ADMIN` | `200 OK` + JWT chứa `"role": "ADMIN"` |
| Credentials đúng + `role = USER` | `200 OK` + JWT chứa `"role": "USER"` (FE xử lý redirect) |
| Credentials sai | `401` — cùng message `"Email hoặc mật khẩu không chính xác"` |
| Tài khoản bị khóa | `403` — `"Tài khoản đã bị khóa. Vui lòng liên hệ quản trị cấp cao"` |

> BE không phân biệt "admin login" vs "user login" — chỉ trả đúng `role` trong JWT.
> FE đọc `role` từ response: `ADMIN` → redirect `/admin`, `USER` → redirect `/`.

### 3. Response khi Admin đăng nhập thành công — `200 OK`

```json
{
  "status": 200,
  "message": "Đăng nhập thành công",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
    "tokenType": "Bearer",
    "user": {
      "id": 2,
      "fullName": "Admin Salon",
      "email": "admin@salon.com",
      "phone": "0900000000",
      "avatarUrl": null,
      "role": "ADMIN"
    }
  }
}
```

---

## PHẦN 2 — Bảo vệ Admin Endpoints

### 1. Tổng quan

| Mục | Nội dung |
|-----|----------|
| Mục tiêu | Đảm bảo mọi endpoint `/api/v1/admin/**` chỉ ADMIN mới gọi được |
| Actor | Quản trị viên (Admin) |
| Auth | **JWT Required + Role ADMIN** |
| Cơ chế | `JwtAuthFilter` xác thực token → `@PreAuthorize("hasRole('ADMIN')")` kiểm tra role |

### 2. Luồng xác thực mỗi request đến `/admin/**`

```
Request đến /api/v1/admin/**
  │
  ├─► [1] JwtAuthFilter kiểm tra Authorization header
  │         ├─► Không có token / sai format → 401 "Vui lòng đăng nhập"
  │         └─► Token hết hạn → 401 "Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại"
  │
  ├─► [2] Parse và validate JWT
  │         └─► Token không hợp lệ (chữ ký sai, bị giả mạo) → 401
  │
  ├─► [3] Kiểm tra role trong JWT payload
  │         └─► role ≠ ADMIN → 403 "Bạn không có quyền truy cập khu vực quản trị"
  │
  └─► [4] Cho phép request tiếp tục đến Controller
```

### 3. Response lỗi chuẩn

| HTTP | Message | Trường hợp |
|------|---------|------------|
| `401` | `"Vui lòng đăng nhập"` | Không có JWT header |
| `401` | `"Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại"` | JWT hết hạn |
| `401` | `"Token không hợp lệ"` | JWT bị giả mạo / sai chữ ký |
| `403` | `"Bạn không có quyền truy cập khu vực quản trị"` | JWT hợp lệ nhưng role = USER |

### 4. Cấu hình Spring Security

```
SecurityConfig:
  - /api/v1/auth/**          → permitAll()
  - /api/v1/admin/**         → hasRole('ADMIN')
  - /api/v1/**               → authenticated()

Controller admin:
  - @PreAuthorize("hasRole('ADMIN')") ở class hoặc method level
```

### 5. JWT Payload

```json
{
  "userId": 2,
  "role": "ADMIN",
  "iat": 1711500000,
  "exp": 1711586400
}
```

---

## PHẦN 3 — Acceptance Criteria (Backend)

```
AC-BE-01: Admin đăng nhập thành công

Given  Tài khoản có email "admin@salon.com", role=ADMIN, is_active=TRUE
When   POST /api/v1/auth/login với credentials đúng
Then   HTTP 200, data.user.role = "ADMIN"
       JWT payload chứa role = "ADMIN"
```

```
AC-BE-02: USER đăng nhập — nhận role USER trong JWT

Given  Tài khoản có role=USER
When   POST /api/v1/auth/login với credentials đúng
Then   HTTP 200, data.user.role = "USER"
       JWT payload chứa role = "USER"
```

```
AC-BE-03: USER gọi admin endpoint bị chặn

Given  JWT hợp lệ với role = "USER"
When   GET /api/v1/admin/appointments (hoặc bất kỳ admin endpoint nào)
Then   HTTP 403, message "Bạn không có quyền truy cập khu vực quản trị"
```

```
AC-BE-04: Không có JWT gọi admin endpoint

Given  Request không có Authorization header
When   GET /api/v1/admin/appointments
Then   HTTP 401, message "Vui lòng đăng nhập"
```

```
AC-BE-05: JWT hết hạn gọi admin endpoint

Given  JWT đã hết hạn (exp < now)
When   GET /api/v1/admin/appointments
Then   HTTP 401, message "Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại"
```

```
AC-BE-06: Admin bị khóa không đăng nhập được

Given  Tài khoản Admin có is_active = FALSE
When   POST /api/v1/auth/login
Then   HTTP 403, message "Tài khoản đã bị khóa. Vui lòng liên hệ quản trị cấp cao"
```

```
AC-BE-07: Admin gọi admin endpoint thành công

Given  JWT hợp lệ với role = "ADMIN", chưa hết hạn
When   GET /api/v1/admin/appointments
Then   HTTP 200, dữ liệu trả về bình thường
```

---

## PHẦN 4 — Mapping Business Spec → API Spec

| Business Requirement | Thể hiện trong API Spec |
|---------------------|------------------------|
| BR-ADMIN-01: Chỉ ADMIN vào /admin | Phần 2 §2: `hasRole('ADMIN')`, AC-BE-03 |
| BR-ADMIN-02: Admin không tự đăng ký | Không có endpoint tạo admin công khai (xử lý ở DB seed) |
| BR-ADMIN-03: Message lỗi chung khi sai credentials | Phần 1 §2, kế thừa từ auth-login §4 |
| BR-ADMIN-04: Phiên có thời hạn | JWT `exp`, AC-BE-05 |
| BR-ADMIN-05: Admin vào /auth/login → redirect /admin | Xử lý ở FE dựa trên `role` trong response |
| BR-ADMIN-06: Mọi trang /admin phải bảo vệ | Phần 2 §4: SecurityConfig + @PreAuthorize |
