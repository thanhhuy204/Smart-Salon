# FEAT-001: Navbar Component

**Trạng thái:** Ready for Development
**Ưu tiên:** P0 — Core layout component, required for all pages
**File implement:** `src/app/shared/components/navbar/navbar.component.ts`
**Business Spec:** `docs/spec-business/Layout/BS-Layout-Navbar.md`

---

## 1. Business Goal

Cung cấp thanh điều hướng cố định xuyên suốt toàn bộ ứng dụng Salon, giúp người dùng dễ dàng điều hướng giữa các trang chính, nhận diện thương hiệu ngay lập tức, và truy cập nhanh tài khoản cá nhân. Navbar phải hoạt động nhất quán trên cả desktop lẫn mobile.

---

## 2. Actors

- **Khách vãng lai** — người dùng chưa đăng nhập, điều hướng xem thông tin Salon
- **Người dùng đã đăng nhập (USER)** — thấy avatar và menu tài khoản thay nút Đăng nhập
- **Quản trị viên (ADMIN)** — thấy thêm mục "Quản trị" trong dropdown tài khoản

---

## 3. Preconditions

- Angular Router đã cấu hình đúng các routes theo CLAUDE.md:
  - `/` — Home (landing page)
  - `/booking` — Đặt lịch (4 bước)
  - `/shop` — Sản phẩm
  - `/auth/login` — Đăng nhập
  - `/profile` — Hồ sơ cá nhân (yêu cầu `AuthGuard`)
  - `/admin` — Quản trị (yêu cầu `AdminGuard`)
- "Giới thiệu" và "Bảng giá" là **anchor scroll** đến section trên trang chủ (`/#about`, `/#pricing`), không phải route riêng
- `AuthService` (`core/services/auth.service.ts`) cung cấp trạng thái đăng nhập
- `TokenService` (`core/services/token.service.ts`) quản lý JWT lưu trong `localStorage` (key: `access_token`)
- Logo image tồn tại tại `assets/images/logo.png`
- Tailwind CSS 3.x và Angular Material 19.x đã được cài đặt

---

## 4. Main Flow

1. Người dùng truy cập bất kỳ trang nào của ứng dụng
2. Hệ thống render `NavbarComponent` fixed ở top với logo, menu items và khu vực actions
3. Người dùng nhấn vào một NavLink (Giới thiệu, Đặt lịch, Bảng giá, Sản phẩm)
4. Hệ thống điều hướng đến route tương ứng, NavLink đó chuyển sang trạng thái active
5. **[Chưa đăng nhập]** Người dùng nhấn nút "Đăng nhập"
6. Hệ thống điều hướng đến `/auth/login`
7. **[Đã đăng nhập]** Người dùng nhấn avatar/tên
8. Hệ thống hiển thị dropdown với: Hồ sơ cá nhân, (Quản trị — ADMIN only), Đăng xuất
9. Trên mobile, người dùng nhấn burger icon (☰)
10. Hệ thống mở drawer với đầy đủ NavLinks và Actions
11. Người dùng nhấn NavLink trong drawer → hệ thống điều hướng và tự đóng drawer

---

## 5. UI Specification

### 5.1 Layout

**Desktop (≥ 768px)**

- **Container:** Full width, `position: fixed`, `top: 0`, `z-index: 50`, height `64px`
- **Inner layout:** `flex`, `items-center`, `justify-between`, `px-8`
  - Logo: `flex-shrink-0`, góc trái
  - Nav Menu: `flex gap-8`, `mx-auto` (căn giữa tuyệt đối)
  - Actions: `flex-shrink-0`, góc phải, `gap-3`

**Mobile (< 768px)**

- Desktop nav ẩn hoàn toàn (`hidden md:flex`)
- Chỉ hiện logo (góc trái) và burger icon (góc phải)
- Drawer mở full-width, xuất hiện bên dưới Navbar, `max-height: calc(100vh - 64px)`, `overflow-y: auto`

```
[Desktop]
┌─────────────────────────────────────────────────────────────────────┐
│  [Logo]      [Giới thiệu]  [Đặt lịch]  [Bảng giá]  [Sản phẩm]    [Đăng nhập]  │
└─────────────────────────────────────────────────────────────────────┘

[Mobile]
┌───────────────────────────────┐
│  [Logo]                  [☰]  │
└───────────────────────────────┘
     ↓ (khi mở)
┌───────────────────────────────┐
│  Giới thiệu                   │
│  Đặt lịch                     │
│  Bảng giá                     │
│  Sản phẩm                     │
│  ─────────────────────────    │
│  [Đăng nhập] / [Avatar + Tên] │
└───────────────────────────────┘
```

---

### 5.2 Màu sắc

| Element | Màu | Tailwind / CSS |
|---------|-----|----------------|
| Navbar background | Trắng nhẹ | `bg-white/95` |
| Navbar border bottom | Xám nhạt | `border-b border-gray-200` |
| Navbar shadow khi scroll | Bóng nhẹ | `shadow-sm` (thêm khi `scrollY > 0`) |
| NavLink mặc định | Xám vừa | `text-gray-600` |
| NavLink hover | Tối | `text-gray-900` |
| NavLink active | Thương hiệu (xanh rêu/vàng) | `text-green-800` + `border-b-2 border-amber-500` |
| Nút Đăng nhập — border | Tối nhẹ | `border border-gray-800 text-gray-800` |
| Nút Đăng nhập — hover | Fill tối | `bg-gray-800 text-white` |
| Dropdown background | Trắng | `bg-white shadow-lg border border-gray-100` |
| Dropdown item hover | Xám rất nhạt | `hover:bg-gray-50` |
| Mobile overlay | Đen mờ | `bg-black/40` |
| Mobile drawer | Trắng | `bg-white` |

---

### 5.3 Typography

| Element | Font size | Font weight | Màu |
|---------|-----------|-------------|-----|
| NavLink | `0.9rem` | `500` | `#4B5563` |
| NavLink active | `0.9rem` | `600` | `#166534` (green-800) |
| Nút Đăng nhập | `0.85rem` | `500` | `#1F2937` |
| Tên người dùng (dropdown trigger) | `0.9rem` | `500` | `#1F2937` |
| Dropdown menu item | `0.85rem` | `400` | `#374151` |
| Mobile nav item | `1rem` | `500` | `#1F2937` |

---

### 5.4 Component Details

**NavbarComponent** (`navbar.component.ts`)
- `position: fixed; top: 0; left: 0; right: 0; z-index: 50`
- `backdrop-filter: blur(8px)`
- `border-bottom: 1px solid #E5E7EB`
- Thêm class `shadow-sm` khi `scrollY > 10px`

**Logo** (`NavbarLogoComponent`)
- Image: `assets/images/logo.png`, width `40px`, height `40px`, object-fit: `contain`
- Hình tròn: `rounded-full border-2 border-amber-500`
- `routerLink="/"`
- Hover: `opacity-80 transition-opacity duration-200`

**NavLink Item**
- `padding: 8px 4px`
- `background: none; border: none; cursor: pointer`
- `transition: color 200ms ease`
- Active: thêm `border-b-2 border-amber-500 font-semibold text-green-800`
- Angular: dùng `routerLinkActive` directive

**Nav Links — routes**

| Label | Route / Fragment | Ghi chú |
|-------|-----------------|---------|
| Giới thiệu | `/#about` | Anchor scroll đến section Giới thiệu trên Home |
| Đặt lịch | `/booking` | Lazy-loaded feature route |
| Bảng giá | `/#pricing` | Anchor scroll đến section Bảng giá trên Home |
| Sản phẩm | `/shop` | Lazy-loaded feature route |

**Nút Đăng nhập** (chưa đăng nhập)
- `border: 1px solid #1F2937; color: #1F2937`
- `padding: 8px 16px; border-radius: 6px`
- Hover: `background: #1F2937; color: white`
- `routerLink="/auth/login"`

**UserMenuDropdownComponent** (`user-menu-dropdown.component.ts`) (đã đăng nhập)
- Trigger: Avatar tròn (`w-9 h-9 rounded-full`) + Tên người dùng (truncate `max-w-[120px]`)
- Dropdown:
  - `position: absolute; top: 100%; right: 0`
  - `min-width: 180px; border-radius: 8px`
  - `box-shadow: 0 4px 16px rgba(0,0,0,0.1)`
  - `border: 1px solid #F3F4F6`
- Menu items:

| Label | Route | Hiển thị với |
|-------|-------|-------------|
| Hồ sơ cá nhân | `/profile` | USER + ADMIN |
| Quản trị | `/admin` | ADMIN only |
| Đăng xuất | — (action) | USER + ADMIN |

**Mobile Burger Button**
- SVG icon `☰` / `✕`, `width: 24px; height: 24px`
- `stroke: #374151; stroke-width: 2`
- `aria-label="Mở menu"` / `"Đóng menu"`

**Mobile Drawer**
- `position: absolute; top: 64px; left: 0; right: 0`
- `background: white; border-top: 1px solid #E5E7EB`
- `max-height: calc(100vh - 64px); overflow-y: auto`
- Mỗi NavLink item: `width: 100%; padding: 14px 24px; border-bottom: 1px solid #F3F4F6`
- Đóng khi: nhấn NavLink, nhấn overlay, nhấn ✕

---

### 5.5 Responsive Breakpoints

| Device | Breakpoint | Nav hiển thị | Menu type |
|--------|------------|-------------|-----------|
| Mobile | `< 768px` | Ẩn desktop nav, hiện burger | Drawer slide down |
| Tablet | `768px – 1024px` | Hiện desktop nav, giảm padding | Inline |
| Desktop | `> 1024px` | Full layout, padding thoải mái | Inline |

---

## 6. Animations

| Element | Animation | Trigger | Duration | Easing |
|---------|-----------|---------|----------|--------|
| Dropdown | fade-in + slide down 8px | Click avatar | `200ms` | `ease-out` |
| Dropdown arrow | rotate 180° | Toggle | `200ms` | `ease` |
| Mobile drawer | slide down từ top | Click ☰ | `250ms` | `ease-out` |
| Overlay | fade-in | Drawer mở | `200ms` | `ease` |
| NavLink hover | color transition | Hover | `150ms` | `ease` |

```css
@keyframes fadeSlideDown {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes drawerSlideDown {
  from { opacity: 0; transform: translateY(-16px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

---

## 7. Business Rules

- Logo luôn link về `/` (`routerLink="/"`)
- Menu gồm đúng 4 mục theo thứ tự: *Giới thiệu → Đặt lịch → Bảng giá → Sản phẩm*
- Nút Đăng nhập **chỉ hiển thị** khi `authService.isLoggedIn()` trả về `false`
- `UserMenuDropdownComponent` **chỉ hiển thị** khi `authService.isLoggedIn()` trả về `true`
- Mục "Quản trị" trong dropdown **chỉ hiển thị** khi role = `RoleName.ADMIN` (enum tại `core/models/`)
- Dropdown chỉ mở **một cái tại một thời điểm** — click ra ngoài để đóng
- Mobile drawer tự đóng khi người dùng **navigate** hoặc **click overlay**
- Navbar render **tĩnh ngay lập tức** — không phụ thuộc API call

---

## 8. Edge Cases

| Tình huống | UI xử lý |
|------------|----------|
| Ảnh avatar lỗi | Hiển thị initials (2 chữ đầu tên) trên nền màu tương ứng |
| Tên người dùng quá dài (> 15 ký tự) | `max-w-[120px] truncate overflow-hidden` |
| Ảnh logo không tải được | Hiển thị tên "Salon" dạng text fallback |
| Màn hình < 375px | Logo scale nhỏ (`w-8 h-8`), không bị tràn |
| Trang tải chậm | Navbar render tĩnh ngay, không skeleton hay spinner |
| Đăng nhập ở tab khác | Khi user focus lại tab, kiểm tra token → re-render góc phải |
| Nhấn logo khi đang ở `/` | Không lỗi, không reload ngoài ý muốn |

---

## 9. Security Requirements

- Không hiển thị thông tin nhạy cảm (token, email đầy đủ) trên Navbar
- Các route điều hướng phải được validate, không nhận input từ URL params
- Mục "Quản trị" chỉ render khi `role === RoleName.ADMIN` — route `/admin` bảo vệ bởi `AdminGuard` (`core/guards/admin.guard.ts`)

---

## 10. Accessibility Requirements

- `aria-label="Logo - Về trang chủ"` trên Logo link
- `aria-label="Mở menu điều hướng"` / `"Đóng menu"` trên burger button
- `aria-expanded="true/false"` trên dropdown trigger
- `role="navigation"` trên thẻ `<nav>`
- `role="menu"` và `role="menuitem"` trên dropdown list
- Keyboard navigation: `Tab` để focus, `Enter` để chọn, `Escape` để đóng dropdown/drawer
- Color contrast ratio ≥ 4.5:1 (NavLink text trên nền trắng)
- Touch target tối thiểu: `44px × 44px` cho tất cả button/link

---

## 11. Acceptance Criteria

- [ ] Navbar hiển thị cố định trên tất cả các trang, kể cả trang 404
- [ ] Logo nhấn điều hướng về `/`
- [ ] 4 NavLink hiển thị đúng thứ tự: Giới thiệu, Đặt lịch, Bảng giá, Sản phẩm
- [ ] NavLink active khác biệt rõ ràng so với các link còn lại
- [ ] Nhấn NavLink điều hướng đúng route tương ứng
- [ ] Khi chưa đăng nhập: góc phải hiển thị nút "Đăng nhập"
- [ ] Khi đã đăng nhập: nút Đăng nhập biến mất, thay bằng avatar + tên
- [ ] Dropdown tài khoản hiển thị đúng menu items theo role
- [ ] Nhấn "Đăng xuất" → xóa session và về trang chủ
- [ ] Trên mobile: ẩn desktop nav, hiện burger icon
- [ ] Nhấn burger icon → drawer mở với đầy đủ NavLinks
- [ ] Nhấn NavLink trong drawer → điều hướng và đóng drawer
- [ ] Navbar thêm `shadow-sm` khi scroll xuống
- [ ] Keyboard navigation và accessibility pass WCAG AA
- [ ] Không có console errors

---

## 12. Assets cần thiết

- Logo: `assets/images/logo.png` — 40×40px, dạng huy hiệu tròn, hình ảnh kéo/barber
- Avatar fallback: CSS initials component (không cần file ảnh)
- Icons: Lucide Angular — `MenuIcon`, `XIcon`, `UserIcon`, `ChevronDownIcon`

---

## 13. Implementation Notes

**Cấu trúc file (theo CLAUDE.md `shared/components/`)**
```
src/app/shared/components/navbar/
├── navbar.component.ts
├── navbar.component.html
├── navbar.component.scss
└── user-menu-dropdown/
    ├── user-menu-dropdown.component.ts
    ├── user-menu-dropdown.component.html
    └── user-menu-dropdown.component.scss
```

**Angular conventions (theo CLAUDE.md)**
- **Standalone Component** — không dùng NgModule
- Dùng `inject()` thay constructor injection:
  ```ts
  private authService = inject(AuthService);   // core/services/auth.service.ts
  private tokenService = inject(TokenService); // core/services/token.service.ts
  private router = inject(Router);
  ```
- Dùng **Signals** cho local state:
  ```ts
  isMenuOpen = signal(false);
  isDropdownOpen = signal(false);
  hasScrolled = signal(false);
  ```
- `currentUser` lấy từ `authService` qua Signal hoặc `async pipe` — không gọi trực tiếp `localStorage`
- Dùng `RoleName` enum (`core/models/`) để kiểm tra quyền — không dùng string literal `'ADMIN'`
- `routerLinkActive="active-link"` directive cho active state
- Anchor scroll (`/#about`, `/#pricing`) dùng `fragment` binding của Angular Router

**Routing**
- Route `/profile` được bảo vệ bởi `AuthGuard` (`core/guards/auth.guard.ts`)
- Route `/admin` được bảo vệ bởi `AdminGuard` (`core/guards/admin.guard.ts`)
- Khi `ErrorInterceptor` nhận 401 → tự redirect `/auth/login` (không cần xử lý trong Navbar)

**Kỹ thuật khác**
- Click outside detection: `HostListener('document:click')` với `@ViewChild` ref
- Scroll detection: `HostListener('window:scroll')` → toggle `hasScrolled` signal
- Mobile detection: **CSS media queries** — không dùng JS detect viewport
- `NavbarComponent` khai báo trong `AppComponent` template, đặt **trước** `<router-outlet>`
