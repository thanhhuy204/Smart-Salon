# FEAT-002: Footer Component

**Trạng thái:** Ready for Development
**Ưu tiên:** P0 — Core layout component, required for all pages
**File implement:** `src/app/shared/components/footer/footer.component.ts`
**Business Spec:** `docs/spec-business/Layout/BS-Layout-Footer.md`

---

## 1. Business Goal

Cung cấp khu vực cuối trang nhất quán trên toàn bộ ứng dụng, giúp người dùng kết nối mạng xã hội của Salon, tra cứu thông tin liên hệ và xác nhận bản quyền thương hiệu.

---

## 2. Actors

- **Khách vãng lai / Người dùng** — xem thông tin liên hệ, truy cập mạng xã hội

> Footer hiển thị giống nhau với mọi trạng thái đăng nhập.

---

## 3. Preconditions

- `FooterComponent` đặt trong `AppComponent` template, sau `<router-outlet>`
- Hiển thị trên tất cả các trang
- Không phụ thuộc API call — render tĩnh hoàn toàn

---

## 4. Main Flow

1. Người dùng cuộn xuống cuối bất kỳ trang nào
2. Hệ thống hiển thị footer với: tiêu đề "FOLLOW US", 4 social icons, thông tin liên hệ, bản quyền
3. Người dùng nhấn một icon mạng xã hội → mở tab mới đến trang MXH của Salon

---

## 5. UI Specification

### 5.1 Layout

```
┌────────────────────────────────────────────────────┐
│                  FOLLOW US                         │
│         [FB]   [IG]   [TT]   [YT]                  │
│                                                    │
│   📞 0912 345 678                                   │
│   📍 123 Nguyễn Trãi, Q.1, TP.HCM                  │
│                                                    │
│   © 2026 Salon. All rights reserved.               │
└────────────────────────────────────────────────────┘
```

- **Container:** Full width
- **Inner layout:** `flex flex-col items-center gap-6`, `py-10 px-6`
- Tất cả nội dung **căn giữa** (center)

### 5.2 Màu sắc

| Element | Màu | Tailwind |
|---------|-----|----------|
| Background | Đen | `bg-gray-900` hoặc `bg-black` |
| Tiêu đề "FOLLOW US" | Trắng | `text-white` |
| Social icons | Trắng | `text-white` / `fill-white` |
| Social icons hover | Xám sáng | `hover:text-gray-300` |
| Thông tin liên hệ | Xám nhạt | `text-gray-400` |
| Bản quyền | Xám tối | `text-gray-500` |
| Divider (nếu có) | Xám tối | `border-gray-700` |

### 5.3 Typography

| Element | Font size | Font weight | Màu |
|---------|-----------|-------------|-----|
| Tiêu đề "FOLLOW US" | `1rem` | `700` | `#FFFFFF` |
| Thông tin liên hệ | `0.875rem` | `400` | `#9CA3AF` |
| Bản quyền | `0.75rem` | `400` | `#6B7280` |

### 5.4 Component Details

**FooterComponent** (`footer.component.ts`)
- `background: #111827` (gray-900)
- `padding: 40px 24px`

**Social Icons Row**
- Layout: `flex gap-6 items-center justify-center`
- Mỗi icon: `w-10 h-10`, `rounded-full`, có thể có hover background nhẹ
- Icon set: Lucide Angular hoặc SVG inline

| Icon | Aria-label | Link |
|------|------------|------|
| Facebook | `"Theo dõi trên Facebook"` | Cấu hình từ constants |
| Instagram | `"Theo dõi trên Instagram"` | Cấu hình từ constants |
| TikTok | `"Theo dõi trên TikTok"` | Cấu hình từ constants |
| YouTube | `"Theo dõi trên YouTube"` | Cấu hình từ constants |

- Tất cả link: `target="_blank" rel="noopener noreferrer"`

**Contact Info**
- Layout: `flex flex-col gap-2 items-center`
- Icon + text: `flex items-center gap-2`
- Icon: Lucide `PhoneIcon`, `MapPinIcon` — `w-4 h-4 text-gray-400`

**Copyright**
- `border-t border-gray-700 pt-4 mt-4`
- Text: `© {{ currentYear }} Salon. All rights reserved.`
- `currentYear` lấy từ `new Date().getFullYear()` — dynamic

### 5.5 Responsive

| Breakpoint | Behavior |
|------------|----------|
| Mobile `< 768px` | Stack dọc, căn giữa, icon size `w-9 h-9` |
| Tablet / Desktop `≥ 768px` | Có thể mở rộng layout 2–3 cột nếu có thêm nội dung |

---

## 6. Animations

| Element | Animation | Trigger | Duration |
|---------|-----------|---------|----------|
| Social icon hover | scale up nhẹ | Hover | `150ms` |
| Social icon hover | opacity tăng | Hover | `150ms` |

```css
.social-icon:hover {
  transform: scale(1.15);
  transition: transform 150ms ease;
}
```

---

## 7. Business Rules

- Footer render **tĩnh** — không cần API
- Social links **mở tab mới** (`target="_blank"`)
- Năm bản quyền **tự động** theo năm hiện tại
- Icon trắng trên nền đen — contrast đảm bảo ≥ 4.5:1

---

## 8. Edge Cases

| Tình huống | UI xử lý |
|------------|----------|
| Social link chưa cấu hình | Icon ẩn (dùng `@if` check URL truthy) |
| Số điện thoại / địa chỉ chưa điền | Dòng đó không render |
| Màn hình < 375px | Padding giảm, icon shrink nhẹ, không tràn |

---

## 9. Security Requirements

- Social links dùng `rel="noopener noreferrer"` chống tab-napping
- Không nhận input từ user trong Footer

---

## 10. Accessibility Requirements

- Mỗi social icon có `aria-label` mô tả rõ nền tảng
- `role="contentinfo"` trên thẻ `<footer>`
- Icons không phải text → cần `aria-hidden="true"` trên SVG, label trên `<a>`

---

## 11. Acceptance Criteria

- [ ] Footer hiển thị trên tất cả các trang
- [ ] Nền màu tối (đen / gray-900)
- [ ] Tiêu đề "FOLLOW US" hiển thị rõ, màu trắng
- [ ] 4 icon MXH hiển thị màu trắng, có thể nhấn
- [ ] Nhấn icon → mở đúng trang MXH trong tab mới
- [ ] Số điện thoại và địa chỉ Salon hiển thị rõ
- [ ] Dòng bản quyền hiển thị đúng năm hiện tại
- [ ] Icon MXH chưa cấu hình URL → ẩn icon đó
- [ ] Không có console errors

---

## 12. Assets cần thiết

- Icons MXH: SVG inline hoặc Lucide (Facebook, Instagram, TikTok, YouTube)
- Icons liên hệ: Lucide Angular — `PhoneIcon`, `MapPinIcon`
- Social URLs: khai báo trong `SOCIAL_LINKS` constant tại `shared/constants/`

---

## 13. Implementation Notes

- **Standalone Component** — không NgModule
- `currentYear = new Date().getFullYear()` — khai báo là property thường (không cần Signal)
- Social links khai báo dưới dạng constant array trong component hoặc `shared/constants/social-links.const.ts`:
  ```ts
  export const SOCIAL_LINKS = [
    { platform: 'Facebook', icon: 'facebook', url: '...' },
    { platform: 'Instagram', icon: 'instagram', url: '...' },
    { platform: 'TikTok', icon: 'tiktok', url: '...' },
    { platform: 'YouTube', icon: 'youtube', url: '...' },
  ];
  ```
- Dùng `@for` loop để render social icons — không hardcode từng icon
- `FooterComponent` đặt trong `AppComponent` template, **sau** `<router-outlet>`
