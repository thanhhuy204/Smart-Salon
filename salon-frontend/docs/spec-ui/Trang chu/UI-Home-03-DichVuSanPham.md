# FEAT-005: Home — Dịch vụ & Sản phẩm

**Trạng thái:** Ready for Development
**Ưu tiên:** P1 — Trang chủ, section 3
**File implement:** `src/app/features/home/components/services-section/services-section.component.ts`
**Business Spec:** `docs/spec-business/Trang chu/BS-Home-03-DichVuSanPham.md`

---

## 1. Business Goal

Giới thiệu tổng quan các dịch vụ nổi bật của Salon trên nền xanh rêu đậm — màu chủ đạo thương hiệu — để người dùng nhận biết và được dẫn dắt tìm hiểu thêm.

---

## 2. Actors

- **Khách vãng lai / Người dùng** — xem card dịch vụ, nhấn "Xem thêm"

---

## 3. Preconditions

- `ServicesSectionComponent` nằm sau `AboutSectionComponent` trong `HomeComponent`
- Dữ liệu dịch vụ lấy từ `ServiceService` (`core/services/` hoặc feature service)
- Cần ít nhất 1 dịch vụ để render section

---

## 4. Main Flow

1. Người dùng cuộn đến section
2. Hiển thị tiêu đề + grid cards dịch vụ trên nền xanh rêu
3. Người dùng nhấn "Xem thêm" trên một card → điều hướng đến `/booking`

---

## 5. UI Specification

### 5.1 Layout

```
┌──────────────────────────────────────────────────────────┐  ← bg xanh rêu đậm
│              DỊCH VỤ - SẢN PHẨM                         │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│  │  [Ảnh]  │  │  [Ảnh]  │  │  [Ảnh]  │               │
│  │ Tên DV  │  │ Tên DV  │  │ Tên DV  │               │
│  │ Mô tả   │  │ Mô tả   │  │ Mô tả   │               │
│  │[Xem thêm]│  │[Xem thêm]│  │[Xem thêm]│              │
│  └──────────┘  └──────────┘  └──────────┘               │
└──────────────────────────────────────────────────────────┘
```

- **Section:** `w-full py-20 px-6`, `bg-green-900` (hoặc custom dark-green)
- **Grid:** `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- **Max width:** `max-w-6xl mx-auto`

### 5.2 Màu sắc

| Element | Màu | Tailwind / CSS |
|---------|-----|----------------|
| Section background | Xanh rêu đậm | `bg-green-900` hoặc `#1a2e1a` |
| Tiêu đề section | Trắng hoặc vàng | `text-white` hoặc `text-amber-400` |
| Divider line | Vàng amber | `bg-amber-500` |
| Card background | Xanh rêu tối hơn | `bg-green-950` hoặc `rgba(0,0,0,0.3)` |
| Card border | Xanh rêu nhạt hơn | `border border-green-700` |
| Tên dịch vụ | Trắng | `text-white` |
| Mô tả dịch vụ | Xám nhạt | `text-gray-300` |
| Nút "Xem thêm" | Outline trắng/vàng | `border border-amber-400 text-amber-400` |
| Nút hover | Fill vàng | `hover:bg-amber-400 hover:text-gray-900` |

### 5.3 Typography

| Element | Font size | Font weight |
|---------|-----------|-------------|
| Tiêu đề section | `clamp(1.5rem, 3vw, 2rem)` | `700` uppercase |
| Tên dịch vụ | `1.125rem` | `600` |
| Mô tả | `0.875rem` | `400` line-height 1.6 |
| Nút | `0.8rem` | `500` uppercase tracking-wider |

### 5.4 Component Details

**ServicesSectionComponent**
```
ServicesSectionComponent              ← bg-green-900, py-20
├── <div> header
│   ├── <h2> "DỊCH VỤ - SẢN PHẨM"
│   └── <div> divider amber
├── <div> grid cards
│   └── ServiceCardComponent × N      ← *ngFor dịch vụ
└── [Loading state]                   ← skeleton nếu đang fetch
```

**ServiceCardComponent** (`service-card.component.ts`)
```
ServiceCardComponent
├── <div> image container             ← aspect-ratio 16/9, overflow-hidden
│   └── <img> ảnh dịch vụ            ← object-cover, lazy loading
├── <div> content
│   ├── <h3> tên dịch vụ
│   ├── <p> mô tả ngắn (max 2 dòng, truncate)
│   └── <a> nút "Xem thêm"           ← routerLink="/booking"
```

**Image:**
- `aspect-ratio: 16/9`, `object-fit: cover`
- Tone tối: CSS filter `brightness(0.85) contrast(1.1)` để tạo cảm giác vintage
- `loading="lazy"` (below-the-fold)
- `alt="[Tên dịch vụ]"`

**Mô tả truncate:**
- `-webkit-line-clamp: 2`
- `overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical`

**Loading state:**
- Skeleton card: `animate-pulse bg-green-800 rounded-lg h-64`
- Hiển thị 3 skeleton cards trong khi fetch

**Empty state:**
- Text: "Đang cập nhật dịch vụ..." — màu `text-gray-400`

### 5.5 Responsive

| Breakpoint | Grid |
|------------|------|
| Mobile `< 768px` | 1 cột |
| Tablet `768px–1024px` | 2 cột |
| Desktop `> 1024px` | 3 cột |

---

## 6. Animations

| Element | Animation | Trigger | Duration |
|---------|-----------|---------|----------|
| Cards | fade-in stagger | Scroll into view | `500ms`, delay `100ms` mỗi card |
| Card hover | translateY(-4px) + shadow tăng | Hover | `200ms` |

---

## 7. Business Rules

- Chỉ hiển thị dịch vụ **đang active**
- Nút "Xem thêm" → `/booking`
- Ảnh dịch vụ lỗi → placeholder màu `bg-green-800`

---

## 8. Edge Cases

| Tình huống | UI xử lý |
|------------|----------|
| Ảnh không tải | Placeholder bg tối, text vẫn hiển thị |
| Không có dịch vụ | Section ẩn hoặc hiển thị "Đang cập nhật" |
| Mô tả quá dài | Line-clamp 2 dòng + `...` |
| Lỗi load dữ liệu | Toast lỗi, section hiển thị empty state |

---

## 9. Accessibility Requirements

- `<h2>` cho tiêu đề section
- `<h3>` cho tên dịch vụ trong card
- `alt` text đầy đủ cho ảnh dịch vụ
- Nút "Xem thêm" có `aria-label="Xem thêm về [tên dịch vụ]"` để phân biệt

---

## 10. Acceptance Criteria

- [ ] Section nền xanh rêu đậm, tiêu đề màu trắng/vàng
- [ ] Hiển thị grid cards dịch vụ (tối thiểu 2 cards)
- [ ] Mỗi card có ảnh, tên dịch vụ, mô tả ngắn, nút "Xem thêm"
- [ ] Ảnh dịch vụ đúng tỷ lệ, không bị vỡ
- [ ] Nhấn "Xem thêm" → điều hướng đến `/booking`
- [ ] Ảnh lỗi → placeholder tối, card vẫn hiển thị text
- [ ] Responsive: mobile 1 cột, desktop 3 cột
- [ ] Loading state: skeleton cards khi đang fetch

---

## 11. Assets cần thiết

- Ảnh dịch vụ: 
`assets\images\cat.avif`
`assets\images\goi.avif`
`assets\images\sanpham.avif`
- Placeholder ảnh: CSS background color `#14532d` (green-900)

---

## 12. Implementation Notes

- **Standalone Component**, không NgModule
- Ảnh **tĩnh, hardcoded** trong component — không fetch từ API:
  - `assets/images/cat.avif` — Cắt tóc
  - `assets/images/goi.avif` — Gội đầu
  - `assets/images/sanpham.avif` — Sản phẩm
- Dữ liệu dịch vụ (tên, mô tả) hardcode trong component hoặc khai báo dưới dạng constant array
- Không dùng service, không dùng `async pipe` — render tĩnh hoàn toàn
- `ServiceCardComponent` là standalone child component
- `loading="lazy"` trên `<img>` (below-the-fold)
