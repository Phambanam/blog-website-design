# Hashtag Tag Input Feature

## Tổng quan / Overview

Tính năng này cho phép người dùng nhập tags trực tiếp bằng cách sử dụng hashtag (#) thay vì phải tìm kiếm và chọn từ dropdown. Hệ thống sẽ tự động tạo tags mới nếu chưa có trong backend.

This feature allows users to enter tags directly using hashtags (#) instead of searching and selecting from a dropdown. The system will automatically create new tags if they don't exist in the backend.

## Cách sử dụng / How to Use

### Trong Post Editor / In Post Editor

1. **Nhập tags với hashtag:**

   - Gõ `#tagname` và nhấn `Enter` hoặc `Space`
   - Ví dụ: `#react #nextjs #typescript`
   - Type `#tagname` and press `Enter` or `Space`
   - Example: `#react #nextjs #typescript`

2. **Nhập nhiều tags cùng lúc:**

   - `#react #nextjs #typescript #tailwind`
   - Tất cả tags sẽ được thêm sau khi nhấn `Enter` hoặc `Space`
   - All tags will be added after pressing `Enter` or `Space`

3. **Nhập không cần hashtag:**

   - Bạn cũng có thể gõ `react nextjs` (không có #)
   - Hệ thống vẫn sẽ nhận diện và tạo tags
   - You can also type `react nextjs` (without #)
   - The system will still recognize and create tags

4. **Gợi ý tự động / Auto-suggestions:**

   - Khi gõ, hệ thống sẽ hiển thị các tags có sẵn phù hợp
   - Click vào gợi ý để chọn tag đã có
   - As you type, the system will show matching existing tags
   - Click on a suggestion to select an existing tag

5. **Xóa tag:**
   - Click vào nút X trên tag badge để xóa
   - Hoặc nhấn `Backspace` khi input rỗng để xóa tag cuối cùng
   - Click the X button on the tag badge to remove
   - Or press `Backspace` when input is empty to remove the last tag

## Hiển thị Tags / Tag Display

Tất cả tags giờ sẽ hiển thị với prefix # (hashtag) ở các vị trí:
All tags now display with # (hashtag) prefix in:

- **Post detail page** (`/posts/[id]`)
- **Blog list** (filter tags)
- **Blog cards** (post preview)
- **Post editor** (selected tags)

## Kỹ thuật / Technical Details

### Component: `HashtagTagInput`

**Location:** `components/admin/hashtag-tag-input.tsx`

**Props:**

```typescript
interface HashtagTagInputProps {
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  placeholder?: string;
}
```

**Features:**

- ✅ Parse hashtag input (`#react #nextjs`)
- ✅ Auto-create tags if not exists
- ✅ Show suggestions from existing tags
- ✅ Support both `#tagname` and `tagname` formats
- ✅ Keyboard navigation (`Enter`, `Space`, `Backspace`)
- ✅ Real-time validation
- ✅ Duplicate prevention

### API Integration

**Create Tag Endpoint:**

```typescript
POST /api/tags
{
  "name": "react",
  "slug": "react"
}
```

**Slug Generation:**

- Tự động tạo từ tên tag
- Loại bỏ ký tự đặc biệt
- Chuyển thành lowercase
- Thay khoảng trắng bằng dấu gạch ngang
- Auto-generated from tag name
- Remove special characters
- Convert to lowercase
- Replace spaces with hyphens

### Updated Components

1. **`post-editor.tsx`**

   - Removed old tag selection UI
   - Integrated `HashtagTagInput` component
   - Simplified state management

2. **`blog-card.tsx`**

   - Added # prefix to tag display

3. **`blog-list.tsx` & `blog-list-client.tsx`**

   - Added # prefix to filter tags

4. **`post-content-client.tsx`**
   - Added # prefix to post tags

## Ví dụ sử dụng / Usage Examples

### Example 1: Tạo tags mới / Creating new tags

```
Input: #machine-learning #ai #deep-learning
Result: 3 tags mới được tạo và thêm vào post
        3 new tags created and added to the post
```

### Example 2: Mix tags có sẵn và mới / Mix existing and new tags

```
Input: #react #new-framework
Result:
- #react: tag có sẵn được thêm
- #new-framework: tag mới được tạo
- #react: existing tag added
- #new-framework: new tag created
```

### Example 3: Sử dụng gợi ý / Using suggestions

```
Input: #rea...
Suggestions:
- #react
- #react-native
- #real-time
Click để chọn / Click to select
```

## Lợi ích / Benefits

✅ **Nhanh hơn:** Không cần search và click nhiều lần
**Faster:** No need to search and click multiple times

✅ **Linh hoạt:** Tạo tags mới ngay lập tức
**Flexible:** Create new tags instantly

✅ **Trực quan:** Sử dụng hashtag giống social media
**Intuitive:** Use hashtags like social media

✅ **Thông minh:** Gợi ý tags có sẵn khi gõ
**Smart:** Suggest existing tags while typing

✅ **An toàn:** Validate và normalize tags tự động
**Safe:** Validate and normalize tags automatically

## Lưu ý / Notes

- Tags được tạo sẽ available ngay lập tức cho các posts khác
- Created tags are immediately available for other posts

- Slug được tạo tự động từ tên tag
- Slug is auto-generated from tag name

- Nếu tag đã tồn tại (kiểm tra theo name hoặc slug), sẽ không tạo duplicate
- If tag exists (checked by name or slug), no duplicate will be created

- Backend yêu cầu authentication (JWT) để tạo tags mới
- Backend requires authentication (JWT) to create new tags
