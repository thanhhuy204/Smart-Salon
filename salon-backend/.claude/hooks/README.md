# Hooks — Tự động hóa kiểm tra chất lượng

Hooks là các quy tắc chạy tự động trước/sau khi Claude trả lời.
Cấu hình trong `.claude/settings.json`.

---

## Hooks hiện tại

### pre-response: quality-check
Nhắc Claude kiểm tra **trước** khi đưa ra code:

**Angular:**
- Không dùng `any` — dùng type cụ thể hoặc `unknown`
- Không có `console.log` trong production code
- Không dùng NgModule — chỉ Standalone Components
- Không inline style — chỉ Tailwind classes
- Không `.subscribe()` thủ công nếu có thể dùng `async pipe`
- `@Input` / `@Output` phải có type rõ ràng
- Feature routes phải lazy load

**Spring Boot:**
- Không dùng `@Autowired` — dùng `@RequiredArgsConstructor`
- Không expose Entity ra API — phải qua DTO
- Không có `System.out.println` — dùng `@Slf4j` + `log.info()`
- Response phải wrap bằng `ApiResponse<T>`
- Endpoint admin phải có `@PreAuthorize("hasRole('ADMIN')")`
- Không để user A truy cập data của user B — check ownership

---

### post-response: naming-check
Sau khi Claude sinh code, tự kiểm tra:

**Angular:**
- Component: `PascalCase` → `BookingConfirmComponent`
- File: `kebab-case` → `booking-confirm.component.ts`
- Service: `camelCase` + suffix → `appointmentService`
- Interface/Model: `PascalCase` → `AppointmentModel`
- Enum: `PascalCase` → `AppointmentStatus`
- Constant: `UPPER_SNAKE_CASE` → `MAX_BOOKING_PER_DAY`
- Không có magic numbers

**Spring Boot:**
- Class: `PascalCase` → `AppointmentServiceImpl`
- Method/Variable: `camelCase` → `getAppointmentById`
- Package: `lowercase` → `com.salon.module.appointment`
- DTO suffix rõ ràng → `BookingRequest`, `AppointmentResponse`
- Không có magic strings — dùng `ErrorCode` enum

---

## Cách sử dụng thủ công

Copy vào đầu prompt khi cần kiểm tra nghiêm ngặt:

### Chỉ kiểm tra Angular
```
[Áp dụng pre-response hook — Angular]
Trước khi viết code, đảm bảo:
1. Standalone Component, không NgModule
2. Không có any type
3. Dùng async pipe thay .subscribe()
4. Chỉ Tailwind, không inline style
5. @Input/@Output có type rõ ràng

Yêu cầu: [mô tả yêu cầu ở đây]
```

### Chỉ kiểm tra Spring Boot
```
[Áp dụng pre-response hook — Spring Boot]
Trước khi viết code, đảm bảo:
1. Không @Autowired — dùng @RequiredArgsConstructor
2. Trả về DTO, không phải Entity
3. Response wrap bằng ApiResponse<T>
4. Có @PreAuthorize nếu là endpoint admin
5. Không System.out.println — dùng @Slf4j

Yêu cầu: [mô tả yêu cầu ở đây]
```

### Kiểm tra toàn bộ Fullstack
```
[Áp dụng pre-response + post-response hook — Fullstack]
Áp dụng tất cả rules Angular + Spring Boot trong settings.json.
Sau khi sinh code, tự review lại naming convention.

Yêu cầu: [mô tả yêu cầu ở đây]
```

---

## Bật hook tự động

Mở `.claude/settings.json`, đặt `"enabled": true`:

```json
"hooks": {
  "pre-response": {
    "enabled": true
  },
  "post-response": {
    "enabled": true
  }
}
```