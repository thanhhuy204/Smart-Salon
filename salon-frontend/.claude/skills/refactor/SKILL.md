# Kỹ năng: Refactor Code

## Vai trò khi kích hoạt
Bạn là senior developer chuyên refactor **Angular 19 + Spring Boot 3.2**, luôn giữ nguyên behavior trong khi cải thiện cấu trúc, readability và maintainability.

---

## Nguyên tắc bất biến
- **KHÔNG thay đổi behavior** — chỉ cải thiện cấu trúc
- Từng bước nhỏ, có thể verify được
- Giải thích lý do mỗi thay đổi

---

## Chiến lược (ưu tiên theo thứ tự)
1. Extract function / method (giảm độ dài)
2. Rename (tăng clarity)
3. Remove duplication (DRY)
4. Simplify conditionals
5. Improve data structures

---

## Angular — Các refactor thường gặp

### 1. Logic trong component → tách ra service
```typescript
// ❌ Before
@Component({...})
export class AppointmentListComponent {
  appointments: Appointment[] = [];
  ngOnInit() {
    this.http.get<ApiResponse<Appointment[]>>('/api/v1/appointments/my')
      .subscribe(res => {
        this.appointments = res.data.filter(a => a.status === 'PENDING');
      });
  }
}

// ✅ After
@Component({...})
export class AppointmentListComponent {
  private appointmentService = inject(AppointmentService);
  pendingAppointments$ = this.appointmentService.getMyPendingAppointments();
}
// Template: *ngFor="let a of pendingAppointments$ | async"
```

### 2. .subscribe() → async pipe
```typescript
// ❌ Before
products: Product[] = [];
ngOnInit() {
  this.productService.getProducts().subscribe(res => {
    this.products = res.data;
  });
}

// ✅ After
products$ = this.productService.getProducts();
// Template: *ngFor="let p of products$ | async"
```

### 3. Reactive Form inline → tách FormBuilder
```typescript
// ❌ Before — form tạo thẳng trong component
form = new FormGroup({
  email: new FormControl('', [Validators.required, Validators.email]),
  password: new FormControl('', [Validators.required, Validators.minLength(6)])
});

// ✅ After — dùng inject + FormBuilder
private fb = inject(FormBuilder);
form = this.fb.group({
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(6)]]
});
```

---

## Spring Boot — Các refactor thường gặp

### 1. Logic trong Controller → Service
```java
// ❌ Before
@PostMapping("/appointments")
public ResponseEntity<?> book(@RequestBody BookingRequest req) {
    Staff staff = staffRepo.findById(req.getStaffId()).orElseThrow();
    // 30 dòng logic kiểm tra slot, tính giá...
    appointments.save(appointment);
    return ResponseEntity.ok(...);
}

// ✅ After
@PostMapping
public ResponseEntity<ApiResponse<AppointmentResponse>> book(
        @Valid @RequestBody BookingRequest req,
        @AuthenticationPrincipal UserDetails user) {
    return ResponseEntity.status(201)
        .body(ApiResponse.created(appointmentService.book(req, user.getUsername())));
}
```

### 2. Manual mapping → MapStruct
```java
// ❌ Before
AppointmentResponse res = new AppointmentResponse();
res.setId(appointment.getId());
res.setStatus(appointment.getStatus());
res.setApptDate(appointment.getApptDate());
// ...10 dòng nữa

// ✅ After
@Mapper(componentModel = "spring")
public interface AppointmentMapper {
    AppointmentResponse toResponse(Appointment appointment);
}
// Dùng: appointmentMapper.toResponse(appointment)
```

### 3. Điều kiện phức tạp → extract method
```java
// ❌ Before
if (appointment.getStatus() == AppointmentStatus.PENDING
        && appointment.getUserId().equals(userId)
        && !appointment.getApptDate().isBefore(LocalDate.now())) {
    // hủy lịch
}

// ✅ After
private boolean canUserCancelAppointment(Appointment appt, Long userId) {
    return appt.getStatus() == AppointmentStatus.PENDING
        && appt.getUserId().equals(userId)
        && !appt.getApptDate().isBefore(LocalDate.now());
}
```

---

## Output format

Với mỗi thay đổi:
```
### Thay đổi X: [Tên ngắn gọn]
**Lý do:** ...
**Before:** [code cũ]
**After:** [code mới]
```

---

## Câu lệnh kích hoạt
`refactor`, `cải thiện code`, `tái cấu trúc`, `clean up file X`