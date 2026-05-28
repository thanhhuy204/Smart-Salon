# Kỹ năng: Viết Test

## Vai trò khi kích hoạt
Bạn là QA engineer + developer viết test cho **Salon System** (Angular 19 + Spring Boot 3.2).
Triết lý: **"Test behavior, not implementation"** — tập trung vào những gì user thấy và làm.

---

## Phân loại test

### 1. Angular — Service Test (Jasmine + HttpClientTesting)
```typescript
// appointment.service.spec.ts
describe('AppointmentService', () => {
  let service: AppointmentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AppointmentService]
    });
    service = TestBed.inject(AppointmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should fetch my appointments', () => {
    const mockResponse: ApiResponse<Appointment[]> = {
      status: 200, message: 'Success', data: []
    };
    service.getMyAppointments().subscribe(res => {
      expect(res.data).toEqual([]);
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/appointments/my`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  afterEach(() => httpMock.verify());
});
```

### 2. Angular — Component Test (Jasmine + Testing Library)
```typescript
// login.component.spec.ts
describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule]
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
  });

  it('should disable submit button when form is invalid', () => {
    const btn = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(btn.nativeElement.disabled).toBeTrue();
  });

  it('should show email error when email is invalid', () => {
    const emailInput = fixture.debugElement.query(By.css('input[formControlName="email"]'));
    emailInput.nativeElement.value = 'invalid-email';
    emailInput.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    const error = fixture.debugElement.query(By.css('[data-testid="email-error"]'));
    expect(error).toBeTruthy();
  });
});
```

### 3. Spring Boot — Service Unit Test (JUnit 5 + Mockito)
```java
// AppointmentServiceImplTest.java
@ExtendWith(MockitoExtension.class)
class AppointmentServiceImplTest {

    @Mock AppointmentRepository appointmentRepository;
    @Mock StaffRepository staffRepository;
    @InjectMocks AppointmentServiceImpl appointmentService;

    @Test
    void cancelByUser_WhenPending_ShouldSucceed() {
        Appointment appt = Appointment.builder()
            .id(1L).userId(1L)
            .status(AppointmentStatus.PENDING).build();
        when(appointmentRepository.findById(1L)).thenReturn(Optional.of(appt));

        appointmentService.cancelByUser(1L, 1L, "Bận việc");

        verify(appointmentRepository).save(argThat(a ->
            a.getStatus() == AppointmentStatus.CANCELLED
            && a.getCancelledBy() == CancelledBy.USER
            && a.getCancelReason().equals("Bận việc")
        ));
    }

    @Test
    void cancelByUser_WhenNotPending_ShouldThrowAppException() {
        Appointment appt = Appointment.builder()
            .id(1L).userId(1L)
            .status(AppointmentStatus.CONFIRMED).build();
        when(appointmentRepository.findById(1L)).thenReturn(Optional.of(appt));

        AppException ex = assertThrows(AppException.class,
            () -> appointmentService.cancelByUser(1L, 1L, "reason"));
        assertEquals(ErrorCode.APPOINTMENT_CANNOT_CANCEL, ex.getErrorCode());
    }

    @Test
    void cancelByUser_WhenNotOwner_ShouldThrowForbidden() {
        Appointment appt = Appointment.builder()
            .id(1L).userId(99L) // user khác
            .status(AppointmentStatus.PENDING).build();
        when(appointmentRepository.findById(1L)).thenReturn(Optional.of(appt));

        assertThrows(AppException.class,
            () -> appointmentService.cancelByUser(1L, 1L, "reason"));
    }
}
```

### 4. Spring Boot — Controller Integration Test (MockMvc)
```java
// AppointmentControllerTest.java
@SpringBootTest
@AutoConfigureMockMvc
class AppointmentControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;

    @Test
    @WithMockUser(roles = "USER")
    void getMyAppointments_ShouldReturn200() throws Exception {
        mockMvc.perform(get("/api/v1/appointments/my"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value(200));
    }

    @Test
    void getMyAppointments_WhenUnauthenticated_ShouldReturn401() throws Exception {
        mockMvc.perform(get("/api/v1/appointments/my"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "USER")
    void cancelAppointment_WhenConfirmed_ShouldReturn400() throws Exception {
        // setup appointment với status CONFIRMED...
        mockMvc.perform(patch("/api/v1/appointments/1/cancel")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"reason\": \"test\"}"))
            .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getAdminAppointments_WhenAdmin_ShouldReturn200() throws Exception {
        mockMvc.perform(get("/api/v1/admin/appointments"))
            .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "USER")
    void getAdminAppointments_WhenUser_ShouldReturn403() throws Exception {
        mockMvc.perform(get("/api/v1/admin/appointments"))
            .andExpect(status().isForbidden());
    }
}
```

---

## Quy trình viết test

1. **Happy path** — trường hợp bình thường thành công
2. **Error cases** — invalid input, not found, unauthorized, forbidden
3. **Business rules** — hủy chỉ khi PENDING, đánh giá chỉ sau COMPLETED...
4. **Edge cases** — null, empty, boundary values
5. **User interactions** (FE) — click, type, submit, navigate

---

## Đặt tên test
```
[method]_[condition]_[expectedResult]

Ví dụ:
- cancelByUser_WhenPending_ShouldSucceed
- cancelByUser_WhenNotPending_ShouldThrowAppException
- login_WithInvalidEmail_ShouldShowError
- getAdminAppointments_WhenUser_ShouldReturn403
```

---

## Câu lệnh kích hoạt
`test`, `viết test`, `test for X`, `unit test file X`