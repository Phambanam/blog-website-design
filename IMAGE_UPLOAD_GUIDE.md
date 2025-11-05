# Image & Video Upload Feature

## ✅ Feature Complete

Tính năng upload ảnh và video từ máy tính lên server đã được triển khai thành công!

## 🎯 Tính năng

### Backend API

- **POST /api/uploads/image** - Upload ảnh từ máy tính
  - Hỗ trợ: JPG, JPEG, PNG, GIF, WebP
  - Giới hạn: 5MB
  - Yêu cầu: JWT authentication (admin hoặc user)
- **POST /api/uploads/video** - Upload video từ máy tính

  - Hỗ trợ: MP4, WebM, OGG, MOV
  - Giới hạn: 50MB
  - Yêu cầu: JWT authentication (admin hoặc user)

- **Lưu trữ file**:

  - Images: `backend/uploads/images/`
  - Videos: `backend/uploads/videos/`
  - Tên file: `image-{timestamp}-{random}.{ext}` hoặc `video-{timestamp}-{random}.{ext}`

- **Truy cập file**:
  - URL: `http://localhost:3001/uploads/images/{filename}`
  - Hoặc: `http://localhost:3001/uploads/videos/{filename}`

### Frontend Editor

- **Upload Button** (icon Upload) - Upload từ máy tính (yêu cầu đăng nhập)
- **Image Button** (icon Image) - Chèn ảnh từ URL
- **Video Upload Button** (icon Upload màu đỏ) - Upload video từ máy tính (yêu cầu đăng nhập)
- **YouTube Button** (icon YouTube) - Nhúng video YouTube từ URL

## 🚀 Cách sử dụng

### 1. Khởi động server

```bash
# Terminal 1 - Backend
cd backend
npm run start:dev
# Server chạy tại: http://localhost:3001

# Terminal 2 - Frontend
npm run dev
# Frontend chạy tại: http://localhost:3002 (hoặc 3000)
```

### 2. Đăng nhập

Vào trang admin để đăng nhập:

```
http://localhost:3002/vi/admin
```

Tài khoản mặc định:

- Email: admin@example.com
- Password: admin123

### 3. Upload ảnh trong bài viết

1. Vào trang "Quản lý bài viết" → Click "Tạo bài viết mới"
2. Trong editor, tìm toolbar (thanh công cụ)
3. Click vào nút **Upload** (icon mũi tên lên) để upload ảnh từ máy tính
4. Chọn file ảnh (JPG, PNG, GIF, WebP, tối đa 5MB)
5. Chờ upload hoàn tất → Ảnh sẽ tự động hiển thị trong editor

**Hoặc** sử dụng nút **Image** (icon ảnh) để chèn ảnh từ URL.

### 4. Upload video trong bài viết

1. Trong editor, tìm nút **Upload màu đỏ** (icon mũi tên lên)
2. Click và chọn file video (MP4, WebM, OGG, MOV, tối đa 50MB)
3. Chờ upload hoàn tất → Video HTML5 sẽ xuất hiện trong editor

**Hoặc** sử dụng nút **YouTube** (icon YouTube) để nhúng video từ YouTube.

## 🔒 Bảo mật

- ✅ JWT Authentication required cho upload endpoints
- ✅ File type validation (chỉ cho phép image/video formats cụ thể)
- ✅ File size validation (5MB cho ảnh, 50MB cho video)
- ✅ Unique filename với timestamp và random string
- ✅ CORS enabled cho frontend

## 📁 File Structure

```
backend/
  src/
    modules/
      uploads/
        uploads.controller.ts  # Upload endpoints
        uploads.module.ts      # Module config
    main.ts                    # Static file serving
  uploads/                     # Upload directory (auto-created)
    images/                    # Ảnh được lưu tại đây
    videos/                    # Video được lưu tại đây

components/
  admin/
    rich-text-editor.tsx       # Editor với upload buttons

lib/
  upload-helper.ts             # Upload utility functions
  api-client.ts                # API client (hỗ trợ FormData)
```

## 🎨 UI/UX

- **Loading State**: Nút upload hiển thị spinner khi đang upload
- **Disabled State**: Nút bị disable khi chưa đăng nhập
- **Error Handling**: Alert hiển thị lỗi nếu file không hợp lệ hoặc upload thất bại
- **File Validation**: Kiểm tra loại file và kích thước trước khi upload
- **Auto Insert**: Ảnh/video tự động chèn vào vị trí con trỏ sau khi upload thành công

## 🐛 Troubleshooting

### Lỗi "Login required to upload images"

- **Nguyên nhân**: Bạn chưa đăng nhập
- **Giải pháp**: Đăng nhập vào trang admin trước

### Lỗi "Failed to upload image"

- **Nguyên nhân**: Token hết hạn, server lỗi, hoặc file không hợp lệ
- **Giải pháp**:
  - Kiểm tra console để xem lỗi chi tiết
  - Đảm bảo backend đang chạy
  - Thử đăng nhập lại

### Ảnh không hiển thị sau upload

- **Nguyên nhân**: Backend không serve static files
- **Giải pháp**:
  - Kiểm tra terminal backend có thông báo "Server running on..." không
  - Thử truy cập trực tiếp URL ảnh: `http://localhost:3001/uploads/images/{filename}`

### File size exceeded

- **Ảnh**: Giảm kích thước ảnh xuống dưới 5MB (có thể dùng công cụ nén ảnh online)
- **Video**: Giảm kích thước video xuống dưới 50MB hoặc upload lên YouTube và dùng embed

## 📝 API Docs

Swagger documentation: http://localhost:3001/api/docs

Ở đây bạn có thể:

- Xem tất cả endpoints
- Test upload API trực tiếp
- Xem request/response schema

## ✨ Next Features

Các tính năng tiếp theo có thể thêm:

- [ ] Auth UI trong header (login/logout)
- [ ] Post preview trước khi publish
- [ ] Image cropping/editing before upload
- [ ] Drag & drop upload
- [ ] Upload progress bar
- [ ] Cloud storage (S3, Cloudinary)
- [ ] Image optimization (compression, resize)
