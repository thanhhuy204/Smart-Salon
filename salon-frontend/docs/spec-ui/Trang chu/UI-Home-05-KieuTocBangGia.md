# FEAT-007: Home — Kiểu tóc & Bảng giá

**Trạng thái:** Ready for Development
**Ưu tiên:** P1 — Trang chủ, section 5
**File implement:** `src/app/features/home/components/pricing-section/pricing-section.component.ts`
**Business Spec:** `docs/spec-business/Trang chu/BS-Home-05-KieuTocBangGia.md`

---

## 1. Business Goal

Hiển thị gallery kiểu tóc nam và bảng giá dịch vụ — giúp khách hàng tham khảo trước khi đặt lịch. Section có `id="pricing"` để hỗ trợ anchor scroll từ Navbar.

---

## 2. Actors

- **Khách vãng lai / Người dùng** — xem gallery kiểu tóc, xem giá, nhấn "Đặt lịch"

---

## 3. Preconditions

- `PricingSectionComponent` nằm sau `TeamSectionComponent`
- Section có `id="pricing"` cho anchor scroll
- Dữ liệu dịch vụ + giá lấy từ `ServiceService`

---

## 4. Main Flow

1. Người dùng cuộn đến section
2. Gallery 12–16 ảnh kiểu tóc hiển thị dạng grid 3–4 cột
3. Bên dưới hoặc kết hợp: bảng giá dịch vụ
4. Người dùng nhấn "Đặt lịch ngay" → `/booking`

---

## 5. UI Specification

### 5.1 Layout

**Phần 1 — Gallery kiểu tóc:**
```
┌────────────────────────────────────────────────────────┐
│                  KIỂU TÓC & BẢNG GIÁ                  │
│                                                        │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐                          │
│  │ Ảnh│ │ Ảnh│ │ Ảnh│ │ Ảnh│                          │
│  │Tên │ │Tên │ │Tên │ │Tên │                          │
│  │Giá │ │Giá │ │Giá │ │Giá │                          │
│  └────┘ └────┘ └────┘ └────┘                          │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐                          │
│  │ ...│ │ ...│ │ ...│ │ ...│                          │
│  └────┘ └────┘ └────┘ └────┘                          │
│                                                        │
│             [ ĐẶT LỊCH NGAY ]                         │
└────────────────────────────────────────────────────────┘
```

- **Section:** `w-full py-20 px-6`, background xám nhạt hoặc trắng `bg-gray-50`
- **Gallery grid:** `grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4`
- **Max width:** `max-w-6xl mx-auto`

### 5.2 Màu sắc

| Element | Màu | Tailwind |
|---------|-----|----------|
| Section background | Xám rất nhạt | `bg-gray-50` |
| Tiêu đề | Tối | `text-gray-900` |
| Card background | Trắng | `bg-white` |
| Card border | Xám nhạt | `border border-gray-200` |
| Tên dịch vụ/kiểu tóc | Tối | `text-gray-800` |
| Giá | Xanh rêu / Vàng | `text-green-800` hoặc `text-amber-600` |
| Overlay hover | Đen mờ | `bg-black/40` |
| Nút CTA | Tối | `bg-gray-900 text-white` |

### 5.3 Typography

| Element | Font size | Font weight |
|---------|-----------|-------------|
| Tiêu đề section | `clamp(1.5rem, 3vw, 2rem)` | `700` uppercase |
| Tên kiểu tóc / dịch vụ | `0.8rem` | `500` |
| Giá | `0.875rem` | `600` |
| Nút CTA | `0.9rem` | `600` uppercase |

### 5.4 Component Details

**PricingSectionComponent**
```
PricingSectionComponent              ← id="pricing", bg-gray-50, py-20
├── <div> header
│   ├── <h2> "KIỂU TÓC & BẢNG GIÁ"
│   └── <div> divider amber
├── <div> gallery grid
│   └── PriceCardComponent × 12–16  ← *ngFor services
└── <a> nút "ĐẶT LỊCH NGAY"        ← routerLink="/booking", block mx-auto mt-10
```

**PriceCardComponent** (`price-card.component.ts`)
```
PriceCardComponent
├── <div> image container           ← aspect-square overflow-hidden rounded-lg
│   ├── <img> ảnh kiểu tóc         ← object-cover, grayscale filter tối
│   └── <div> hover overlay        ← chứa tên + giá fade-in
└── <div> info (below image)
    ├── <p> tên dịch vụ
    └── <span> giá — định dạng VND
```

**Giá hiển thị:**
- Dùng `CurrencyVndPipe` (`shared/pipes/currency-vnd.pipe.ts`) từ CLAUDE.md
- Format: `150.000 ₫`

**Hover overlay:**
- Background `bg-black/60`
- Text tên + giá màu trắng, căn giữa
- Transition: `opacity 0 → 1`, `200ms`

**Ảnh:**
- `aspect-ratio: 1/1` (vuông) hoặc `aspect-ratio: 3/4` (portrait cho tóc)
- `object-fit: cover; object-position: top`
- CSS filter: `grayscale(15%) contrast(1.1)` — tone tối chuyên nghiệp
- `loading="lazy"`

**Nút CTA:**
- `display: block; margin: 40px auto 0`
- `padding: 14px 40px; border-radius: 8px`
- `bg-gray-900 text-white hover:bg-gray-700`
- `routerLink="/booking"`

### 5.5 Responsive

| Breakpoint | Grid |
|------------|------|
| Mobile `< 640px` | 3 cột |
| Tablet `640px–1024px` | 4 cột |
| Desktop `> 1024px` | 4 cột |

---

## 6. Animations

| Element | Animation | Trigger | Duration |
|---------|-----------|---------|----------|
| Gallery items | fade-in stagger | Scroll into view | `300ms`, stagger `50ms` |
| Hover overlay | fade-in | Hover | `200ms` |

---

## 7. Business Rules

- Dùng `CurrencyVndPipe` để format giá — không hardcode format
- Chỉ hiển thị dịch vụ **active**
- `id="pricing"` + `scroll-margin-top: 64px` cho anchor scroll

---

## 8. Edge Cases

| Tình huống | UI xử lý |
|------------|----------|
| Ảnh không tải | Placeholder `bg-gray-200`, text vẫn hiển thị |
| Ít hơn 12 ảnh | Hiển thị đúng số lượng, grid fill từ trái qua |
| Giá = 0 hoặc null | Hiển thị "Liên hệ" thay vì giá |

---

## 9. Accessibility Requirements

- `<h2>` cho tiêu đề section
- `alt="Kiểu tóc [tên]"` trên ảnh
- Nút CTA dùng `<a routerLink>` — đúng semantic
- `aria-label` trên nút CTA

---

## 10. Acceptance Criteria

- [ ] Tiêu đề "KIỂU TÓC & BẢNG GIÁ" hiển thị rõ
- [ ] Grid 3–4 cột, 12–16 ảnh kiểu tóc
- [ ] Mỗi item có ảnh, tên dịch vụ, giá định dạng VND
- [ ] Hover ảnh → overlay hiển thị thông tin
- [ ] Nút "ĐẶT LỊCH NGAY" hiển thị cuối section
- [ ] Anchor `#pricing` hoạt động từ Navbar
- [ ] `CurrencyVndPipe` áp dụng đúng định dạng giá

---

## 11. Assets cần thiết

- Ảnh kiểu tóc: 
`assets\images\toc1.avif`
`assets\images\toc2.avif` 
`assets\images\toc3.avif`
`assets\images\toc4.avif`
`assets\images\toc5.avif`
`assets\images\toc6.avif`
`assets\images\toc7.avif`
`assets\images\toc8.avif`— tối thiểu 400×400px
- `CurrencyVndPipe`: `src/app/shared/pipes/currency-vnd.pipe.ts`

---

## 12. Implementation Notes

- **Standalone Component**, không NgModule
- Ảnh **tĩnh, hardcoded** trong component — không fetch từ API:
  - `assets/images/toc1.avif` → `assets/images/toc8.avif` (8 kiểu tóc)
- Dữ liệu (tên kiểu tóc, giá) hardcode trong component dưới dạng constant array
- Không dùng service, không dùng `async pipe` — render tĩnh hoàn toàn
- Import `CurrencyVndPipe` vào `PricingSectionComponent` imports array để format giá
- `PriceCardComponent` là standalone child component
- `id="pricing"` trên root element, `scroll-margin-top: 64px` trong SCSS
