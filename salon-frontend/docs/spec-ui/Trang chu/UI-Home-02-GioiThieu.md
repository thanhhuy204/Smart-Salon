# FEAT-004: Home — Giới thiệu Barbershop

**Trạng thái:** Ready for Development
**Ưu tiên:** P1 — Trang chủ, section 2
**File implement:** `src/app/features/home/components/about-section/about-section.component.ts`
**Business Spec:** `docs/spec-business/Trang chu/BS-Home-02-GioiThieu.md`

---

## 1. Business Goal

Giới thiệu ngắn gọn về Salon và kêu gọi người dùng đặt lịch ngay sau khi đọc — section chuyển tiếp từ Hero sang nội dung chính.

---

## 2. Actors

- **Khách vãng lai / Người dùng** — đọc giới thiệu, nhấn CTA Đặt lịch

---

## 3. Preconditions

- Section này nằm ngay sau `HeroSectionComponent` trong `HomeComponent`
- Section có `id="about"` để hỗ trợ anchor scroll từ Navbar

---

## 4. Main Flow

1. Người dùng cuộn xuống qua Hero Section
2. Section Giới thiệu hiển thị với tiêu đề, mô tả và nút CTA
3. Người dùng nhấn "ĐẶT LỊCH" → điều hướng đến `/booking`

---

## 5. UI Specification

### 5.1 Layout

```
┌───────────────────────────────────────────────────────┐
│                                                       │
│          BARBERSHOP CHUYÊN NGHIỆP                     │
│                                                       │
│   Đoạn mô tả ngắn về Salon — phong cách, dịch vụ,    │
│   cam kết chất lượng. Tối đa 3–4 câu.                 │
│                                                       │
│              [ ĐẶT LỊCH ]                            │
│                                                       │
└───────────────────────────────────────────────────────┘
```

- **Container:** `max-w-3xl mx-auto`, `text-center`, `py-20 px-6`
- Background: `bg-white`

### 5.2 Màu sắc

| Element | Màu | Tailwind |
|---------|-----|----------|
| Background | Trắng | `bg-white` |
| Tiêu đề | Tối | `text-gray-900` |
| Mô tả | Xám vừa | `text-gray-600` |
| Nút CTA — default | Tối / outline | `border-2 border-gray-900 text-gray-900` |
| Nút CTA — hover | Fill tối | `hover:bg-gray-900 hover:text-white` |

### 5.3 Typography

| Element | Font size | Font weight | Style |
|---------|-----------|-------------|-------|
| Tiêu đề | `clamp(1.75rem, 4vw, 2.5rem)` | `700–800` | Uppercase, tracking-wide |
| Mô tả | `1rem–1.125rem` | `400` | Line-height 1.75 |
| Nút CTA | `0.9rem` | `600` | Uppercase, tracking-wider |

### 5.4 Component Details

**AboutSectionComponent**
```
AboutSectionComponent                  ← id="about", bg-white, py-20
├── <h2> "BARBERSHOP CHUYÊN NGHIỆP"   ← text-3xl font-bold uppercase tracking-wide
├── <div> divider line                 ← w-16 h-1 bg-amber-500 mx-auto my-6
├── <p> mô tả Salon                    ← text-gray-600 leading-relaxed max-w-xl mx-auto
└── <a> nút "ĐẶT LỊCH"               ← routerLink="/booking", button style
```

**Nút CTA:**
- `padding: 12px 32px`
- `border-radius: 9999px` (pill shape) hoặc `8px`
- `border: 2px solid #111827`
- Hover transition: `background`, `color` — `duration-200`
- `routerLink="/booking"`

**Divider line dưới tiêu đề:**
- `width: 64px; height: 3px; background: #F59E0B` (amber-500)
- `margin: 24px auto`

### 5.5 Responsive

| Breakpoint | Behavior |
|------------|----------|
| Mobile `< 768px` | `py-12 px-6`, font size giảm nhẹ |
| Desktop `> 768px` | `py-20 px-8`, layout như thiết kế |

---

## 6. Animations

| Element | Animation | Trigger | Duration |
|---------|-----------|---------|----------|
| Tiêu đề + mô tả | fade-in + slide up | Scroll into view | `600ms` |
| Nút CTA | fade-in | Scroll into view | `600ms` delay `200ms` |

Dùng Angular `IntersectionObserver` hoặc CSS `@keyframes` với class trigger khi element vào viewport.

---

## 7. Business Rules

- Nút "ĐẶT LỊCH" luôn điều hướng đến `/booking`
- Không gọi API — nội dung tĩnh (hardcode hoặc từ config)
- `id="about"` để Navbar anchor scroll hoạt động

---

## 8. Edge Cases

| Tình huống | UI xử lý |
|------------|----------|
| Mô tả quá dài | Giới hạn `max-w-xl`, text wrap tự nhiên |
| Người dùng chưa đăng nhập nhấn "ĐẶT LỊCH" | Redirect đến `/booking`, bước sau yêu cầu đăng nhập |

---

## 9. Accessibility Requirements

- `<h2>` cho tiêu đề section (h1 đã dùng ở Hero)
- Nút CTA là `<a routerLink>` — đúng semantic
- Contrast: text xám `#4B5563` trên nền trắng đạt 4.5:1

---

## 10. Acceptance Criteria

- [ ] Tiêu đề "BARBERSHOP CHUYÊN NGHIỆP" hiển thị rõ, font đậm
- [ ] Divider line màu vàng/amber xuất hiện dưới tiêu đề
- [ ] Đoạn mô tả ngắn gọn, tối đa 3–4 câu
- [ ] Nút "ĐẶT LỊCH" hiển thị dưới mô tả
- [ ] Nhấn nút → điều hướng đến `/booking`
- [ ] Anchor `#about` hoạt động từ Navbar link "Giới thiệu"
- [ ] Background trắng, tương phản rõ với Hero tối

---

## 11. Assets cần thiết

- Không cần ảnh
- Nội dung text: cung cấp từ content team hoặc hardcode trong component

---

## 12. Implementation Notes

- **Standalone Component**, không NgModule
- Không cần service hay Signal — component render tĩnh
- `id="about"` trên root element của component
- Scroll behavior: `scroll-margin-top: 64px` (bù chiều cao Navbar) trong SCSS
