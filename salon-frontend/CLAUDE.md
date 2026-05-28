# Salon System — Ngữ cảnh chính cho Claude

## Vai trò của Claude
Bạn là senior Angular Developer cho dự án **Salon System** — hệ thống quản lý đặt lịch cắt tóc và bán hàng trực tuyến cho Salon tóc.
Ưu tiên: clean code, type safety, performance, bảo mật và UX nhất quán.

---

## Tech Stack

### Frontend
| Công nghệ        | Phiên bản | Ghi chú                        |
|------------------|-----------|--------------------------------|
| Angular          | 19.x      | Standalone Components, Signals |
| TypeScript       | 5.x       | Strict mode bật                |
| Tailwind CSS     | 3.x       | Utility-first                  |
| Angular Material | 19.x      | UI components                  |
| Lucide Angular   | latest    | Icons                          |
| RxJS             | 7.x       | Reactive programming           |

---

## Cấu trúc dự án

```
salon-frontend/
├── angular.json
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── .gitignore
│
├── docs/
│   ├── spec-business/
│   ├── spec-ui/
│
├── public/
├── assets/
│   ├── images/
│   ├── videos/
│
├── src/
│   ├── index.html
│   ├── main.ts
│   ├── styles.scss
│   └── app/
│       ├── app.component.ts
│       ├── app.routes.ts
│       ├── app.config.ts
│
│       ├── core/                        # logic global
│       │   ├── guards/
│       │   │   ├── auth.guard.ts
│       │   │   ├── admin.guard.ts
│       │   │
│       │   ├── interceptors/
│       │   │   ├── auth.interceptor.ts
│       │   │   ├── error.interceptor.ts
│       │   │
│       │   ├── services/
│       │   │   ├── api.service.ts
│       │   │   ├── auth.service.ts
│       │   │   ├── token.service.ts
│       │   │
│       │   └── models/
│       │       ├── api-response.model.ts
│       │       ├── user.model.ts
│       │       ├── appointment.model.ts
│       │       ├── order.model.ts
│
│       ├── shared/                      # dùng lại UI
│       │   ├── components/
│       │   │   ├── navbar/
│       │   │   ├── footer/
│       │   │   ├── loading-spinner/
│       │   │   ├── confirm-dialog/
│       │   │
│       │   ├── pipes/
│       │   │   ├── currency-vnd.pipe.ts
│       │   │   ├── date-vn.pipe.ts
│
│       ├── layout/                      # 🔥 thêm để tách layout
│       │   ├── main-layout/
│       │   ├── admin-layout/
│
│       ├── features/                    # lazy loading theo nghiệp vụ
│
│       │   ├── auth/
│       │   │   ├── pages/
│       │   │   │   ├── login/
│       │   │   │   ├── register/
│       │   │   │   ├── forgot-password/
│       │   │   ├── services/
│
│       │   ├── home/
│       │   │   ├── pages/
│       │   │       ├── home-page/
│
│       │   ├── booking/                # 🔥 core feature
│       │   │   ├── pages/
│       │   │   │   ├── booking-page/
│       │   │   │   ├── booking-history/
│       │   │   │   ├── booking-detail/
│       │   │
│       │   │   ├── components/
│       │   │   │   ├── service-list/
│       │   │   │   ├── staff-list/
│       │   │   │   ├── slot-picker/
│       │   │
│       │   │   ├── steps/              # 🔥 luồng 4 bước
│       │   │   │   ├── step-service/
│       │   │   │   ├── step-staff/
│       │   │   │   ├── step-time/
│       │   │   │   ├── step-confirm/
│       │   │
│       │   │   ├── services/
│
│       │   ├── shop/
│       │   │   ├── pages/
│       │   │   │   ├── product-list/
│       │   │   │   ├── product-detail/
│       │   │   │   ├── cart/
│       │   │   │   ├── checkout/
│       │   │   ├── services/
│
│       │   ├── profile/
│       │   │   ├── pages/
│       │   │   │   ├── profile-page/
│       │   │   │   ├── address/
│       │   │   │   ├── orders/
│       │   │   │   ├── appointments/
│
│       │   └── admin/
│       │       ├── pages/
│       │       │   ├── dashboard/
│       │       │   ├── appointments/
│       │       │   ├── orders/
│       │       │   ├── products/
│       │       │   ├── staff/
│       │       │   ├── services/
---


## Quy tắc viết code

### Angular
- Component: `PascalCase` → `BookingConfirmComponent`
- File: `kebab-case` → `booking-confirm.component.ts`
- Service: `camelCase` + suffix → `appointmentService`
- Interface/Model: `PascalCase` → `AppointmentModel`
- Enum: `PascalCase` → `AppointmentStatus`
- Constant: `UPPER_SNAKE_CASE`
- Dùng **Standalone Components** — không NgModule
- Dùng **`inject()`** thay constructor injection khi có thể
- Dùng **`async pipe`** thay `.subscribe()` trong template
- Dùng **Signals** cho local state đơn giản
- Lazy load tất cả feature routes
- Không viết logic nghiệp vụ trong component — tách ra service


### Commit message
```
feat: thêm chức năng X
fix: sửa lỗi Y
refactor: cải thiện Z
docs: cập nhật tài liệu
chore: cập nhật dependencies
test: thêm test cho module X
```

---

## Kiến trúc API

| Môi trường | Base URL                        |
|------------|----------------------------------|
| Dev        | `http://localhost:8080/api/v1`  |
| Prod       | `https://api.salon.com/api/v1`  |

- JWT token lưu trong `localStorage` (key: `access_token`)
- `AuthInterceptor` tự động gắn Bearer token vào mọi request
- `ErrorInterceptor` xử lý: 401 → redirect `/auth/login`, 403 → thông báo lỗi, 500 → toast lỗi
- Response chuẩn: `ApiResponse<T>` → `{ status, message, data }`
- Pagination: `PageResponse<T>` → `{ content, page, size, totalElements, totalPages }`

---

## Phân quyền

| Role  | Mô tả                                    |
|-------|------------------------------------------|
| USER  | Đặt lịch, mua hàng, xem lịch sử, đánh giá |
| ADMIN | Quản lý toàn bộ hệ thống                 |

- FE: `AuthGuard` kiểm tra đã đăng nhập, `AdminGuard` kiểm tra role ADMIN
- BE: `@PreAuthorize("hasRole('ADMIN')")` hoặc `hasRole('USER')`

---

## Trạng thái nghiệp vụ

### Lịch hẹn (AppointmentStatus)
```
PENDING → CONFIRMED → IN_PROGRESS → COMPLETED
   ↓ (user hủy)    ↓ (admin hủy bất kỳ lúc)
CANCELLED        CANCELLED
```
> User chỉ hủy được khi status = PENDING

### Đơn hàng (OrderStatus)
```
PENDING → PROCESSING → SHIPPING → COMPLETED
   ↓            ↓
CANCELLED    CANCELLED (+ hoàn tiền)
```
> User chỉ hủy được khi status = PENDING

---

## Database — 17 bảng

| Nhóm         | Bảng                                                                                            |
|--------------|-------------------------------------------------------------------------------------------------|
| Auth         | `roles`, `users`                                                                                |
| Booking      | `salon_working_hours`, `service_categories`, `services`, `staff`, `staff_blocked_slots`, `appointments`, `appointment_services`, `staff_reviews` |
| Sales        | `product_categories`, `products`, `user_addresses`, `carts`, `cart_items`, `orders`, `order_items`, `product_reviews` |
| Payment      | `payments`                                                                                      |
| Notification | `notifications`                                                                                 |

---

## Skills thường dùng

| Lệnh kích hoạt            | File skill                              |
|---------------------------|-----------------------------------------|
| `review`, `cr`            | `.claude/skills/code-review/SKILL.md`  |
| `refactor`                | `.claude/skills/refactor/SKILL.md`     |
| `test`, `viết test`       | `.claude/skills/testing/SKILL.md`      |
| `release`                 | `.claude/skills/release/SKILL.md`      |
| `spec-sync`, `check-spec` | `.claude/skills/spec-sync/SKILL.md`    |

---

## Ràng buộc quan trọng

- KHÔNG commit `application-dev.yml` hay `.env` lên git
- KHÔNG dùng `any` trong TypeScript
- KHÔNG dùng `@Autowired` trong Spring Boot
- KHÔNG dùng NgModule — chỉ Standalone Components
- KHÔNG expose Entity trực tiếp ra API
- Mọi form phải validate cả FE lẫn BE
- API error phải hiển thị thông báo rõ ràng cho user
- Accessibility: luôn có `aria-label` cho icon buttons