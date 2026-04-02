# Backend API Spec — Quên mật khẩu (Forgot Password)

**Module:** Auth
**Phiên bản:** 1.0
**Ngày tạo:** 2026-03-27

> Luồng gồm **3 bước / 3 API**:
> 1. `POST /api/v1/auth/forgot-password` — Gửi OTP về email
> 2. `POST /api/v1/auth/verify-reset-otp` — Xác thực OTP → nhận reset token
> 3. `POST /api/v1/auth/reset-password` — Đặt mật khẩu mới bằng reset token

---

---

# API 1 — Gửi OTP về email

## 1. Tổng quan

| Mục | Nội dung |
|-----|----------|
| Mục tiêu | Kiểm tra email tồn tại, sinh OTP 6 chữ số và gửi về email người dùng |
| Actor | Khách vãng lai (chưa đăng nhập) |
| Auth | **Public** |

## 2. Endpoint

| Thuộc tính | Giá trị |
|------------|---------|
| Method | `POST` |
| Path | `/api/v1/auth/forgot-password` |
| Auth required | Không |
| Content-Type | `application/json` |

## 3. Request

| Trường | Kiểu | Bắt buộc | Mô tả |
|--------|------|----------|-------|
| `email` | `String` | ✅ | Email đã đăng ký trong hệ thống |

```json
{ "email": "nguyenvana@gmail.com" }
```

## 4. Validation Rules

| Trường | Rule | Thông báo lỗi | HTTP |
|--------|------|---------------|------|
| `email` | Không được trống | `"Email không được để trống"` | `400` |
| `email` | Đúng định dạng email | `"Email không đúng định dạng"` | `400` |
| `email` | Tồn tại trong DB | `"Không tìm thấy tài khoản với email này"` | `404` |

## 5. Business Logic

```
POST /api/v1/auth/forgot-password
  │
  ├─► [1] Validate: email not blank, đúng format
  │         └─► Lỗi → 400
  │
  ├─► [2] Trim email, tìm user theo email trong bảng users
  │         └─► Không tồn tại → 404
  │
  ├─► [3] Xoá các token cũ chưa dùng của user này
  │         └─► DELETE FROM password_reset_tokens WHERE user_id = ? AND is_used = FALSE
  │
  ├─► [4] Sinh OTP 6 chữ số ngẫu nhiên (SecureRandom)
  │         └─► INSERT INTO password_reset_tokens
  │                   token      = OTP (6 chữ số)
  │                   is_used    = FALSE
  │                   expires_at = NOW() + 15 phút
  │
  ├─► [5] Gửi email chứa mã OTP (Spring Mail)
  │         └─► Lỗi gửi mail → log lỗi, vẫn trả 200 (tránh lộ thông tin)
  │
  └─► [6] Trả về 200
```

## 6. Response

### Thành công — `200 OK`

```json
{
  "status": 200,
  "message": "Mã OTP đã được gửi về email của bạn. Vui lòng kiểm tra hộp thư.",
  "data": null
}
```

> Response **không** tiết lộ thêm thông tin (ảnh avatar, tên...) để tránh email enumeration attack.

### Lỗi

| HTTP | Message | Trường hợp |
|------|---------|------------|
| `400` | `"Email không được để trống"` | Thiếu email |
| `400` | `"Email không đúng định dạng"` | Sai format |
| `404` | `"Không tìm thấy tài khoản với email này"` | Email chưa đăng ký |
| `500` | `"Lỗi hệ thống, vui lòng thử lại"` | DB lỗi |

## 7. Database

| Bảng | Thao tác | Ghi chú |
|------|----------|---------|
| `users` | `SELECT` | Tìm theo email |
| `password_reset_tokens` | `DELETE` | Xoá token cũ chưa dùng |
| `password_reset_tokens` | `INSERT` | Lưu OTP mới |

**Trường INSERT vào `password_reset_tokens`:**

| Cột | Giá trị |
|-----|---------|
| `user_id` | `user.id` |
| `token` | OTP 6 chữ số (SecureRandom) |
| `is_used` | `FALSE` |
| `expires_at` | `NOW() + 15 phút` |

## 8. Security

- Không cần JWT
- Dù mail lỗi vẫn trả `200` để tránh lộ email hợp lệ qua timing attack
- OTP sinh bằng `SecureRandom` (không dùng `Math.random()`)

## 9. Edge Cases

| Tình huống | Xử lý |
|------------|-------|
| Gửi request liên tục nhiều lần | Xoá token cũ, sinh token mới — chỉ token cuối có hiệu lực |
| Email lỗi SMTP | Log lỗi server-side, trả `200` như thường |
| Email có khoảng trắng đầu/cuối | Trim trước khi tìm kiếm |

## 10. Acceptance Criteria

```
AC-BE-01: Gửi OTP thành công

Given  Email "a@gmail.com" tồn tại trong bảng users
When   POST /api/v1/auth/forgot-password với body { "email": "a@gmail.com" }
Then   HTTP 200, message "Mã OTP đã được gửi..."
       DB: 1 bản ghi mới trong password_reset_tokens, is_used=false, expires_at = now+15m
       Email được gửi tới "a@gmail.com"
```

```
AC-BE-02: Email không tồn tại

Given  Email "unknown@gmail.com" chưa đăng ký
When   POST /api/v1/auth/forgot-password
Then   HTTP 404, message "Không tìm thấy tài khoản với email này"
       DB: không có bản ghi mới
```

```
AC-BE-03: Gửi lại OTP — token cũ bị xoá

Given  Đã có token chưa dùng cho user X
When   POST /api/v1/auth/forgot-password lần 2
Then   HTTP 200, token cũ bị xoá, token mới được tạo
```

---

---

# API 2 — Xác thực OTP

## 1. Tổng quan

| Mục | Nội dung |
|-----|----------|
| Mục tiêu | Kiểm tra OTP hợp lệ, trả về `resetToken` (UUID) để thực hiện bước đặt mật khẩu |
| Actor | Khách vãng lai |
| Auth | **Public** |

## 2. Endpoint

| Thuộc tính | Giá trị |
|------------|---------|
| Method | `POST` |
| Path | `/api/v1/auth/verify-reset-otp` |
| Auth required | Không |
| Content-Type | `application/json` |

## 3. Request

| Trường | Kiểu | Bắt buộc | Mô tả |
|--------|------|----------|-------|
| `email` | `String` | ✅ | Email đã yêu cầu OTP |
| `otp` | `String` | ✅ | Mã OTP 6 chữ số nhận qua email |

```json
{
  "email": "nguyenvana@gmail.com",
  "otp": "847291"
}
```

## 4. Validation Rules

| Trường | Rule | Thông báo lỗi | HTTP |
|--------|------|---------------|------|
| `email` | Không được trống, đúng format | `"Email không hợp lệ"` | `400` |
| `otp` | Không được trống | `"Mã OTP không được để trống"` | `400` |
| `otp` | Đúng 6 chữ số | `"Mã OTP không hợp lệ"` | `400` |
| `otp` | Khớp với token trong DB, chưa dùng, chưa hết hạn | `"Mã OTP không đúng hoặc đã hết hạn"` | `400` |

## 5. Business Logic

```
POST /api/v1/auth/verify-reset-otp
  │
  ├─► [1] Validate: email not blank + format, otp not blank + 6 chữ số
  │         └─► Lỗi → 400
  │
  ├─► [2] Tìm user theo email
  │         └─► Không tồn tại → 404
  │
  ├─► [3] Tìm token trong password_reset_tokens
  │         WHERE user_id = ? AND token = ? AND is_used = FALSE
  │         └─► Không tìm thấy → 400 "Mã OTP không đúng hoặc đã hết hạn"
  │
  ├─► [4] Kiểm tra expires_at > NOW()
  │         └─► Hết hạn → 400 "Mã OTP không đúng hoặc đã hết hạn"
  │
  ├─► [5] Cập nhật token thành UUID reset token
  │         UPDATE password_reset_tokens
  │           SET token      = UUID()   -- reset token mới
  │               expires_at = NOW() + 15 phút
  │         WHERE id = ?
  │         (is_used vẫn = FALSE — chỉ đánh dấu used sau khi đặt mật khẩu xong)
  │
  └─► [6] Trả về 200 + resetToken
```

## 6. Response

### Thành công — `200 OK`

```json
{
  "status": 200,
  "message": "Xác thực thành công",
  "data": {
    "resetToken": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Lỗi

| HTTP | Message | Trường hợp |
|------|---------|------------|
| `400` | `"Mã OTP không được để trống"` | otp null/blank |
| `400` | `"Mã OTP không hợp lệ"` | otp không phải 6 chữ số |
| `400` | `"Mã OTP không đúng hoặc đã hết hạn"` | OTP sai / hết hạn / đã dùng |
| `404` | `"Không tìm thấy tài khoản với email này"` | Email không tồn tại |
| `500` | `"Lỗi hệ thống, vui lòng thử lại"` | DB lỗi |

## 7. Database

| Bảng | Thao tác | Ghi chú |
|------|----------|---------|
| `users` | `SELECT` | Tìm theo email |
| `password_reset_tokens` | `SELECT` | Tìm OTP hợp lệ |
| `password_reset_tokens` | `UPDATE` | Đổi token → UUID, gia hạn expires_at |

## 8. Security

- `resetToken` (UUID) chỉ có hiệu lực 15 phút
- Không phân biệt "OTP sai" hay "OTP hết hạn" trong message trả về → tránh lộ thông tin
- Client phải lưu `resetToken` tạm thời để dùng ở API 3

## 9. Edge Cases

| Tình huống | Xử lý |
|------------|-------|
| Nhập OTP sai nhiều lần | Mỗi lần trả 400, không lock account (có thể giới hạn rate-limit ở sau) |
| OTP vừa hết hạn đúng lúc request | Kiểm tra `expires_at > NOW()` → 400 |
| Gọi API 2 hai lần với cùng OTP | Lần 1 thành công, token đã thành UUID; lần 2 tìm OTP cũ → không thấy → 400 |

## 10. Acceptance Criteria

```
AC-BE-04: Xác thực OTP thành công

Given  Token hợp lệ với otp="847291", chưa dùng, chưa hết hạn
When   POST /api/v1/auth/verify-reset-otp với email + otp đúng
Then   HTTP 200, data.resetToken là UUID
       DB: token trong password_reset_tokens đổi thành UUID, expires_at gia hạn
```

```
AC-BE-05: OTP sai

Given  User có token otp="847291"
When   POST /api/v1/auth/verify-reset-otp với otp="000000"
Then   HTTP 400, message "Mã OTP không đúng hoặc đã hết hạn"
```

```
AC-BE-06: OTP hết hạn

Given  Token tồn tại nhưng expires_at < NOW()
When   POST /api/v1/auth/verify-reset-otp với otp đúng
Then   HTTP 400, message "Mã OTP không đúng hoặc đã hết hạn"
```

---

---

# API 3 — Đặt mật khẩu mới

## 1. Tổng quan

| Mục | Nội dung |
|-----|----------|
| Mục tiêu | Nhận `resetToken` hợp lệ và mật khẩu mới, cập nhật mật khẩu, gửi thông báo |
| Actor | Khách vãng lai (đã qua bước xác thực OTP) |
| Auth | **Public** |

## 2. Endpoint

| Thuộc tính | Giá trị |
|------------|---------|
| Method | `POST` |
| Path | `/api/v1/auth/reset-password` |
| Auth required | Không |
| Content-Type | `application/json` |

## 3. Request

| Trường | Kiểu | Bắt buộc | Mô tả |
|--------|------|----------|-------|
| `resetToken` | `String` | ✅ | UUID nhận được từ API 2 |
| `newPassword` | `String` | ✅ | Mật khẩu mới |

```json
{
  "resetToken": "550e8400-e29b-41d4-a716-446655440000",
  "newPassword": "MyPass@123"
}
```

## 4. Validation Rules

| Trường | Rule | Thông báo lỗi | HTTP |
|--------|------|---------------|------|
| `resetToken` | Không được trống | `"Reset token không hợp lệ"` | `400` |
| `resetToken` | Tồn tại trong DB, chưa dùng, chưa hết hạn | `"Phiên đặt lại mật khẩu không hợp lệ hoặc đã hết hạn"` | `400` |
| `newPassword` | Không được trống | `"Mật khẩu mới không được để trống"` | `400` |
| `newPassword` | Tối thiểu 8 ký tự, có chữ cái + số + ký tự đặc biệt | `"Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ cái, số và ký tự đặc biệt"` | `400` |

**Regex newPassword:** `^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$`

## 5. Business Logic

```
POST /api/v1/auth/reset-password
  │
  ├─► [1] Validate: resetToken not blank, newPassword not blank + regex
  │         └─► Lỗi → 400
  │
  ├─► [2] Tìm token trong password_reset_tokens
  │         WHERE token = ? AND is_used = FALSE
  │         └─► Không tìm thấy → 400
  │
  ├─► [3] Kiểm tra expires_at > NOW()
  │         └─► Hết hạn → 400
  │
  ├─► [4] Hash mật khẩu mới bằng BCrypt
  │
  ├─► [5] Cập nhật mật khẩu user
  │         UPDATE users SET password_hash = ? WHERE id = token.user_id
  │
  ├─► [6] Đánh dấu token đã dùng
  │         UPDATE password_reset_tokens SET is_used = TRUE WHERE id = ?
  │
  ├─► [7] Side effects (sau khi DB commit)
  │         └─► INSERT notifications: type=PASSWORD_CHANGED, user_id=?
  │
  └─► [8] Trả về 200
```

## 6. Response

### Thành công — `200 OK`

```json
{
  "status": 200,
  "message": "Mật khẩu đã được thay đổi thành công!",
  "data": null
}
```

### Lỗi

| HTTP | Message | Trường hợp |
|------|---------|------------|
| `400` | `"Reset token không hợp lệ"` | resetToken trống/null |
| `400` | `"Phiên đặt lại mật khẩu không hợp lệ hoặc đã hết hạn"` | Token không tồn tại / đã dùng / hết hạn |
| `400` | `"Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ cái, số và ký tự đặc biệt"` | Password yếu |
| `500` | `"Lỗi hệ thống, vui lòng thử lại"` | DB lỗi |

## 7. Database

| Bảng | Thao tác | Ghi chú |
|------|----------|---------|
| `password_reset_tokens` | `SELECT` | Tìm token hợp lệ |
| `users` | `UPDATE` | Cập nhật `password_hash` |
| `password_reset_tokens` | `UPDATE` | Đánh dấu `is_used = TRUE` |
| `notifications` | `INSERT` | Thông báo `PASSWORD_CHANGED` |

**Trường KHÔNG lưu vào DB:** `newPassword` (plain text) — chỉ lưu BCrypt hash

## 8. Security

- Không cần JWT
- `resetToken` là UUID — không thể đoán
- Sau khi dùng: `is_used = TRUE` → không thể dùng lại
- Thứ tự cập nhật: password trước, đánh dấu token used sau — dùng `@Transactional`
- Không trả về JWT sau reset — user phải đăng nhập lại (theo BR-REG sau đăng ký)

## 9. Edge Cases

| Tình huống | Xử lý |
|------------|-------|
| Dùng resetToken đã dùng | `is_used = TRUE` → không tìm thấy → 400 |
| resetToken hết hạn | `expires_at < NOW()` → 400 |
| DB lỗi giữa chừng (sau UPDATE users, trước UPDATE token) | `@Transactional` rollback toàn bộ |
| Notification lỗi | Log lỗi, không rollback — password đã đổi thành công |

## 10. Acceptance Criteria

```
AC-BE-07: Đặt mật khẩu mới thành công

Given  resetToken hợp lệ, chưa dùng, chưa hết hạn
When   POST /api/v1/auth/reset-password với newPassword="MyPass@123"
Then   HTTP 200, message "Mật khẩu đã được thay đổi thành công!"
       DB: users.password_hash cập nhật, token.is_used = TRUE
       DB: notifications INSERT với type=PASSWORD_CHANGED
```

```
AC-BE-08: Reset token đã sử dụng

Given  resetToken đã được dùng (is_used = TRUE)
When   POST /api/v1/auth/reset-password
Then   HTTP 400, message "Phiên đặt lại mật khẩu không hợp lệ hoặc đã hết hạn"
```

```
AC-BE-09: Reset token hết hạn

Given  resetToken tồn tại nhưng expires_at < NOW()
When   POST /api/v1/auth/reset-password
Then   HTTP 400, message "Phiên đặt lại mật khẩu không hợp lệ hoặc đã hết hạn"
```

```
AC-BE-10: Mật khẩu mới không đủ mạnh

Given  resetToken hợp lệ
When   POST /api/v1/auth/reset-password với newPassword="12345678" (không có chữ cái + ký tự đặc biệt)
Then   HTTP 400, message "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ cái, số và ký tự đặc biệt"
```

```
AC-BE-11: Toàn bộ luồng end-to-end

Given  User có email "a@gmail.com" trong hệ thống
When   [1] POST /api/v1/auth/forgot-password → nhận OTP qua email
       [2] POST /api/v1/auth/verify-reset-otp → nhận resetToken
       [3] POST /api/v1/auth/reset-password với resetToken + newPassword hợp lệ
Then   HTTP 200 ở bước 3
       DB: password_hash mới, token is_used=TRUE
       Có thể đăng nhập bằng mật khẩu mới
```

---

## 11. Mapping Business Spec → API Spec

| Business Requirement | Thể hiện trong API Spec |
|---------------------|------------------------|
| Nhập email → tìm tài khoản | API 1: §5[2], AC-BE-02 |
| Gửi OTP qua email | API 1: §5[4,5] |
| OTP hết hạn sau 15 phút | API 1: §5[4], API 2: §5[4], AC-BE-06 |
| Xác thực OTP → bước tiếp theo | API 2: §5[3,4,5] |
| Password ≥ 8 ký tự + chữ + số + ký tự đặc biệt | API 3: §4 Validation, AC-BE-10 |
| Sau reset phải đăng nhập lại | API 3: §8 — không trả JWT |
| Thông báo sau khi đổi mật khẩu | API 3: §5[7], §7 notifications |
| OTP dùng 1 lần duy nhất | API 3: is_used=TRUE, AC-BE-08 |
