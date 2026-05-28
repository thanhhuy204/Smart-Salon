# FEAT-003: Home — Hero Section

**Trạng thái:** Ready for Development
**Ưu tiên:** P1 — Trang chủ, section đầu tiên
**File implement:** `src/app/features/home/components/hero-section/hero-section.component.ts`
**Business Spec:** `docs/spec-business/Trang chu/BS-Home-01-HeroSection.md`

---

## 1. Business Goal

Tạo ấn tượng đầu tiên mạnh mẽ ngay khi người dùng vào trang chủ — banner full-width với ảnh thực tế của tiệm và slogan thương hiệu nổi bật.

---

## 2. Actors

- **Khách vãng lai / Người dùng** — xem banner, cảm nhận thương hiệu

---

## 3. Preconditions

- Ảnh banner tồn tại tại `assets/images/hero-banner.jpg`
- `HeroSectionComponent` là section đầu tiên trong `HomeComponent`, ngay dưới Navbar
- Navbar cao `64px` → Hero cần `padding-top: 64px` hoặc `margin-top: 64px` để không bị che

---

## 4. Main Flow

1. Người dùng mở trang chủ `/`
2. Hero Section hiển thị ngay lập tức: ảnh nền full-width + slogan đè lên
3. Người dùng thấy thương hiệu và bầu không khí của Salon

---

## 5. UI Specification

### 5.1 Layout

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│   [Ảnh nền toàn màn hình — nhóm thợ + khách]       │
│              (overlay tối)                          │
│                                                     │
│         FROM HEART TO BARB                          │
│       [tagline phụ nếu có]                          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

- **Container:** `w-full`, chiều cao `h-screen` hoặc `min-h-[600px]`
- **Position:** `relative` để đặt text overlay
- Ảnh nền: `object-fit: cover`, `object-position: center`
- Text: `absolute`, căn giữa theo cả 2 trục (`flex items-center justify-center`)

### 5.2 Màu sắc

| Element | Màu | Tailwind / CSS |
|---------|-----|----------------|
| Overlay nền | Đen mờ | `bg-black/50` (50% opacity) |
| Slogan chính | Trắng hoặc vàng | `text-white` hoặc `text-amber-400` |
| Tagline phụ | Trắng mờ | `text-white/80` |
| Placeholder khi ảnh lỗi | Tối ấm | `bg-stone-800` |

### 5.3 Typography

| Element | Font size | Font weight | Style |
|---------|-----------|-------------|-------|
| Slogan chính | `clamp(2.5rem, 6vw, 5rem)` | `700–900` | Serif / Display font |
| Tagline phụ | `clamp(1rem, 2vw, 1.5rem)` | `400` | Sans-serif |

- Font slogan: Google Fonts `Playfair Display` hoặc `Cormorant Garamond` (serif/display)
- Letter-spacing: `tracking-widest` (0.1–0.2em)
- Text-transform: `uppercase`

### 5.4 Component Details

**HeroSectionComponent**
```
HeroSectionComponent
├── <div> background image container    ← w-full h-screen relative
│   ├── <img> hero-banner              ← object-cover w-full h-full absolute inset-0
│   ├── <div> overlay                  ← absolute inset-0 bg-black/50
│   └── <div> text container           ← absolute inset-0 flex flex-col items-center justify-center
│       ├── <h1> slogan chính
│       └── <p> tagline phụ (optional)
```

**Image loading:**
- Attribute `loading="eager"` (above-the-fold, không lazy)
- `alt="Salon barber team"` cho accessibility
- Fallback: CSS `background-color: #292524` (stone-800) khi ảnh lỗi

### 5.5 Responsive

| Breakpoint | Behavior |
|------------|----------|
| Mobile `< 768px` | `min-h-[400px]`, font size nhỏ hơn, padding tăng |
| Tablet `768px–1024px` | `min-h-[500px]` |
| Desktop `> 1024px` | `h-screen` hoặc `min-h-[600px]` |

---

## 6. Animations

| Element | Animation | Trigger | Duration | Delay |
|---------|-----------|---------|----------|-------|
| Slogan | fade-in + slide up | On mount | `800ms` | `200ms` |
| Tagline | fade-in | On mount | `800ms` | `500ms` |

```css
@keyframes heroFadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

---

## 7. Business Rules

- Ảnh nền phải **cover toàn bộ** container, không bị stretch hoặc lặp
- Slogan phải **luôn readable** dù ảnh nền thế nào — nhờ overlay `bg-black/50`
- Text không được bị Navbar che — tính toán `padding-top` hoặc dùng `scroll-margin-top`

---

## 8. Edge Cases

| Tình huống | UI xử lý |
|------------|----------|
| Ảnh không tải được | Background fallback `bg-stone-800`, slogan vẫn hiển thị |
| Kết nối chậm | Hiển thị solid color trước, ảnh fade-in khi load xong |
| Màn hình rất hẹp (<320px) | Font scale nhỏ, không tràn viewport |

---

## 9. Security Requirements

- `alt` text không chứa thông tin nhạy cảm
- Không nhận user input

---

## 10. Accessibility Requirements

- `<h1>` cho slogan — chỉ 1 `h1` trên toàn trang
- `role="banner"` trên section (hoặc dùng thẻ `<header>`)
- Overlay không cản keyboard navigation

---

## 11. Acceptance Criteria

- [ ] Banner chiếm toàn chiều rộng và đủ chiều cao màn hình
- [ ] Ảnh nền hiển thị đúng, không bị vỡ hay stretch
- [ ] Overlay tối đè lên ảnh, slogan hiển thị rõ trên overlay
- [ ] Slogan font display, chữ hoa, màu trắng/vàng
- [ ] Khi ảnh lỗi: nền tối + slogan vẫn hiển thị
- [ ] Không bị Navbar che khuất

---

## 12. Assets cần thiết

- Ảnh banner: `assets/images/hero-banner.jpg` — tối thiểu 1920×1080px
- Font: `Playfair Display` (Google Fonts hoặc local)

---

## 13. Implementation Notes

- **Standalone Component**, không NgModule
- Không cần `inject()` hay service — component render tĩnh
- Dùng Angular `@defer` hoặc `loading="eager"` để ưu tiên load ảnh
- Font display import trong `styles.scss` global:
  ```scss
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');
  ```
