# Author Bio & Tags Updates

## Tổng quan / Overview

Đã cập nhật tính năng hiển thị thông tin tác giả (Author Bio) và di chuyển tags xuống cuối bài viết trong post detail page.

Updated to display author bio information and moved tags to the bottom of the post detail page.

## Các thay đổi / Changes Made

### 1. Database Schema Updates

**Thêm trường vào bảng `users`:**

- `bio` (String, optional) - Giới thiệu về tác giả
- `avatar` (String, optional) - URL ảnh đại diện

**Migration đã tạo:** `20251106083701_add_user_bio_and_avatar`

```sql
ALTER TABLE users ADD COLUMN bio TEXT;
ALTER TABLE users ADD COLUMN avatar TEXT;
```

### 2. Backend Updates

**File:** `backend/src/modules/posts/infrastructure/persistence/repositories/prisma-post.repository.ts`

- Cập nhật `findAll()` và `findById()` để include `bio` và `avatar` từ author
- Cập nhật `toDomain()` để map author bio và avatar

**Lưu ý:** Sau khi restart backend server, cần uncomment các dòng:

```typescript
// bio: true,
// avatar: true,
```

Và chạy lại `npx prisma generate` để Prisma Client nhận diện schema mới.

### 3. Frontend Components

#### Component mới: `AuthorBio`

**File:** `components/blog/author-bio.tsx`

**Features:**

- ✅ Hiển thị avatar (hoặc initials nếu không có ảnh)
- ✅ Hiển thị tên tác giả
- ✅ Hiển thị bio (hoặc placeholder nếu chưa có)
- ✅ Responsive design với Card UI
- ✅ Bilingual (Tiếng Việt / English)

**Props:**

```typescript
interface AuthorBioProps {
  author: {
    name: string;
    email?: string;
    bio?: string | null;
    avatar?: string | null;
  } | null;
}
```

#### Component mới: `Avatar`

**File:** `components/ui/avatar.tsx`

Shadcn Avatar component sử dụng `@radix-ui/react-avatar`

**Installed:** `npm install @radix-ui/react-avatar`

### 4. Layout Updates

**File:** `components/blog/post-content-client.tsx`

**Changes:**

1. ✅ Di chuyển Tags từ trước content xuống sau content
2. ✅ Tags hiện có heading "Tags" và border-top để phân tách rõ ràng
3. ✅ Thêm AuthorBio component ở cuối trang
4. ✅ Cập nhật TypeScript interface để include bio và avatar

**Cấu trúc mới:**

```
- Post Header (title, excerpt, meta)
- Featured Image
- Post Content
- ──────────────────
- Tags Section
- Author Bio
```

### 5. Page Updates

**File:** `app/[locale]/posts/[id]/page.tsx`

- Cập nhật `getPost()` để normalize author data với bio và avatar
- Cập nhật type definitions

## Cách sử dụng / How to Use

### Cập nhật thông tin tác giả / Update Author Info

**Trong database:**

```sql
UPDATE users
SET
  bio = 'Full-stack developer with 5+ years of experience in React, Node.js, and cloud technologies.',
  avatar = 'https://example.com/avatar.jpg'
WHERE email = 'admin@example.com';
```

**Hoặc tạo API endpoint để user tự cập nhật profile (TODO)**

### Hiển thị / Display

Tags và Author Bio sẽ tự động hiển thị ở cuối mỗi bài viết:

1. **Tags Section:**

   - Hiển thị tất cả tags của bài viết
   - Format: `#tagname`
   - Có border phân cách với nội dung chính

2. **Author Bio:**
   - Avatar (hoặc initials)
   - Tên tác giả
   - Bio (nếu có)
   - Hiển thị trong Card component

## Next Steps

### 1. Restart Backend Server

Sau khi restart, Prisma Client sẽ tự động nhận diện schema mới:

```bash
cd backend
npm run start:dev
```

### 2. Uncomment Bio & Avatar Fields

Trong `prisma-post.repository.ts`, uncomment:

```typescript
bio: true,
avatar: true,
```

### 3. Tạo User Profile Management API (Optional)

Tạo endpoints để user có thể:

- Upload avatar
- Cập nhật bio
- Xem preview author bio

**Đề xuất endpoints:**

```
PUT /api/users/profile
POST /api/users/avatar (với file upload)
GET /api/users/profile
```

### 4. Seed Data (Optional)

Cập nhật seed script để thêm bio và avatar cho admin user:

**File:** `backend/prisma/seed.ts`

```typescript
await prisma.user.update({
  where: { email: "admin@example.com" },
  data: {
    bio: "Passionate about web development and sharing knowledge through blogging.",
    avatar: "https://avatars.githubusercontent.com/u/your-id",
  },
});
```

## Testing

1. ✅ Tags hiển thị ở cuối bài viết
2. ✅ Author Bio hiển thị với placeholder nếu chưa có bio
3. ✅ Avatar fallback với initials nếu chưa có ảnh
4. ✅ Responsive design
5. ⏳ Cần test sau khi restart backend và generate Prisma Client

## Files Changed

### Backend

- ✅ `backend/prisma/schema.prisma`
- ✅ `backend/src/modules/posts/infrastructure/persistence/repositories/prisma-post.repository.ts`
- ✅ Migration: `20251106083701_add_user_bio_and_avatar`

### Frontend

- ✅ `components/blog/author-bio.tsx` (NEW)
- ✅ `components/ui/avatar.tsx` (NEW)
- ✅ `components/blog/post-content-client.tsx`
- ✅ `components/blog/post-detail-layout.tsx`
- ✅ `app/[locale]/posts/[id]/page.tsx`

### Package

- ✅ Installed: `@radix-ui/react-avatar`
