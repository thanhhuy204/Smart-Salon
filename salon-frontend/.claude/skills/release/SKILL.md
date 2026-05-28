# Kỹ năng: Chuẩn bị Release

## Vai trò khi kích hoạt
Bạn là release manager cho **Salon System**, đảm bảo mọi thứ sẵn sàng trước khi deploy production.

---

## Checklist release bắt buộc

### 1. Code Quality — Angular
- [ ] Không có TypeScript errors: `ng build --configuration production`
- [ ] Không có ESLint errors: `ng lint`
- [ ] Không có `console.log` trong production code
- [ ] Không có `any` type
- [ ] Không có commented-out code lớn

### 2. Code Quality — Spring Boot
- [ ] Build thành công: `mvn clean package -DskipTests`
- [ ] Không có compilation warnings
- [ ] Không có `System.out.println`
- [ ] `application-dev.yml` không bị commit lên git

### 3. Build & Bundle
- [ ] `ng build --configuration production` thành công
- [ ] `mvn clean package` thành công
- [ ] Bundle size Angular không tăng đột biến (> 20% so với release trước)

### 4. Environment

**Angular — `environment.prod.ts`:**
- [ ] `apiUrl` trỏ đúng production: `https://api.salon.com/api/v1`
- [ ] Không có URL `localhost` trong code production

**Spring Boot — `application-prod.yml`:**
- [ ] Tất cả env variables đã set: `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, `MAIL_*`, `CORS_ORIGINS`
- [ ] `spring.profiles.active=prod`
- [ ] `ddl-auto: validate` (không phải `update`)

### 5. Database
- [ ] Backup database production trước khi deploy
- [ ] Schema mới tương thích với code cũ (nếu rolling deploy)
- [ ] Kiểm tra data seed cần thiết đã có chưa (roles, salon_working_hours, service_categories, product_categories)

### 6. Kiểm tra tính năng (manual test)
- [ ] Đăng ký / Đăng nhập / Đăng xuất
- [ ] Luồng đặt lịch: chọn dịch vụ → chọn thợ → chọn giờ → xác nhận
- [ ] Admin duyệt / từ chối / hủy lịch hẹn
- [ ] Luồng mua hàng: xem sản phẩm → giỏ hàng → checkout → thanh toán
- [ ] Admin xác nhận / cập nhật trạng thái đơn hàng
- [ ] Thông báo gửi đúng sự kiện
- [ ] Không có broken UI trên mobile và desktop

### 7. Security
- [ ] JWT secret đủ mạnh (>= 256 bit, base64 encoded)
- [ ] CORS chỉ cho phép domain chính thức
- [ ] Không có endpoint admin bị public
- [ ] Kiểm tra ownership — user A không xem được data user B

### 8. Changelog — cập nhật `CHANGELOG.md`
```markdown
## [x.y.z] — YYYY-MM-DD

### Added
- ...

### Changed
- ...

### Fixed
- ...
```

### 9. Version bump
- `salon-frontend/package.json` → cập nhật `"version"`
- `salon-backend/pom.xml` → cập nhật `<version>`

Theo Semantic Versioning:
- `patch` (x.y.**Z**): Bug fix
- `minor` (x.**Y**.z): Tính năng mới, backward compatible
- `major` (**X**.y.z): Breaking change

### 10. Commit & Tag
```bash
git add .
git commit -m "chore: release vX.Y.Z"
git tag vX.Y.Z
git push origin main --tags
```

---

## Câu lệnh kích hoạt
`release`, `chuẩn bị release`, `deploy checklist`, `version bump`