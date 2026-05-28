# UI Spec — Đăng nhập Admin Dashboard
**Trạng thái:** Ready for Development
**Ưu tiên:** P0 — Bảo vệ toàn bộ khu vực quản trị
**File implement:**
- `src/app/core/guards/admin.guard.ts`
- `src/app/features/auth/login/login.component.ts` _(shared với user login)_
- `src/app/features/admin/layout/admin-layout.component.ts`
- `src/app/shared/components/forbidden/forbidden.component.ts`
**Business Spec:** `docs/spec-business/Admin/BS-Admin-01-DangNhapAdmin.md`

---

## 1. Page / Screen

> Admin **không có trang đăng nhập riêng** — sử dụng chung form `/auth/login` với User.
> Sự khác biệt nằm ở logic sau xác thực: kiểm tra role → redirect `/admin`.

| Screen | Route | Mục đích |
|---|---|---|
| Trang đăng nhập (shared) | `/auth/login` | Admin nhập credential, hệ thống kiểm tra role sau xác thực |
| Admin Dashboard | `/admin` hoặc `/admin/dashboard` | Trang chính sau khi Admin đăng nhập thành công |
| Trang 403 Forbidden | `/403` hoặc inline | Hiển thị khi USER cố truy cập `/admin/**` |

| Guard | Áp dụng cho | Hành vi |
|---|---|---|
| `loggedInGuard` | `/auth/login` | Admin đã đăng nhập → redirect `/admin` |
| `adminGuard` | Toàn bộ `/admin/**` | Chưa đăng nhập → redirect `/auth/login`; role USER → trang 403 / redirect `/` |

---

## 2. Component Tree

### 2.1 Trang đăng nhập (Admin flow — dùng chung LoginComponent)

```
LoginComponent                              ← /auth/login (shared)
│   [Không thay đổi UI — xem UI-Auth-01]
│
└── Điểm khác biệt khi Admin đăng nhập:
    └── authService.login()
        └── role === 'ADMIN' → router.navigate(['/admin'])
            role === 'USER'  → router.navigateByUrl(returnUrl || '/')
```

### 2.2 Admin Layout

```
AdminLayoutComponent                        ← wrapper toàn bộ /admin/**
│
├── AdminSidebarComponent                   ← Sidebar trái cố định
│   ├── SidebarLogoComponent                ← Logo + tên hệ thống
│   ├── SidebarNavMenuComponent             ← Danh sách menu items
│   │   └── SidebarNavItemComponent (×7)   ← Mỗi mục menu
│   └── SidebarFooterComponent             ← Thông tin admin + nút đăng xuất
│
├── AdminHeaderComponent                    ← Header ngang trên cùng
│   ├── PageTitleComponent                  ← Tiêu đề trang hiện tại
│   ├── SearchBarComponent                  ← [Optional] Tìm kiếm nhanh
│   └── AdminUserMenuComponent              ← Avatar + tên + dropdown logout
│
└── AdminContentAreaComponent               ← <router-outlet> — nội dung từng trang
```

### 2.3 Trang 403 Forbidden

```
ForbiddenComponent                          ← /403 hoặc inject bởi adminGuard
│
├── ForbiddenIllustrationComponent          ← Biểu tượng khóa / cấm
├── ForbiddenMessageComponent               ← Tiêu đề + mô tả lỗi
└── ForbiddenActionsComponent               ← Nút "Về trang chủ" + "Đăng xuất"
```

---

## 3. Layout

### 3.1 Admin Layout — Desktop (≥ 1024px)

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  ┌──────────────┐  ┌──────────────────────────────────────┐  │
│  │              │  │  [HEADER]  Tiêu đề trang   [Avatar]  │  │
│  │  [SIDEBAR]   │  ├──────────────────────────────────────┤  │
│  │              │  │                                      │  │
│  │  SALON ADMIN │  │                                      │  │
│  │  ─────────── │  │         [CONTENT AREA]               │  │
│  │  📊 Tổng quan│  │         <router-outlet>              │  │
│  │  📅 Lịch hẹn │  │                                      │  │
│  │  👥 Nhân viên│  │                                      │  │
│  │  ✂️ Dịch vụ  │  │                                      │  │
│  │  📦 Sản phẩm │  │                                      │  │
│  │  🛍️ Đơn hàng │  │                                      │  │
│  │  📈 Báo cáo  │  │                                      │  │
│  │              │  │                                      │  │
│  │  ─────────── │  │                                      │  │
│  │  [Avatar]    │  │                                      │  │
│  │  Tên Admin   │  │                                      │  │
│  │  [Đăng xuất] │  │                                      │  │
│  └──────────────┘  └──────────────────────────────────────┘  │
│     240px fixed          flex-1, overflow-y-auto             │
└──────────────────────────────────────────────────────────────┘
```

- **Wrapper:** `flex h-screen overflow-hidden bg-gray-50`
- **Sidebar:** `w-60 flex-shrink-0 bg-[#0d311b] flex flex-col fixed h-full`
- **Main area:** `flex-1 flex flex-col ml-60 min-h-screen`
- **Header:** `h-16 flex items-center justify-between px-6 bg-white border-b border-gray-200 flex-shrink-0`
- **Content:** `flex-1 overflow-y-auto p-6`

### 3.2 Admin Layout — Tablet (768px–1023px)

```
┌──────────────────────────────────────────┐
│  [☰]  SALON ADMIN                [Avatar]│  ← Header với burger button
├──────────────────────────────────────────┤
│                                          │
│            [CONTENT AREA]                │
│                                          │
└──────────────────────────────────────────┘
```

- Sidebar ẩn mặc định, hiện ra dạng **overlay drawer** khi nhấn hamburger
- Sidebar overlay: `fixed inset-y-0 left-0 z-50 w-60 transform transition-transform duration-300`
  - Ẩn: `-translate-x-full`; Hiện: `translate-x-0`
- Backdrop: `fixed inset-0 bg-black/40 z-40` khi drawer mở

### 3.3 Trang 403 Forbidden — Centered

```
┌──────────────────────────────────────┐
│                                      │
│            [🔒 Icon lớn]             │
│                                      │
│         403 - Không có quyền         │  ← h1
│                                      │
│   Bạn không có quyền truy cập        │
│   khu vực quản trị hệ thống.         │  ← mô tả
│                                      │
│   [  Về trang chủ  ]  [ Đăng xuất ] │
│                                      │
└──────────────────────────────────────┘
```

- **Wrapper:** `min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6`
- **Card:** `text-center max-w-md`

---

## 4. Component Details

### 4.1 AdminSidebarComponent

#### Logo + tên
- **Container:** `flex items-center gap-3 px-5 h-16 border-b border-white/10 flex-shrink-0`
- **Logo:** `src="assets/images/logo.jpeg"`, `w-9 h-9 rounded-full ring-2 ring-[#C9A447]`
- **Tên:** `text-white font-bebas text-lg tracking-[0.15em]` — "SALON ADMIN"

#### Menu navigation

```
Menu Items:
┌──────────────────────────────────┐
│  [icon]  Tổng quan               │  ← /admin/dashboard
│  [icon]  Lịch hẹn                │  ← /admin/appointments
│  [icon]  Nhân viên               │  ← /admin/staff
│  [icon]  Dịch vụ                 │  ← /admin/services
│  [icon]  Sản phẩm                │  ← /admin/products
│  [icon]  Đơn hàng                │  ← /admin/orders
│  [icon]  Báo cáo                 │  ← /admin/reports
└──────────────────────────────────┘
```

- **Menu container:** `flex-1 overflow-y-auto px-3 py-4 space-y-1`
- **Nav item (default):** `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200`
- **Nav item (active):** `bg-[#C9A447] text-white shadow-sm` — dùng `routerLinkActive`
- **Icon:** Lucide icons, `size="18"`, `class="flex-shrink-0"`
- **Text:** `truncate`

| Menu | Icon Lucide | Route |
|---|---|---|
| Tổng quan | `layout-dashboard` | `/admin/dashboard` |
| Lịch hẹn | `calendar-check` | `/admin/appointments` |
| Nhân viên | `users` | `/admin/staff` |
| Dịch vụ | `scissors` | `/admin/services` |
| Sản phẩm | `package` | `/admin/products` |
| Đơn hàng | `shopping-bag` | `/admin/orders` |
| Báo cáo | `bar-chart-2` | `/admin/reports` |

#### Sidebar Footer (thông tin admin)
- **Container:** `px-4 py-4 border-t border-white/10 flex-shrink-0`
- **Avatar:** Nếu có ảnh: `<img class="w-9 h-9 rounded-full object-cover ring-2 ring-[#C9A447]">`, nếu không: initial letter trên nền `bg-[#C9A447]`
- **Tên:** `text-white text-sm font-semibold truncate`
- **Email:** `text-white/50 text-xs truncate`
- **Nút đăng xuất:** `flex items-center gap-2 mt-3 px-3 py-2 w-full rounded-lg text-sm text-white/60 hover:text-red-400 hover:bg-red-400/10 transition-colors`
  - Icon: Lucide `log-out`, `size="16"`
  - Text: "Đăng xuất"
  - `aria-label="Đăng xuất khỏi hệ thống"`

### 4.2 AdminHeaderComponent

- **Container:** `h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between flex-shrink-0`
- **Phần trái:**
  - Desktop: `<h1>` hiển thị tên trang hiện tại, `text-gray-800 text-lg font-semibold`
  - Tablet: Nút hamburger `md:hidden` + tên trang
- **Phần phải:**
  - Avatar + tên admin (ẩn trên mobile, hiện trên desktop)
  - Dropdown với: "Tài khoản" (`/profile`) + đường kẻ + "Đăng xuất"

### 4.3 ForbiddenComponent (trang 403)

- **Icon:** SVG khóa `w-24 h-24 text-gray-300 mx-auto mb-6`
- **Tiêu đề:** `text-4xl font-bold text-gray-800 mb-2` — "403"
- **Phụ đề:** `text-xl font-semibold text-gray-600 mb-3` — "Không có quyền truy cập"
- **Mô tả:** `text-gray-500 text-sm leading-relaxed mb-8` — "Bạn không có quyền truy cập khu vực quản trị hệ thống. Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là nhầm lẫn."
- **Nút "Về trang chủ":** `px-6 py-2.5 bg-[#0d311b] text-white text-sm font-semibold rounded-lg hover:bg-[#0d311b]/90 transition-colors`
- **Nút "Đăng xuất":** `px-6 py-2.5 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors`
- **Gap giữa 2 nút:** `gap-3 flex justify-center`

---

## 5. UI Behavior

### 5.1 Luồng đăng nhập Admin (qua form shared)

```
Admin nhập email + password → nhấn "Đăng nhập"
        │
        ▼
authService.login() → POST /api/v1/auth/login
        │
   ┌────┴────┐
  200       Error (xử lý giống UI-Auth-01)
   │
   ▼
Kiểm tra role từ response
        │
   ┌────┴──────────┐
ADMIN             USER / khác
   │                   │
   ▼                   ▼
navigate('/admin') navigate(returnUrl || '/')
```

### 5.2 AdminGuard — Logic bảo vệ route

```typescript
// admin.guard.ts — Behavior
Truy cập /admin/**
        │
        ▼
authService.isLoggedIn()?
  ├─ Không → router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } })
  └─ Có → authService.isAdmin()?
             ├─ Có  → return true
             └─ Không → router.navigate(['/403'])  // hoặc ['/']
```

### 5.3 loggedInGuard với Admin

```
Admin có session hợp lệ truy cập /auth/login
        │
        ▼
loggedInGuard kiểm tra isLoggedIn()
        │
       true
        │
        ▼
isAdmin()? ── Có ──→ redirect /admin
            ── Không ──→ redirect /
```

### 5.4 Thông báo phiên hết hạn

Khi `authInterceptor` nhận response 401 từ bất kỳ API call nào trong `/admin`:

```
authInterceptor nhận 401
        │
        ▼
tokenService.clear()
        │
        ▼
Hiển thị MatSnackBar (toast góc phải)
  Nội dung: "Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại."
  Duration: 4000ms
  PanelClass: 'snackbar-warning'
        │
        ▼
router.navigate(['/auth/login'])
```

**Toast styling:**
- **Container:** `bg-amber-600 text-white px-4 py-3 rounded-lg shadow-lg`
- **Icon:** Lucide `clock` `size="16"` bên trái text
- **Vị trí:** Bottom-right, `verticalPosition: 'bottom', horizontalPosition: 'end'`

### 5.5 Sidebar active state

- Dùng `routerLinkActive="..."` với `[routerLinkActiveOptions]="{ exact: false }"` để highlight cả parent route
- Ví dụ: `/admin/appointments/123` → menu "Lịch hẹn" vẫn active

### 5.6 Sidebar collapse (tablet)

```
User nhấn hamburger (☰)
        │
        ▼
isSidebarOpen.update(v => !v)
        │
  ┌─────┴──────────┐
true              false
  │                  │
Sidebar hiện       Sidebar ẩn
translate-x-0    -translate-x-full
Backdrop hiện    Backdrop ẩn
```

Nhấn backdrop → đóng sidebar (giống mobile menu của Navbar).

### 5.7 Breadcrumb / Page Title

- Header hiển thị tên trang dựa trên route hiện tại
- Mapping route → title:

| Route | Tiêu đề hiển thị |
|---|---|
| `/admin/dashboard` | "Tổng quan" |
| `/admin/appointments` | "Quản lý Lịch hẹn" |
| `/admin/staff` | "Quản lý Nhân viên" |
| `/admin/services` | "Quản lý Dịch vụ" |
| `/admin/products` | "Quản lý Sản phẩm" |
| `/admin/orders` | "Quản lý Đơn hàng" |
| `/admin/reports` | "Báo cáo & Thống kê" |

---

## 6. Style System

### 6.1 Màu sắc Admin Theme

| Element | Màu | Giá trị |
|---|---|---|
| Sidebar background | Xanh đậm (brand) | `#0d311b` |
| Sidebar text (default) | Trắng mờ | `text-white/70` |
| Sidebar text (hover/active) | Trắng | `text-white` |
| Active nav item bg | Vàng gold | `bg-[#C9A447]` |
| Header background | Trắng | `bg-white` |
| Page background | Xám rất nhạt | `bg-gray-50` |
| Card/panel background | Trắng | `bg-white` |
| Accent / highlight | Gold | `#C9A447` |
| Danger / logout hover | Đỏ nhạt | `text-red-400 bg-red-400/10` |
| Border nhẹ | Xám nhạt | `border-gray-200` |

### 6.2 Typography

| Element | Size | Weight | Color |
|---|---|---|---|
| Sidebar brand name | `1.125rem` (18px) | `700` | `text-white` |
| Sidebar nav item | `0.875rem` (14px) | `500` | `text-white/70` |
| Header page title | `1.125rem` (18px) | `600` | `text-gray-800` |
| Admin username (sidebar) | `0.875rem` (14px) | `600` | `text-white` |
| Admin email (sidebar) | `0.75rem` (12px) | `400` | `text-white/50` |
| 403 error code | `2.25rem` (36px) | `700` | `text-gray-800` |
| 403 subtitle | `1.25rem` (20px) | `600` | `text-gray-600` |
| 403 description | `0.875rem` (14px) | `400` | `text-gray-500` |

### 6.3 Spacing & Sizing

| Element | Giá trị |
|---|---|
| Sidebar width | `240px` (`w-60`) |
| Header height | `64px` (`h-16`) |
| Content padding | `24px` (`p-6`) |
| Nav item padding | `py-2.5 px-3` |
| Nav item border-radius | `8px` (`rounded-lg`) |
| Sidebar nav icon size | `18px` |

### 6.4 Design Feeling Admin

- **Phong cách:** Professional, trustworthy, clean — phân biệt rõ với giao diện người dùng
- **Cảm giác:** Đơn giản, dễ thao tác, mọi thông tin đều ở nơi dễ nhìn
- **Màu nền sidebar xanh đậm** (`#0d311b`) tạo sự phân biệt mạnh với content area trắng
- **Điểm nhấn gold** (`#C9A447`) cho active state — nhất quán với brand identity
- **Animation:** transition 200–300ms cho sidebar, hover states; không dùng animation phức tạp trong admin

---

## 7. Edge Cases — UI Handling

| Tình huống | Xử lý UI |
|---|---|
| Admin mở nhiều tab, phiên hết hạn ở một tab | `authInterceptor` bắt 401 → toast "Phiên hết hạn" → redirect `/auth/login` ngay trên tab đó khi có API call tiếp theo |
| Admin nhấn Back sau khi đăng xuất | `loggedInGuard` trên `/auth/login` không redirect (đã logout) → hiện form login bình thường; các trang `/admin/**` qua `adminGuard` redirect về login |
| URL trực tiếp `/admin/appointments` khi chưa đăng nhập | `adminGuard` redirect `/auth/login?returnUrl=/admin/appointments`; sau đăng nhập thành công → redirect đúng trang `/admin/appointments` |
| USER cố truy cập `/admin` | `adminGuard` kiểm tra role → redirect `/403`; ForbiddenComponent hiển thị |
| Tài khoản Admin bị khóa khi login | Cùng `LoginComponent` shared — AlertBannerComponent hiển thị *"Tài khoản đã bị khóa. Vui lòng liên hệ quản trị cấp cao."* |
| Thông tin đăng nhập sai | AlertBannerComponent: *"Email hoặc mật khẩu không chính xác."* — không tiết lộ thêm |
| Sidebar overflow khi menu dài | `overflow-y-auto` trên nav container — scrollbar ẩn, có thể scroll |
| Màn hình rất nhỏ (< 640px) | Sidebar luôn ở dạng overlay drawer, không chiếm không gian layout |
| Admin đã đăng nhập vào `/auth/login` | `loggedInGuard` → `isAdmin()` = true → `router.navigate(['/admin'])` |

---

## 8. Mapping Business Spec → UI Spec

| Business Spec | UI Implementation |
|---|---|
| **Main Flow bước 2:** chưa đăng nhập → redirect `/auth/login` | `adminGuard`: kiểm tra `isLoggedIn()`, nếu false → `router.navigate(['/auth/login'], { queryParams: { returnUrl } })` |
| **Main Flow bước 6:** kiểm tra role ADMIN | `authService.login()` trả về `AuthResponse` với `user.role`; nếu `'ADMIN'` → `navigate('/admin')`, nếu không → thông báo lỗi |
| **Main Flow bước 8:** Admin Dashboard với menu quản trị | `AdminLayoutComponent` với `AdminSidebarComponent` gồm 7 mục menu; `<router-outlet>` cho nội dung |
| **AF-5.1:** Đăng nhập thành công nhưng role USER | `LoginComponent`: sau `authService.login()` thành công, kiểm tra `currentUser().role`; nếu là USER đang cố vào admin → `AlertBannerComponent`: *"Bạn không có quyền truy cập khu vực quản trị."* |
| **AF-5.2:** Email hoặc mật khẩu sai | `AlertBannerComponent` text chung: *"Email hoặc mật khẩu không chính xác."* |
| **AF-5.3:** Tài khoản bị khóa | `AlertBannerComponent`: *"Tài khoản đã bị khóa. Vui lòng liên hệ quản trị cấp cao."* |
| **AF-5.4:** Admin đã đăng nhập vào `/auth/login` | `loggedInGuard` + `isAdmin()` → `navigate('/admin')` |
| **AF-5.5:** USER truy cập `/admin/**` | `adminGuard` → `navigate('/403')` → `ForbiddenComponent` |
| **BR-ADMIN-01:** Chỉ ADMIN vào được `/admin` | `adminGuard` bảo vệ toàn bộ `/admin/**` |
| **BR-ADMIN-03:** Thông báo lỗi chung | `AlertBannerComponent` không phân biệt sai email hay sai mật khẩu |
| **BR-ADMIN-04:** Phiên có thời gian hiệu lực | `authInterceptor` bắt 401 → toast "Phiên hết hạn" → redirect login |
| **BR-ADMIN-05:** Admin đã đăng nhập → không thấy login | `loggedInGuard`: `isAdmin()` → redirect `/admin` |
| **BR-ADMIN-06:** Mọi trang `/admin` phải bảo vệ | Route `/admin` dùng `canActivate: [adminGuard]` + `loadChildren` → áp dụng cho tất cả child routes |
| **AC-06:** Phiên hết hạn khi làm việc | `authInterceptor` → `MatSnackBar` toast ở bottom-right → `router.navigate(['/auth/login'])` |
| **Edge:** Mở nhiều tab, phiên hết hạn | Mỗi tab xử lý độc lập qua `authInterceptor` — tab nào có API call tiếp theo sẽ redirect trước |

---

## 9. Angular Implementation Notes

### 9.1 AdminGuard

```typescript
// src/app/core/guards/admin.guard.ts
export const adminGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    return router.createUrlTree(['/auth/login'], {
      queryParams: { returnUrl: state.url }
    });
  }
  if (!auth.isAdmin()) {
    return router.createUrlTree(['/403']);
  }
  return true;
};
```

### 9.2 Login redirect theo role

```typescript
// Trong LoginComponent.onSubmit() — sau authService.login() thành công
this.authService.login(credentials).subscribe({
  next: () => {
    const user = this.authService.currentUser();
    if (user?.role === 'ADMIN') {
      this.router.navigate(['/admin']);
    } else {
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
      this.router.navigateByUrl(returnUrl);
    }
  },
  error: (err) => { /* map error → errorMessage */ }
});
```

### 9.3 AdminLayoutComponent signals

```typescript
export class AdminLayoutComponent {
  private authService = inject(AuthService);

  currentUser = this.authService.currentUser;
  isSidebarOpen = signal(false);

  toggleSidebar(): void { this.isSidebarOpen.update(v => !v); }
  closeSidebar(): void { this.isSidebarOpen.set(false); }
  logout(): void { this.authService.logout(); }
}
```

### 9.4 Session expiry toast — authInterceptor

```typescript
// Nếu URL không phải /auth/** và status === 401:
this.snackBar.open(
  'Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.',
  'Đóng',
  { duration: 4000, panelClass: 'snackbar-warning',
    verticalPosition: 'bottom', horizontalPosition: 'end' }
);
this.tokenService.clear();
this.router.navigate(['/auth/login']);
```

**Files cần tạo:**
- `src/app/core/guards/admin.guard.ts`
- `src/app/features/admin/admin.routes.ts`
- `src/app/features/admin/layout/admin-layout.component.ts`
- `src/app/features/admin/layout/admin-layout.component.html`
- `src/app/features/admin/layout/admin-layout.component.scss`
- `src/app/shared/components/forbidden/forbidden.component.ts`
- `src/app/shared/components/forbidden/forbidden.component.html`
