# FEAT-008: Home — Sản phẩm chăm sóc tóc

**Trạng thái:** Ready for Development
**Ưu tiên:** P1 — Trang chủ, section 6 (cuối cùng trước Footer)
**File implement:** `src/app/features/home/components/products-section/products-section.component.ts`
**Business Spec:** `docs/spec-business/Trang chu/BS-Home-06-SanPhamChamSocToc.md`

---

## 1. Business Goal

Giới thiệu sản phẩm chăm sóc tóc nổi bật trên nền tối — kêu gọi người dùng mua sắm và điều hướng đến trang Shop.

---

## 2. Actors

- **Khách vãng lai / Người dùng** — xem sản phẩm, nhấn "Xem chi tiết" hoặc "Xem tất cả sản phẩm"

---

## 3. Preconditions

- `ProductsSectionComponent` là section cuối cùng trong `HomeComponent`, trước Footer
- Dữ liệu sản phẩm lấy từ `ProductService`
- Chỉ hiển thị sản phẩm **còn hàng** và **đang active**

---

## 4. Main Flow

1. Người dùng cuộn đến section cuối trang chủ
2. Hiển thị tiêu đề + grid card sản phẩm trên nền tối
3. Người dùng nhấn "Xem chi tiết" → `/shop/[product-id]`
4. Người dùng nhấn "Xem tất cả sản phẩm" → `/shop`

---

## 5. UI Specification

### 5.1 Layout

```
┌──────────────────────────────────────────────────────────┐  ← bg tối (đen/xanh rêu)
│              SẢN PHẨM CHĂM SÓC TÓC                      │
│                                                          │
│  ┌───────────────────┐  ┌───────────────────┐            │
│  │  [Ảnh SP]        │  │  [Ảnh SP]        │            │
│  │  Tên sản phẩm    │  │  Tên sản phẩm    │            │
│  │  Mô tả ngắn      │  │  Mô tả ngắn      │            │
│  │  Giá       [Xem] │  │  Giá       [Xem] │            │
│  └───────────────────┘  └───────────────────┘            │
│  ┌───────────────────┐  ┌───────────────────┐            │
│  │       ...        │  │       ...        │            │
│  └───────────────────┘  └───────────────────┘            │
│                                                          │
│           [ Xem tất cả sản phẩm → ]                     │
└──────────────────────────────────────────────────────────┘
```

- **Section:** `w-full py-20 px-6`, `bg-gray-900` hoặc `bg-green-950`
- **Grid:** `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6` (card ngang) hoặc `lg:grid-cols-4` (card dọc nhỏ)
- **Max width:** `max-w-6xl mx-auto`

### 5.2 Màu sắc

| Element | Màu | Tailwind |
|---------|-----|----------|
| Section background | Tối (đen / xanh rêu đậm) | `bg-gray-900` hoặc `bg-green-950` |
| Tiêu đề section | Trắng / Vàng | `text-white` hoặc `text-amber-400` |
| Card background | Xám tối / xanh rêu tối hơn | `bg-gray-800` hoặc `bg-green-900` |
| Card border | Xám tối | `border border-gray-700` |
| Tên sản phẩm | Trắng | `text-white` |
| Mô tả | Xám nhạt | `text-gray-400` |
| Giá | Vàng amber | `text-amber-400` |
| Nút "Xem chi tiết" | Outline vàng | `border border-amber-400 text-amber-400` |
| Nút hover | Fill vàng | `hover:bg-amber-400 hover:text-gray-900` |
| Nút "Xem tất cả" | Trắng / outline | `border border-white text-white hover:bg-white hover:text-gray-900` |

### 5.3 Typography

| Element | Font size | Font weight |
|---------|-----------|-------------|
| Tiêu đề section | `clamp(1.5rem, 3vw, 2rem)` | `700` uppercase |
| Tên sản phẩm | `1rem` | `600` |
| Mô tả | `0.875rem` | `400` line-height 1.6 |
| Giá | `1rem` | `700` |
| Nút | `0.8rem` | `500` uppercase |

### 5.4 Component Details

**ProductsSectionComponent**
```
ProductsSectionComponent              ← bg-gray-900, py-20
├── <div> header
│   ├── <h2> "SẢN PHẨM CHĂM SÓC TÓC"
│   └── <div> divider amber
├── <div> grid
│   └── HomeProductCardComponent × 4–6  ← *ngFor, chỉ lấy 4–6 sản phẩm nổi bật
└── <a> "Xem tất cả sản phẩm →"         ← routerLink="/shop"
```

**HomeProductCardComponent** (`home-product-card.component.ts`)
```
HomeProductCardComponent                ← Layout: horizontal card (ảnh trái, text phải)
├── <div> image                         ← w-1/3 md:w-2/5, aspect-square, overflow-hidden
│   └── <img> ảnh sản phẩm              ← object-cover, loading="lazy"
└── <div> content                       ← flex-1, flex flex-col, p-4
    ├── <h3> tên sản phẩm
    ├── <p> mô tả ngắn (line-clamp 2)
    ├── <span> giá — CurrencyVndPipe
    └── <a> "Xem chi tiết"              ← routerLink="/shop/[id]"
```

**Ảnh sản phẩm:**
- `object-fit: cover`, `border-radius: 8px 0 0 8px` (trái trên + dưới bo nếu card ngang)
- Placeholder khi lỗi: `bg-gray-700` + icon `PackageIcon` (Lucide)

**Nút "Xem tất cả sản phẩm":**
- `display: block; margin: 40px auto 0; width: fit-content`
- `padding: 12px 32px; border-radius: 8px`
- `routerLink="/shop"`

**Loading skeleton:**
- `animate-pulse bg-gray-700 rounded-lg h-32` × 4

**Empty state:**
- Không hiển thị section nếu không có sản phẩm

### 5.5 Responsive

| Breakpoint | Layout card |
|------------|-------------|
| Mobile `< 768px` | 1 cột, card ngang full-width |
| Tablet `768px–1024px` | 2 cột |
| Desktop `> 1024px` | 2 cột (card ngang) hoặc 4 cột (card dọc) |

---

## 6. Animations

| Element | Animation | Trigger | Duration |
|---------|-----------|---------|----------|
| Cards | fade-in slide-up stagger | Scroll into view | `500ms`, stagger `100ms` |
| Card hover | translateY(-2px) + shadow | Hover | `200ms` |

---

## 7. Business Rules

- Chỉ hiển thị sản phẩm **còn hàng** (`stock > 0`) và **active**
- Tối đa **4–6 sản phẩm** nổi bật trên trang chủ
- Giá dùng `CurrencyVndPipe`
- Nút "Xem tất cả" → `/shop`

---

## 8. Edge Cases

| Tình huống | UI xử lý |
|------------|----------|
| Ảnh sản phẩm lỗi | Placeholder icon + text vẫn hiển thị |
| Không có sản phẩm | Section ẩn hoàn toàn |
| Tên sản phẩm quá dài | Truncate 1 dòng |
| Mô tả quá dài | Line-clamp 2 dòng |

---

## 9. Accessibility Requirements

- `<h2>` cho tiêu đề section
- `<h3>` cho tên sản phẩm trong card
- `alt="[Tên sản phẩm]"` trên ảnh
- Nút "Xem chi tiết" có `aria-label="Xem chi tiết [tên sản phẩm]"`

---

## 10. Acceptance Criteria

- [ ] Section nền tối, tiêu đề trắng/vàng rõ ràng
- [ ] Hiển thị 4–6 card sản phẩm còn hàng
- [ ] Mỗi card có ảnh, tên, mô tả, giá (VND), nút "Xem chi tiết"
- [ ] Nhấn "Xem chi tiết" → điều hướng đến `/shop/[id]`
- [ ] Nút "Xem tất cả sản phẩm" → điều hướng đến `/shop`
- [ ] Ảnh lỗi → placeholder, card vẫn hiển thị đầy đủ text
- [ ] Sản phẩm hết hàng → không xuất hiện
- [ ] `CurrencyVndPipe` định dạng giá đúng

---

## 11. Assets cần thiết

- Ảnh sản phẩm: 
`assets\images\sp1.avif`
`assets\images\sp2.avif`
`assets\images\sp3.avif`
- Placeholder icon: Lucide `PackageIcon`
- `CurrencyVndPipe`: `src/app/shared/pipes/currency-vnd.pipe.ts`

---

## 12. Implementation Notes

- **Standalone Component**, không NgModule
- Ảnh **tĩnh, hardcoded** trong component — không fetch từ API:
  - `assets/images/sp1.avif`
  - `assets/images/sp2.avif`
  - `assets/images/sp3.avif`
- Dữ liệu sản phẩm (tên, mô tả, giá) hardcode trong component dưới dạng constant array
- Không dùng service, không dùng `async pipe` — render tĩnh hoàn toàn
- Import `CurrencyVndPipe` vào component imports array để format giá
- `HomeProductCardComponent` là standalone child component
