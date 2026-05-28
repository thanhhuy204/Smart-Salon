# UI Spec — Trang Đăng nhập
**Trạng thái:** Ready for Development
**Ưu tiên:** P0 — Yêu cầu xác thực cho toàn bộ tính năng
**File implement:** `src/app/features/auth/login/login.component.ts`
**Business Spec:** `docs/spec-business/Auth/BS-Auth-01-DangNhap.md`

---

## 1. Page / Screen

| Thuộc tính | Giá trị |
|---|---|
| Route | `/auth/login` |
| Tiêu đề tab | `Đăng nhập — Salon` |
| Mục đích | Xác thực danh tính người dùng đã có tài khoản |
| Guard | Redirect về `/` nếu đã đăng nhập (logged-in guard) |
| Layout wrapper | Không dùng layout chung — fullscreen auth layout riêng |

---

## 2. Component Tree

```
LoginPageComponent                          ← Route component (page)
│
├── AuthLayoutComponent                     ← Wrapper 2 cột
│   ├── AuthBrandPanelComponent             ← Cột trái (ẩn trên mobile)
│   │   ├── Logo + Tên thương hiệu
│   │   ├── Tagline
│   │   └── BackgroundImageDecor            ← Ảnh nền minh họa salon
│   │
│   └── AuthFormPanelComponent              ← Cột phải / toàn màn hình mobile
│       ├── AuthFormHeaderComponent         ← Tiêu đề + mô tả ngắn
│       ├── AlertBannerComponent            ← [Conditional] Banner lỗi toàn form
│       ├── LoginFormComponent              ← Form chính
│       │   ├── EmailInputComponent
│       │   ├── PasswordInputComponent      ← Có toggle hiện/ẩn
│       │   ├── FormActionsRowComponent     ← Hàng checkbox + link quên mật khẩu
│       │   └── SubmitButtonComponent       ← Nút "Đăng nhập" với loading state
│       └── AuthFooterLinksComponent        ← Link "Chưa có tài khoản? Đăng ký"
```

---

## 3. Layout

### 3.1 Desktop (≥ 768px) — Split Screen

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│   ┌────────────────────────┐  ┌──────────────────────────┐  │
│   │                        │  │                          │  │
│   │     [BRAND PANEL]      │  │      [FORM PANEL]        │  │
│   │                        │  │                          │  │
│   │  Logo + Tên Salon      │  │   Đăng nhập              │  │
│   │                        │  │   Chào mừng trở lại!     │  │
│   │  "Vẻ đẹp bắt đầu từ   │  │                          │  │
│   │   mái tóc hoàn hảo"   │  │  [!] Banner lỗi (nếu có) │  │
│   │                        │  │                          │  │
│   │  [Ảnh nền salon]       │  │  Email                   │  │
│   │                        │  │  [________________]      │  │
│   │                        │  │  ← lỗi email             │  │
│   │                        │  │                          │  │
│   │                        │  │  Mật khẩu           [👁] │  │
│   │                        │  │  [________________]      │  │
│   │                        │  │  ← lỗi mật khẩu         │  │
│   │                        │  │                          │  │
│   │                        │  │  [ ] Ghi nhớ  Quên MK?  │  │
│   │                        │  │                          │  │
│   │                        │  │  [    Đăng nhập    ]     │  │
│   │                        │  │                          │  │
│   │                        │  │  Chưa có tài khoản?      │  │
│   │                        │  │  Đăng ký                 │  │
│   │                        │  │                          │  │
│   └────────────────────────┘  └──────────────────────────┘  │
│         50% width                     50% width              │
└──────────────────────────────────────────────────────────────┘
```

- **Page:** `min-h-screen flex`
- **Brand Panel:** `w-1/2 hidden md:flex flex-col justify-center items-center relative overflow-hidden bg-gray-900`
- **Form Panel:** `w-full md:w-1/2 flex flex-col justify-center items-center px-8 py-12 bg-white`

### 3.2 Mobile (< 768px) — Single Column

```
┌──────────────────────────┐
│  [Logo nhỏ + Tên Salon]  │  ← compact header
│                          │
│  Đăng nhập               │
│  Chào mừng trở lại!      │
│                          │
│  [!] Banner lỗi          │
│                          │
│  Email                   │
│  [____________________]  │
│  ← lỗi                   │
│                          │
│  Mật khẩu          [👁]  │
│  [____________________]  │
│  ← lỗi                   │
│                          │
│  [ ] Ghi nhớ  Quên MK?  │
│                          │
│  [      Đăng nhập      ] │
│                          │
│  Chưa có tài khoản?      │
│  Đăng ký                 │
└──────────────────────────┘
```

- **Form Panel:** `w-full min-h-screen flex flex-col justify-center px-6 py-10 bg-white`
- Brand panel ẩn hoàn toàn (`hidden md:flex`)

---

## 4. Component Details

### 4.1 AuthBrandPanelComponent
- **Background:** `bg-gray-900` với ảnh nền salon overlay `opacity-30`
- **Logo:** `assets/images/logo.png`, `w-16 h-16 rounded-full border-4 border-amber-500`
- **Tên thương hiệu:** `text-white text-3xl font-bold tracking-wide` — "SALON"
- **Tagline:** `text-amber-400 text-lg italic mt-2` — *"Vẻ đẹp bắt đầu từ mái tóc hoàn hảo"*
- **Decor hình học:** Các vòng tròn trang trí `absolute`, `opacity-10`, màu amber

### 4.2 AuthFormHeaderComponent
```
Đăng nhập                     ← h1: text-2xl font-bold text-gray-900
Chào mừng trở lại!            ← p: text-sm text-gray-500 mt-1
```

### 4.3 AlertBannerComponent ← `[Conditional]`
- Chỉ hiển thị khi có lỗi từ API (5.3 Tài khoản không tồn tại, 5.4 Mật khẩu sai, 5.5 Tài khoản bị khóa, 5.6 Lỗi mạng)
- **Container:** `flex items-start gap-3 p-4 rounded-lg border`
- **Trạng thái lỗi:** `bg-red-50 border-red-200 text-red-700`
- **Icon:** Lucide `<lucide-angular name="alert-circle" size="18"/>` màu `text-red-500`
- **Text:** `text-sm font-medium`
- Animate vào: `@fadeIn` — `opacity 200ms ease`

Nội dung thông báo theo loại lỗi:

| Loại lỗi | Nội dung hiển thị |
|---|---|
| Sai thông tin (401) | *"Email hoặc mật khẩu không chính xác."* |
| Tài khoản bị khóa (403) | *"Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ."* |
| Lỗi mạng / timeout | *"Không thể kết nối. Vui lòng kiểm tra mạng và thử lại."* |
| Lỗi server (500) | *"Đã có lỗi xảy ra. Vui lòng thử lại sau."* |

### 4.4 EmailInputComponent

```
Email *                                ← label: text-sm font-medium text-gray-700
┌──────────────────────────────────┐
│  example@email.com               │  ← input type="email"
└──────────────────────────────────┘
  Email không đúng định dạng.         ← error text: text-xs text-red-500 mt-1
```

- **Input states:**

| State | Border | Background | Shadow |
|---|---|---|---|
| Default | `border-gray-300` | `bg-white` | none |
| Focus | `border-amber-500 ring-2 ring-amber-100` | `bg-white` | `shadow-sm` |
| Error | `border-red-400 ring-2 ring-red-100` | `bg-red-50` | none |
| Disabled | `border-gray-200` | `bg-gray-50` | none |

- **Angular:** Reactive form control, validator: `Validators.required`, `Validators.email`
- **Trim on blur:** `(blur)="trimEmail()"` — BR-AUTH về khoảng trắng

### 4.5 PasswordInputComponent

```
Mật khẩu *                    [👁 / 👁‍🗨]  ← label + toggle button
┌──────────────────────────────────┐
│  ••••••••                        │  ← input [type]="showPwd ? 'text' : 'password'"
└──────────────────────────────────┘
  Mật khẩu phải có ít nhất 6 ký tự.  ← error text
```

- **Toggle button:** `aria-label="Hiện mật khẩu"` / `"Ẩn mật khẩu"`, icon Lucide `eye` / `eye-off`
  - `absolute right-3 top-1/2 -translate-y-1/2`
  - `text-gray-400 hover:text-gray-700 transition-colors`
- **Input:** `pr-10` để tránh overlap với toggle button
- **Angular:** Validator: `Validators.required`, `Validators.minLength(6)`
- States giống `EmailInputComponent`

### 4.6 FormActionsRowComponent

```
[ ] Ghi nhớ đăng nhập          Quên mật khẩu?
```

- **Layout:** `flex items-center justify-between`
- **Checkbox "Ghi nhớ đăng nhập":**
  - `<input type="checkbox">` styled custom hoặc Angular Material checkbox
  - Label: `text-sm text-gray-600`
  - Placeholder (chưa triển khai chức năng thực sự): lưu state local
- **Link "Quên mật khẩu?":**
  - `text-sm text-amber-600 hover:text-amber-700 font-medium underline-offset-2 hover:underline`
  - Khi nhấn: hiển thị `MatSnackBar` với nội dung *"Tính năng này đang được phát triển."* (BR-AUTH-07)
  - **Không điều hướng**

### 4.7 SubmitButtonComponent

```
[ Đang đăng nhập... ⟳ ]     ← loading state
[      Đăng nhập      ]      ← default state
```

- **Default:** `w-full py-3 bg-gray-900 text-white text-sm font-semibold rounded-lg`
- **Hover:** `bg-gray-700 transition-colors duration-200`
- **Disabled / Loading:** `bg-gray-400 cursor-not-allowed opacity-70`
- **Loading state:** spinner Lucide `<lucide-angular name="loader-2" class="animate-spin mr-2" size="16"/>` + text "Đang đăng nhập..."
- **Type:** `type="submit"` — submit form khi nhấn Enter
- **[disabled]:** `isLoading || form.invalid`

### 4.8 AuthFooterLinksComponent

```
Chưa có tài khoản?  Đăng ký
```

- **Layout:** `text-center mt-6`
- **Text:** `text-sm text-gray-500`
- **Link "Đăng ký":** `text-amber-600 font-semibold hover:text-amber-700 hover:underline`
- **Route:** `[routerLink]="['/auth/register']"`

---

## 5. UI Behavior

### 5.1 Validation — Client-side (trước khi gửi API)

| Trigger | Hành vi |
|---|---|
| Nhấn Submit với form rỗng | Đánh dấu tất cả control là `touched`, hiển thị lỗi cho tất cả trường trống |
| Nhập email sai định dạng | Lỗi hiển thị ngay khi blur khỏi trường (on-blur) |
| Mật khẩu < 6 ký tự | Lỗi hiển thị khi blur hoặc khi submit |
| Nhấn Enter trong bất kỳ input nào | Trigger submit form |

Thứ tự kiểm tra lỗi trường Email:
1. `required` → *"Email không được để trống."*
2. `email` → *"Email không đúng định dạng."*

Thứ tự kiểm tra lỗi trường Mật khẩu:
1. `required` → *"Mật khẩu không được để trống."*
2. `minLength(6)` → *"Mật khẩu phải có ít nhất 6 ký tự."*

### 5.2 Submit Flow

```
User nhấn "Đăng nhập"
        │
        ▼
form.invalid? ──yes──→ Hiển thị lỗi inline, focus trường đầu tiên bị lỗi
        │ no
        ▼
isLoading = true
Button disabled + spinner hiển thị
AlertBanner ẩn đi (reset)
        │
        ▼
authService.login(email.trim(), password) ──HTTP POST──→ API
        │
   ┌────┴────┐
  200       Error
   │           │
   ▼           ▼
Lưu token  isLoading = false
redirect   AlertBanner hiển thị (nội dung theo error code)
           Button enabled lại
```

### 5.3 Redirect Logic

```typescript
// Sau đăng nhập thành công
const returnUrl = route.snapshot.queryParams['returnUrl'] || '/';
router.navigateByUrl(returnUrl);
```

- Nếu được redirect từ AuthGuard: `?returnUrl=/booking` → sau đăng nhập về `/booking`
- Nếu vào thẳng `/auth/login`: về `/`

### 5.4 Các trạng thái hiển thị

| Trạng thái | AlertBanner | Button | Form inputs |
|---|---|---|---|
| Khởi tạo | Ẩn | Enabled | Rỗng, default border |
| Đang gõ | Ẩn | Enabled | Lỗi khi blur |
| Đang gửi | Ẩn | Disabled + spinner | Disabled |
| Lỗi API | Hiển thị (màu đỏ) | Enabled | Enabled, dữ liệu giữ nguyên |
| Thành công | N/A | N/A | N/A (redirect) |

### 5.5 "Quên mật khẩu?" behavior

```typescript
onForgotPassword(): void {
  this.snackBar.open(
    'Tính năng này đang được phát triển.',
    'Đóng',
    { duration: 3000, panelClass: 'snackbar-info' }
  );
}
```

---

## 6. Style System

### 6.1 Màu sắc

| Element | Màu | Tailwind |
|---|---|---|
| Page background | Trắng | `bg-white` |
| Brand panel background | Đen đậm | `bg-gray-900` |
| CTA button | Đen | `bg-gray-900 hover:bg-gray-700` |
| CTA button text | Trắng | `text-white` |
| Input focus ring | Amber nhạt | `ring-amber-100 border-amber-500` |
| Link accent | Amber | `text-amber-600 hover:text-amber-700` |
| Label | Xám đậm | `text-gray-700` |
| Placeholder | Xám nhạt | `text-gray-400` |
| Error text | Đỏ | `text-red-500` |
| Error input border | Đỏ nhạt | `border-red-400` |
| Error input bg | Đỏ rất nhạt | `bg-red-50` |
| Alert banner bg | Đỏ rất nhạt | `bg-red-50 border-red-200` |
| Checkbox accent | Amber | `accent-amber-500` |

### 6.2 Typography

| Element | Size | Weight | Color |
|---|---|---|---|
| Page title (h1) | `1.5rem` (24px) | `700` | `text-gray-900` |
| Subtitle | `0.875rem` (14px) | `400` | `text-gray-500` |
| Label | `0.875rem` (14px) | `500` | `text-gray-700` |
| Input text | `0.875rem` (14px) | `400` | `text-gray-900` |
| Error text | `0.75rem` (12px) | `400` | `text-red-500` |
| Button text | `0.875rem` (14px) | `600` | `text-white` |
| Link text | `0.875rem` (14px) | `500` | `text-amber-600` |
| Footer text | `0.875rem` (14px) | `400` | `text-gray-500` |
| Alert text | `0.875rem` (14px) | `500` | `text-red-700` |
| Brand name | `1.875rem` (30px) | `700` | `text-white` |
| Tagline | `1.125rem` (18px) | `400` | `text-amber-400` |

### 6.3 Spacing & Sizing

| Element | Giá trị |
|---|---|
| Form max-width | `400px` |
| Form padding (desktop) | `px-8 py-12` |
| Form padding (mobile) | `px-6 py-10` |
| Input height | `44px` (`py-2.5 px-4`) |
| Input border radius | `8px` (`rounded-lg`) |
| Gap giữa các form fields | `20px` (`space-y-5`) |
| Button height | `48px` (`py-3`) |
| Button border radius | `8px` (`rounded-lg`) |

### 6.4 Design Feeling
- **Phong cách:** Tối giản, chuyên nghiệp, sang trọng
- **Cảm giác:** Tin cậy — màu trung tính (xám, đen) kết hợp điểm nhấn amber (vàng-nâu) gợi lên hình ảnh salon cao cấp
- **Animation:** Nhẹ nhàng — fade-in cho error banner, transition 200ms cho hover states

---

## 7. Edge Cases — UI Handling

| Tình huống | Xử lý UI |
|---|---|
| Người dùng đã đăng nhập vào `/auth/login` | Guard redirect về `/` trước khi render component — không hiển thị gì |
| Email có khoảng trắng đầu/cuối | `(blur)` event: `control.setValue(control.value.trim())` |
| Nhấn Enter trong input | Form `(ngSubmit)` được trigger tự động vì `type="submit"` |
| Mất mạng hoàn toàn | `catchError` → AlertBanner lỗi mạng, button enabled lại |
| API trả về 500 | AlertBanner thông báo lỗi hệ thống chung |
| Session hết hạn (từ trang khác redirect sang) | Hiển thị `MatSnackBar` với thông báo *"Phiên làm việc đã hết hạn."* trong 4 giây |
| Nhấn submit nhiều lần nhanh | `isLoading = true` disabled button ngay lần đầu, các click sau bị ignore |
| Copy-paste mật khẩu ký tự đặc biệt | Input `type="password"` chấp nhận mọi ký tự — không filter |
| Cả hai trường trống | `markAllAsTouched()` → hiển thị lỗi required cho cả 2 trường |

---

## 8. Mapping Business Spec → UI Spec

| Business Spec | UI Implementation |
|---|---|
| **BR-AUTH-01** Email phải đúng định dạng | `Validators.email` trên EmailInputComponent, error text on-blur |
| **BR-AUTH-02** Mật khẩu ≥ 6 ký tự | `Validators.minLength(6)` trên PasswordInputComponent |
| **BR-AUTH-03** Thông báo lỗi chung khi sai | AlertBannerComponent dùng thông báo chung — không phân biệt sai email hay mật khẩu |
| **BR-AUTH-04** Tài khoản bị khóa | AlertBannerComponent với text "Tài khoản bị khóa..." khi API trả 403 |
| **BR-AUTH-05** Redirect sau đăng nhập | `router.navigateByUrl(returnUrl)` dùng query param `?returnUrl=` |
| **BR-AUTH-06** Disable button khi đang xử lý | `[disabled]="isLoading"` + spinner trong SubmitButtonComponent |
| **BR-AUTH-07** "Quên mật khẩu?" là placeholder | `onForgotPassword()` mở MatSnackBar, không navigate |
| **5.7** Quên mật khẩu chưa triển khai | MatSnackBar: *"Tính năng này đang được phát triển."* |
| **5.8** Nhấn link đăng ký | `routerLink="/auth/register"` trong AuthFooterLinksComponent |
| **Edge:** đã đăng nhập vào /auth/login | `AuthGuard` / logged-in guard redirect trước khi mount component |
| **Edge:** email có khoảng trắng | Trim on-blur trong EmailInputComponent |
| **Edge:** nhấn Enter | `type="submit"` trên nút, form `(ngSubmit)` |
| **AC-05** Loading state | `isLoading` signal → spinner + "Đang đăng nhập..." + disabled button |

---

## 9. Angular Implementation Notes

```typescript
// login.component.ts
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, LucideAngularModule, MatSnackBarModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  isLoading = signal(false);
  showPassword = signal(false);
  errorMessage = signal<string | null>(null);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false]
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    this.errorMessage.set(null);
    // ...
  }
}
```

**Files cần tạo:**
- `src/app/features/auth/login/login.component.ts`
- `src/app/features/auth/login/login.component.html`
- `src/app/features/auth/login/login.component.scss`
- `src/app/features/auth/auth.routes.ts` — lazy load route
