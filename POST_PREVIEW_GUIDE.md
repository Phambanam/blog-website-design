# Post Preview Feature

## ✅ Feature Complete

Tính năng xem trước bài viết trước khi publish đã được triển khai thành công!

## 🎯 Tính năng

### Preview Dialog

- **Full-width modal** - Hiển thị bài viết trong dialog lớn (max-width: 5xl, 90vh height)
- **Responsive design** - Tự động scroll khi nội dung dài
- **Professional styling** - Giống như trang public post với prose typography

### Hiển thị đầy đủ

1. **Featured Image** (nếu có):

   - Kích thước: 400px height
   - Rounded corners và full-width
   - Object-fit: cover

2. **Title**:

   - Font size: 4xl
   - Bold và tracking-tight
   - Fallback: "Untitled Post" nếu chưa nhập

3. **Meta Information**:

   - Author name/email với icon User
   - Created date với icon Calendar
   - Format: "MMMM dd, yyyy" (e.g., November 05, 2025)

4. **Tags**:

   - Badge components với secondary variant
   - Display all selected tags
   - Flex wrap layout

5. **Excerpt** (nếu có):

   - Italic text
   - Border-left với primary color
   - Padding-left
   - Larger font size

6. **Content**:
   - Full prose styling với dark mode support
   - Custom styles cho headings, paragraphs, links, code, images, videos
   - Rounded corners cho images và videos
   - Syntax highlighting support
   - Blockquote với background color
   - Lists với proper styling

### Language Support

- Preview hiển thị theo ngôn ngữ đang chọn (VI hoặc EN)
- Switch language trong editor → preview cũng đổi theo

## 🚀 Cách sử dụng

### 1. Mở Post Editor

```
http://localhost:3002/vi/admin (đăng nhập trước)
→ Click "Tạo bài viết mới" hoặc chỉnh sửa bài viết có sẵn
```

### 2. Điền thông tin bài viết

- Nhập tiêu đề (Title)
- Nhập trích đoạn (Excerpt) - optional
- Nhập nội dung (Content) với rich text editor
- Thêm featured image URL (optional)
- Chọn tags (optional)

### 3. Xem Preview

Click nút **"Preview"** (icon Eye) ở cuối form

→ Dialog sẽ hiển thị bài viết với styling giống trang public

### 4. Kiểm tra

- ✅ Title hiển thị đúng
- ✅ Featured image hiển thị (nếu có)
- ✅ Content render đúng HTML
- ✅ Tags hiển thị
- ✅ Author và date hiển thị
- ✅ Formatting (bold, italic, headings, lists, code, images, videos)

### 5. Đóng Preview

Click nút X ở góc trên phải hoặc click outside dialog

→ Quay lại editor để tiếp tục chỉnh sửa

## 🎨 UI Components

### Files Created/Modified

1. **`components/admin/post-preview.tsx`** - New component

   - PostPreview dialog component
   - Props: open, onOpenChange, title, content, excerpt, featuredImage, tags, author, createdAt
   - Full prose styling with dark mode

2. **`components/admin/post-editor.tsx`** - Modified

   - Added preview button with Eye icon
   - Added showPreview state
   - Added PostPreview component at end of form
   - Integrated with useAuth for author info

3. **`components/ui/dialog.tsx`** - Created
   - Radix UI Dialog components
   - Backdrop overlay with animation
   - Close button with icon
   - Header, footer, title, description components

### Dependencies

```bash
# Already installed
npm install @radix-ui/react-dialog date-fns --legacy-peer-deps
```

## 📝 Technical Details

### Prose Styling Classes

```tsx
prose prose-lg prose-slate dark:prose-invert max-w-none
prose-headings:font-bold prose-headings:tracking-tight
prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
prose-p:leading-relaxed prose-p:text-foreground/90
prose-a:text-primary prose-a:no-underline hover:prose-a:underline
prose-strong:text-foreground prose-strong:font-semibold
prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5
prose-pre:bg-muted prose-pre:border prose-pre:border-border
prose-blockquote:border-l-primary prose-blockquote:bg-muted/50
prose-img:rounded-lg prose-img:shadow-lg
prose-video:rounded-lg prose-video:shadow-lg
```

### Date Formatting

Uses `date-fns` library:

```tsx
import { format } from "date-fns";

format(createdAt, "MMMM dd, yyyy");
// Output: November 05, 2025
```

### Author Information

Gets author from `useAuth()` context:

```tsx
const { user } = useAuth()

author={user ? {
  name: user.name || '',
  email: user.email
} : undefined}
```

## 🐛 Troubleshooting

### Preview không hiển thị content

- **Nguyên nhân**: Content empty hoặc HTML không hợp lệ
- **Giải pháp**: Kiểm tra content trong editor, đảm bảo có ít nhất 1 paragraph

### Featured image không hiển thị

- **Nguyên nhân**: URL không hợp lệ hoặc CORS issue
- **Giải pháp**:
  - Kiểm tra URL ảnh có hợp lệ
  - Thử upload ảnh lên server thay vì dùng external URL
  - Mở browser console để xem error

### Author không hiển thị

- **Nguyên nhân**: Chưa đăng nhập hoặc user context không có data
- **Giải pháp**: Đảm bảo đã đăng nhập trước khi vào editor

### Date format lỗi

- **Nguyên nhân**: `created_at` không phải Date object
- **Giải pháp**: Component đã handle với `new Date()` fallback

## ✨ Features to Add

Các cải tiến có thể thêm:

- [ ] Toggle between edit mode và full-screen preview
- [ ] Side-by-side preview (editor bên trái, preview bên phải)
- [ ] Mobile preview mode
- [ ] Share preview link (generate temporary URL)
- [ ] Print preview
- [ ] SEO preview (Google search result preview)
- [ ] Social media preview (Facebook, Twitter card preview)
- [ ] Responsive breakpoint switcher (desktop/tablet/mobile)

## 📋 Next Steps

✅ Post Preview - COMPLETED
⏳ Auth UI in Header - PENDING (15 minutes)
⏳ Drag & Drop Upload - PENDING (40 minutes)
⏳ Upload Progress Bar - PENDING (40 minutes)

Recommended next: **Auth UI in Header** - User cần thấy login state và có thể logout dễ dàng.
