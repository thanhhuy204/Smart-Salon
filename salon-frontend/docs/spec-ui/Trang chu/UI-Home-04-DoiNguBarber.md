# FEAT-006: Home — Đội ngũ Barber

**Trạng thái:** Ready for Development
**Ưu tiên:** P1 — Trang chủ, section 4
**File implement:** `src/app/features/home/components/team-section/team-section.component.ts`
**Business Spec:** `docs/spec-business/Trang chu/BS-Home-04-DoiNguBarber.md`

---

## 1. Business Goal

Xây dựng niềm tin bằng cách giới thiệu trực quan đội ngũ barber — lưới ảnh chân dung chuyên nghiệp, tone đen trắng hoặc tối.

---

## 2. Actors

- **Khách vãng lai / Người dùng** — xem ảnh barber, tìm hiểu đội ngũ

---

## 3. Preconditions

- `TeamSectionComponent` nằm sau `ServicesSectionComponent` trong `HomeComponent`
- Dữ liệu staff lấy từ `StaffService`
- Cần ít nhất 1 barber active để render section

---

## 4. Main Flow

1. Người dùng cuộn đến section Đội ngũ
2. Hiển thị tiêu đề + lưới ảnh chân dung 6–8 barber
3. Người dùng xem qua, tùy chọn nhấn vào ảnh một barber để xem thêm

---

## 5. UI Specification

### 5.1 Layout

```
┌───────────────────────────────────────────────────────┐  ← bg trắng
│                  ĐỘI NGŨ BARBER                       │
│                                                       │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐               │
│  │ Ảnh │  │ Ảnh │  │ Ảnh │  │ Ảnh │                   │
│  │ Tên │  │ Tên │  │ Tên │  │ Tên │                   │
│  └──────┘  └──────┘  └──────┘  └──────┘              │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐              │
│  │ Ảnh │  │ Ảnh │  │ Ảnh │  │ Ảnh │                   │
│  │ Tên │  │ Tên │  │ Tên │  │ Tên │                   │
│  └──────┘  └──────┘  └──────┘  └──────┘              │
└───────────────────────────────────────────────────────┘
```

- **Section:** `w-full py-20 px-6`, `bg-white`
- **Grid:** `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6`
- **Max width:** `max-w-6xl mx-auto`

### 5.2 Màu sắc

| Element | Màu | Tailwind |
|---------|-----|----------|
| Background section | Trắng | `bg-white` |
| Tiêu đề | Tối | `text-gray-900` |
| Tên barber | Tối | `text-gray-800` |
| Chuyên môn (optional) | Xám | `text-gray-500` |
| Card hover overlay | Đen mờ | `bg-black/20` |
| Ảnh filter | Đen trắng / tối | CSS `grayscale(30%) contrast(1.1)` |

### 5.3 Typography

| Element | Font size | Font weight |
|---------|-----------|-------------|
| Tiêu đề section | `clamp(1.5rem, 3vw, 2rem)` | `700` uppercase |
| Tên barber | `0.9rem` | `600` |
| Chuyên môn | `0.8rem` | `400` |

### 5.4 Component Details

**TeamSectionComponent**
```
TeamSectionComponent                ← bg-white, py-20
├── <div> header
│   ├── <h2> "ĐỘI NGŨ BARBER"
│   └── <div> divider amber
└── <div> grid
    └── BarberCardComponent × 6–8   ← *ngFor staff list (tối đa 8)
```

**BarberCardComponent** (`barber-card.component.ts`)
```
BarberCardComponent
├── <div> image wrapper             ← aspect-square, overflow-hidden, rounded-lg
│   ├── <img> ảnh chân dung         ← object-cover, object-top, grayscale filter
│   └── <div> hover overlay         ← opacity-0 → opacity-100 on hover
└── <div> info
    ├── <p> tên barber
    └── <p> chuyên môn (optional)
```

**Ảnh barber:**
- Tỷ lệ: `aspect-ratio: 1/1` (hình vuông)
- `object-fit: cover; object-position: top` (ưu tiên khuôn mặt)
- CSS filter: `filter: grayscale(20%) contrast(1.05)` — tone chuyên nghiệp
- `border-radius: 8px`
- Hover: `transform: scale(1.05)`, `transition: 300ms`

**Avatar fallback (ảnh lỗi):**
- Background: `bg-gray-200`
- Icon `UserIcon` (Lucide) căn giữa, `w-12 h-12 text-gray-400`
- Tên barber vẫn hiển thị

**Loading skeleton:**
- `animate-pulse bg-gray-200 rounded-lg aspect-square`
- Hiển thị 8 skeleton trong khi fetch

### 5.5 Responsive

| Breakpoint | Grid |
|------------|------|
| Mobile `< 640px` | 2 cột |
| Tablet `640px–1024px` | 3 cột |
| Desktop `> 1024px` | 4 cột |

---

## 6. Animations

| Element | Animation | Trigger | Duration |
|---------|-----------|---------|----------|
| Cards | fade-in stagger | Scroll into view | `400ms`, stagger `80ms` |
| Ảnh hover | scale(1.05) | Hover | `300ms ease` |
| Hover overlay | fade-in | Hover | `200ms` |

---

## 7. Business Rules

- Chỉ hiển thị barber **active** (không bị ẩn bởi admin)
- Tối đa **8 barber** trên trang chủ
- Tên barber luôn hiển thị

---

## 8. Edge Cases

| Tình huống | UI xử lý |
|------------|----------|
| Ảnh barber lỗi | Placeholder avatar icon + tên vẫn hiển thị |
| Ít hơn 8 barber | Hiển thị đúng số lượng, grid tự căn chỉnh |
| Không có barber | Section ẩn hoàn toàn |
| Tên quá dài | Truncate 1 dòng |

---

## 9. Accessibility Requirements

- `<h2>` cho tiêu đề section
- `alt="Ảnh barber [Tên]"` trên mỗi ảnh
- Nếu card có thể nhấn: `role="button"` hoặc dùng `<a>` với `aria-label`

---

## 10. Acceptance Criteria

- [ ] Tiêu đề "ĐỘI NGŨ BARBER" hiển thị rõ
- [ ] Grid ảnh 2–4 cột tùy màn hình, 6–8 barber
- [ ] Ảnh đồng đều kích thước, tỷ lệ vuông
- [ ] Tên barber hiển thị dưới mỗi ảnh
- [ ] Ảnh lỗi → placeholder avatar + tên vẫn hiển thị
- [ ] Hover trên ảnh → scale nhẹ
- [ ] Loading state: skeleton cards

---

## 11. Assets cần thiết

- Ảnh barber: 
`assets/images/nv1.jpg` 
`assets/images/nv2.jpg`
`assets/images/nv3.jpg`
`assets/images/nv4.jpg`
`assets/images/nv5.jpg`— tối thiểu 400×400px
- Avatar placeholder: Lucide `UserIcon`

---

## 12. Implementation Notes

- **Standalone Component**, không NgModule
- Ảnh **tĩnh, hardcoded** trong component — không fetch từ API:
  - `assets/images/nv1.jpg` → `assets/images/nv5.jpg` (5 barber)
- Dữ liệu barber (tên, chuyên môn) hardcode trong component dưới dạng constant array
- Không dùng service, không dùng `async pipe` — render tĩnh hoàn toàn
- `BarberCardComponent` là standalone child component
- CSS grayscale filter khai báo trong SCSS của component:
  ```scss
  img { filter: grayscale(20%) contrast(1.05); }
  ```
