# Roadmap: Tính năng còn lại

## ✅ Đã hoàn thành

1. **SEO Optimization** - Tất cả trang đã có metadata
2. **TOC Sidebar** - Fixed positioning
3. **Admin Login Page** - Redesigned với professional styling
4. **Image & Video Upload** - Upload từ máy tính với validation

## 🚧 Đang chờ triển khai

### 1. Auth UI trong Header (Priority: HIGH)

**Mô tả**: Thêm nút Login/Logout và user dropdown menu vào header

**Lý do**: User cũng cần đăng nhập để comment và viết bài, không chỉ admin

**Chi tiết**:

- Show "Login" button khi chưa đăng nhập
- Show user dropdown với tên, avatar, link đến admin (nếu là admin), và nút logout khi đã đăng nhập
- Sử dụng `DropdownMenu` component đã có sẵn

**File cần sửa**:

- `components/blog/header.tsx` - Thêm auth UI
- Import `useAuth` từ `@/lib/auth-context`
- Import `DropdownMenu` components từ `@/components/ui/dropdown-menu`

**Ước lượng**: 15-20 phút

---

### 2. Post Preview (Priority: MEDIUM)

**Mô tả**: Xem trước bài viết trước khi publish

**Chi tiết**:

- Thêm nút "Preview" trong post editor
- Mở modal/dialog hiển thị bài viết với styling giống trang public
- Show title, featured image, content (rendered HTML), tags, author info
- Có thể toggle giữa edit mode và preview mode

**File cần tạo/sửa**:

- `components/admin/post-preview.tsx` - New component
- `components/admin/post-editor.tsx` - Thêm preview button
- `components/ui/dialog.tsx` - Dialog component (nếu chưa có)

**Ước lượng**: 20-30 phút

---

### 3. Drag & Drop Upload (Priority: LOW)

**Mô tả**: Kéo thả file vào editor để upload

**Chi tiết**:

- Thêm drag & drop zone trong editor
- Show overlay khi drag file vào editor
- Auto upload và insert khi drop file
- Support multiple files

**File cần sửa**:

- `components/admin/rich-text-editor.tsx`

**Ước lượng**: 30-40 phút

---

### 4. Upload Progress Bar (Priority: LOW)

**Mô tả**: Hiển thị tiến trình upload

**Chi tiết**:

- Show progress bar khi upload
- Display upload speed và estimated time
- Có thể cancel upload
- Show thumbnail preview khi upload xong

**File cần sửa**:

- `lib/upload-helper.ts` - Add progress tracking
- `components/admin/rich-text-editor.tsx` - Show progress UI

**Ước lượng**: 30-40 phút

---

### 5. Image Editing (Priority: VERY LOW)

**Mô tả**: Crop, resize, rotate ảnh trước khi upload

**Chi tiết**:

- Open image editor modal khi chọn ảnh
- Crop, resize, rotate, filters
- Upload edited version
- Có thể dùng thư viện như `react-image-crop` hoặc `react-avatar-editor`

**Dependencies cần cài**:

```bash
npm install react-image-crop
```

**Ước lượng**: 1-2 giờ

---

## 🎯 Recommended Next Steps

### Step 1: Auth UI trong Header (15 phút)

Tính năng quan trọng nhất còn thiếu. User cần thấy trạng thái đăng nhập và có thể logout dễ dàng.

### Step 2: Post Preview (30 phút)

Giúp admin/user kiểm tra bài viết trước khi publish, tránh lỗi formatting.

### Step 3: Các tính năng khác

Tùy theo nhu cầu sử dụng thực tế.

---

## 📋 Template Code

### Auth UI trong Header (Quick Start)

```tsx
// components/blog/header.tsx
import { useAuth } from "@/lib/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Thêm vào phần return của Header component:
const { user, isAuthenticated, logout } = useAuth();

{
  isAuthenticated ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <User className="h-4 w-4 mr-2" />
          {user?.name || user?.email}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {user?.role === "ADMIN" && (
          <DropdownMenuItem asChild>
            <Link href="/admin">
              <Settings className="h-4 w-4 mr-2" />
              Admin Dashboard
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={logout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Button variant="default" size="sm" asChild>
      <Link href="/admin">Login</Link>
    </Button>
  );
}
```

### Post Preview Dialog (Quick Start)

```tsx
// components/admin/post-preview.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PostPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  content: string;
  featuredImage?: string;
  tags?: string[];
}

export function PostPreview({
  open,
  onOpenChange,
  title,
  content,
  featuredImage,
  tags,
}: PostPreviewProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Preview Post</DialogTitle>
        </DialogHeader>

        <article className="prose prose-lg max-w-none">
          {featuredImage && (
            <img
              src={featuredImage}
              alt={title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}

          <h1>{title}</h1>

          {tags && tags.length > 0 && (
            <div className="flex gap-2 mb-4">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div dangerouslySetInnerHTML={{ __html: content }} />
        </article>
      </DialogContent>
    </Dialog>
  );
}
```

Sử dụng trong `post-editor.tsx`:

```tsx
import { PostPreview } from './post-preview'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'

// Thêm state:
const [showPreview, setShowPreview] = useState(false)

// Thêm button:
<Button
  type="button"
  variant="outline"
  onClick={() => setShowPreview(true)}
>
  <Eye className="h-4 w-4 mr-2" />
  Preview
</Button>

// Thêm component:
<PostPreview
  open={showPreview}
  onOpenChange={setShowPreview}
  title={formData.title}
  content={formData.content}
  featuredImage={formData.featured_image}
  tags={formData.tags}
/>
```
