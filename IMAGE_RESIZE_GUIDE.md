# Image Editing Feature - Resize & Position

## ✅ Feature Added

Bây giờ bạn có thể chỉnh sửa kích thước ảnh sau khi upload vào editor!

## 🎯 Tính năng mới

### 1. Image Resize Controls

Khi click vào ảnh trong editor, toolbar sẽ hiển thị các nút resize:

- **S (Small)** - 25% width
- **M (Medium)** - 50% width
- **L (Large)** - 75% width
- **Full** - 100% width (full width)

### 2. Visual Feedback

- **Hover**: Ảnh có border màu primary khi di chuột qua
- **Selected**: Border đậm hơn khi ảnh đang được chọn
- **Cursor**: Pointer cursor để biết ảnh có thể click

### 3. Native Resize (Browser)

- Ảnh có thuộc tính `resize: both`
- Kéo góc ảnh để resize (tùy browser support)

## 🚀 Cách sử dụng

### Resize ảnh bằng Toolbar Buttons

1. **Upload/Insert ảnh** vào editor
2. **Click vào ảnh** để select
3. **Toolbar sẽ hiển thị** thêm 4 nút: S, M, L, Full
4. **Click nút** để thay đổi kích thước:
   - S → 25% width (ảnh nhỏ, phù hợp inline)
   - M → 50% width (kích thước medium)
   - L → 75% width (ảnh lớn)
   - Full → 100% width (full width container)

### Visual Indicators

```
Normal state: No border
Hover: Primary color outline (2px)
Selected: Primary color outline (3px, thicker)
```

## 📝 Technical Details

### Image Extension Configuration

```tsx
Image.configure({
  inline: true,                // Allow inline images
  allowBase64: true,           // Support base64
  HTMLAttributes: {
    class: 'rounded-lg cursor-pointer',
  },
}).extend({
  addAttributes() {
    return {
      width: { ... },           // Custom width attribute
      height: { ... },          // Custom height attribute
      style: { ... },           // Custom style attribute
    }
  },
})
```

### Resize Function

```tsx
const setImageSize = useCallback(
  (width: string) => {
    editor.commands.updateAttributes("image", {
      width,
      style: `width: ${width}; height: auto;`,
    });
  },
  [editor]
);
```

### CSS Styles

```css
/* Visual feedback */
.ProseMirror img:hover {
  outline: 2px solid hsl(var(--primary));
}

.ProseMirror img.ProseMirror-selectednode {
  outline: 3px solid hsl(var(--primary));
}

/* Browser-native resize (optional) */
.ProseMirror img {
  resize: both;
  overflow: auto;
}
```

## 🎨 UI Components

### Conditional Toolbar

Chỉ hiển thị khi ảnh được select:

```tsx
{
  editor?.isActive("image") && (
    <div className="flex gap-1">
      <Button onClick={() => setImageSize("25%")}>S</Button>
      <Button onClick={() => setImageSize("50%")}>M</Button>
      <Button onClick={() => setImageSize("75%")}>L</Button>
      <Button onClick={() => setImageSize("100%")}>Full</Button>
    </div>
  );
}
```

## 🔮 Future Enhancements

Các tính năng có thể thêm sau:

### 1. Image Crop Before Upload

- Modal editor trước khi upload
- Crop, rotate, flip
- Filters và adjustments
- Package: `react-image-crop` hoặc `react-easy-crop`

### 2. Drag & Drop Resize

- Kéo handle ở góc ảnh
- Real-time preview
- Maintain aspect ratio option

### 3. Image Alignment

- Align left
- Align center
- Align right
- Float left/right với text wrap

### 4. Image Caption

- Thêm caption/description dưới ảnh
- Edit caption inline
- SEO alt text editor

### 5. Image Gallery

- Multiple images trong một block
- Lightbox view
- Gallery layouts (grid, carousel)

## 📋 Implementation Guide

### Để thêm Image Alignment:

```tsx
// 1. Add to toolbar
<Button onClick={() => editor.commands.setTextAlign('left')}>
  Left
</Button>
<Button onClick={() => editor.commands.setTextAlign('center')}>
  Center
</Button>
<Button onClick={() => editor.commands.setTextAlign('right')}>
  Right
</Button>

// 2. Update Image extension
Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: 'left',
        renderHTML: attributes => ({
          style: `text-align: ${attributes.align};`
        }),
      },
    }
  },
})
```

### Để thêm Image Caption:

```tsx
// 1. Create Figure wrapper
const Figure = Node.create({
  name: "figure",
  group: "block",
  content: "image figcaption",
  parseHTML: () => [{ tag: "figure" }],
  renderHTML: () => ["figure", 0],
});

const Figcaption = Node.create({
  name: "figcaption",
  content: "inline*",
  parseHTML: () => [{ tag: "figcaption" }],
  renderHTML: () => ["figcaption", 0],
});

// 2. Use in editor
editor.commands.insertContent({
  type: "figure",
  content: [
    { type: "image", attrs: { src: url } },
    { type: "figcaption", content: [{ type: "text", text: "Caption here" }] },
  ],
});
```

## 🐛 Known Limitations

1. **Browser-native resize** (`resize: both`) không được hỗ trợ rộng rãi trên tất cả browser
2. **Aspect ratio** không được maintain khi resize bằng browser-native
3. **Undo/Redo** có thể không work perfectly với browser-native resize
4. **Mobile touch** chưa được optimize cho resize gesture

## ✨ Best Practices

### Khi upload ảnh:

- Resize ảnh trước khi upload (< 5MB)
- Sử dụng định dạng tối ưu (WebP > JPEG > PNG)
- Compress ảnh để tăng tốc độ load

### Khi sử dụng trong editor:

- Click ảnh để hiển thị resize controls
- Sử dụng preset sizes (S/M/L/Full) cho consistency
- Preview bài viết trước khi publish

### Khi hiển thị public:

- Ảnh tự động responsive với `max-w-full`
- Maintain aspect ratio với `height: auto`
- Lazy loading cho ảnh (Next.js Image component)

## 📊 Performance Tips

1. **Image Optimization**:

   - Use Next.js Image component cho production
   - Enable lazy loading
   - Serve với CDN

2. **Editor Performance**:

   - Limit số lượng ảnh trong 1 post
   - Compress ảnh trước upload
   - Use thumbnail trong editor, full size trong public view

3. **Storage**:
   - Migrate to cloud storage (S3, Cloudinary)
   - Enable image optimization service
   - Cache static assets

---

**Status**: ✅ Basic resize controls implemented  
**Next**: Image alignment, drag & drop resize, crop before upload
