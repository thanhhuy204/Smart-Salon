# Salon System — Ngữ cảnh chính cho Claude

## Vai trò của Claude
Bạn là senior Java Spring Boot Developer cho dự án **Salon System** — hệ thống quản lý đặt lịch cắt tóc và bán hàng trực tuyến cho Salon tóc.
Ưu tiên: clean code, type safety, performance, bảo mật và UX nhất quán.

---

## Tech Stack

### Backend
| Công nghệ        | Phiên bản | Ghi chú                        |
|------------------|-----------|--------------------------------|
| Spring Boot      | 3.2.x     | REST API                       |
| Java             | 21        |                                |
| Spring Security  | 6.x       | JWT Authentication             |
| Spring Data JPA  | 3.x       | ORM                            |
| MySQL            | 8.x       | Database                       |
| Lombok           | 1.18.x    | Giảm boilerplate               |
| MapStruct        | 1.5.x     | DTO mapping                    |

---

## Cấu trúc dự án

```
salon-backend/
├── pom.xml
├── .gitignore
├── docs/
│   ├── spec-api/
│   ├── spec-business/
│
├── src/main/
│
│   ├── resources/
│   │   ├── application.properties
│   │   ├── static/
│   │   └── templates/
│
│   └── java/com/salon/
│
│       ├── SalonApplication.java
│
│       ├── config/                     # cấu hình hệ thống
│       │   ├── security/
│       │   │   └── SecurityConfig.java
│       │   ├── cors/
│       │   │   └── CorsConfig.java
│       │   └── jwt/
│       │       └── JwtConfig.java
│
│       ├── common/                     # dùng chung toàn hệ thống
│       │   ├── enums/
│       │   │   ├── RoleName.java
│       │   │   ├── AppointmentStatus.java
│       │   │   ├── OrderStatus.java
│       │   │
│       │   ├── response/
│       │   │   ├── ApiResponse.java
│       │   │   └── PageResponse.java
│       │   │
│       │   ├── exception/
│       │   │   ├── GlobalExceptionHandler.java
│       │   │   ├── AppException.java
│       │   │   └── ErrorCode.java
│       │   │
│       │   └── util/
│       │       ├── DateUtils.java
│       │       └── JwtUtils.java
│
│       ├── security/                   # xử lý xác thực
│       │   ├── JwtTokenProvider.java
│       │   ├── JwtAuthFilter.java
│       │   └── UserDetailsServiceImpl.java
│
│       ├── module/                    # chia theo nghiệp vụ
│
│       │   ├── auth/
│       │   │   ├── controller/
│       │   │   │   └── AuthController.java
│       │   │   ├── service/
│       │   │   │   ├── AuthService.java
│       │   │   │   └── impl/
│       │   │   ├── dto/
│       │   │   │   ├── request/
│       │   │   │   └── response/
│
│       │   ├── user/
│       │   │   ├── controller/
│       │   │   ├── service/
│       │   │   ├── repository/
│       │   │   ├── entity/
│       │   │   ├── dto/
│       │   │   └── mapper/
│
│       │   ├── staff/
│       │   │   ├── controller/
│       │   │   ├── service/
│       │   │   ├── repository/
│       │   │   ├── entity/              # Staff, StaffBlockedSlot, StaffReview
│       │   │   ├── dto/
│       │   │   └── mapper/
│
│       │   ├── appointment/            # 🔥 module quan trọng nhất
│       │   │   ├── controller/
│       │   │   ├── service/
│       │   │   │   ├── AppointmentService.java
│       │   │   │   └── impl/
│       │   │   ├── repository/
│       │   │   ├── entity/             # Appointment, AppointmentService
│       │   │   ├── dto/
│       │   │   │   ├── request/
│       │   │   │   └── response/
│       │   │   └── mapper/
│
│       │   ├── salon-service/          # ⚠️ rename tránh trùng "service"
│       │   │   ├── controller/
│       │   │   ├── service/
│       │   │   ├── repository/
│       │   │   ├── entity/             # Service, ServiceCategory
│       │   │   ├── dto/
│       │   │   └── mapper/
│
│       │   ├── product/
│       │   │   ├── controller/
│       │   │   ├── service/
│       │   │   ├── repository/
│       │   │   ├── entity/
│       │   │   ├── dto/
│       │   │   └── mapper/
│
│       │   ├── cart/
│       │   │   ├── controller/
│       │   │   ├── service/
│       │   │   ├── repository/
│       │   │   ├── entity/
│       │   │   ├── dto/
│       │   │   └── mapper/
│
│       │   ├── order/
│       │   │   ├── controller/
│       │   │   ├── service/
│       │   │   ├── repository/
│       │   │   ├── entity/             # Order, OrderItem
│       │   │   ├── dto/
│       │   │   └── mapper/
│
│       │   ├── address/
│       │   │   ├── controller/
│       │   │   ├── service/
│       │   │   ├── repository/
│       │   │   ├── entity/
│       │   │   ├── dto/
│       │   │   └── mapper/
│
│       │   ├── payment/
│       │   │   ├── controller/
│       │   │   ├── service/
│       │   │   ├── repository/
│       │   │   ├── entity/
│       │   │   ├── dto/
│       │   │   └── mapper/
│
│       │   ├── notification/
│       │   │   ├── controller/
│       │   │   ├── service/
│       │   │   ├── repository/
│       │   │   ├── entity/
│       │   │   ├── dto/
│       │   │   └── mapper/
│
│       │   └── review/
│       │       ├── controller/
│       │       ├── service/
│       │       ├── repository/
│       │       ├── entity/
│       │       ├── dto/
│       │       └── mapper/
│
│       └── scheduler/                 # cron job hệ thống
│           ├── AppointmentReminderJob.java
│
└── test/


---

## Quy tắc viết code

### Spring Boot
- Class: `PascalCase` → `AppointmentServiceImpl`
- Method/Variable: `camelCase`
- Package: `lowercase` → `com.salon.module.appointment`
- Mỗi module có đủ: `Entity` → `Repository` → `Service (interface)` → `ServiceImpl` → `Controller` → `dto/`
- Dùng `@RequiredArgsConstructor` — không `@Autowired`
- Dùng `@PreAuthorize` cho phân quyền từng endpoint
- Response luôn wrap bằng `ApiResponse<T>`
- Không expose Entity ra API — luôn dùng DTO
- DTO suffix rõ ràng: `BookingRequest`, `AppointmentResponse`

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