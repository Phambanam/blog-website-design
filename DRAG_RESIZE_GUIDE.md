# Hướng Dẫn Resize Ảnh Bằng Kéo Handle

## ✨ Tính Năng Mới

Bạn có thể resize ảnh bằng cách **kéo handles ở 4 góc** của ảnh khi ảnh được chọn.

## 🎯 Cách Sử Dụng

### Resize Bằng Kéo Handle

1. **Chèn ảnh** vào editor (Upload hoặc dán URL)
2. **Click vào ảnh** để chọn - sẽ xuất hiện outline màu primary
3. **Di chuột qua ảnh** - 4 handles sẽ xuất hiện ở 4 góc:
   - ⬘ Góc trên trái (cursor: nwse-resize)
   - ⬗ Góc trên phải (cursor: nesw-resize)
   - ⬙ Góc dưới trái (cursor: nesw-resize)
   - ⬖ Góc dưới phải (cursor: nwse-resize)
4. **Kéo handle** để resize ảnh
   - Tỷ lệ khung hình được giữ nguyên (aspect ratio locked)
   - Kích thước tối thiểu: 100px
   - Kích thước tối đa: 100% của container
5. **Nhả chuột** để hoàn tất

### Resize Nhanh Bằng Nút

Bạn vẫn có thể dùng các nút resize nhanh khi ảnh được chọn:

- **S** - Small (25% chiều rộng)
- **M** - Medium (50% chiều rộng)
- **L** - Large (75% chiều rộng)
- **Full** - Full Width (100% chiều rộng)

## 🎨 Visual Feedback

- **Outline khi hover**: 2px solid primary (khi di chuột qua)
- **Outline khi chọn**: 3px solid primary (khi click chọn)
- **Handles**: Chỉ xuất hiện khi ảnh được chọn và di chuột qua
- **Cursor**: Thay đổi theo hướng kéo (nwse-resize / nesw-resize)
- **Transition**: Mượt mà khi không resize, tắt transition khi đang kéo

## 🔧 Technical Implementation

### Custom Node View Component

```tsx
// components/admin/resizable-image-node.tsx
export const ResizableImageNode: React.FC<ResizableImageNodeProps> = ({
  node,
  updateAttributes,
  selected,
}) => {
  // Tracks resizing state
  const [isResizing, setIsResizing] = useState(false);
  const [startWidth, setStartWidth] = useState(0);
  const [startX, setStartX] = useState(0);
  const [naturalRatio, setNaturalRatio] = useState(1);

  // Handles mouse events for drag-to-resize
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    setStartX(e.clientX);
    setStartWidth(imgRef.current?.offsetWidth || 0);
  };

  // Updates width/height maintaining aspect ratio
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const newWidth = Math.max(100, startWidth + deltaX);
      const newHeight = newWidth * naturalRatio;

      updateAttributes({
        width: `${newWidth}px`,
        height: `${newHeight}px`,
      });
    };

    const handleMouseUp = () => setIsResizing(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, startX, startWidth, naturalRatio, updateAttributes]);

  return (
    <NodeViewWrapper className="inline-block relative group">
      <img ref={imgRef} src={src} alt={alt} />

      {/* 4 Resize Handles at corners */}
      {selected && (
        <>
          <div onMouseDown={handleMouseDown} className="handle-bottom-right" />
          <div onMouseDown={handleMouseDown} className="handle-bottom-left" />
          <div onMouseDown={handleMouseDown} className="handle-top-right" />
          <div onMouseDown={handleMouseDown} className="handle-top-left" />
        </>
      )}
    </NodeViewWrapper>
  );
};
```

### TipTap Image Extension Configuration

```tsx
// components/admin/rich-text-editor.tsx
Image.configure({
  inline: true,
  allowBase64: true,
}).extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: { default: null },
      height: { default: null },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageNode);
  },
});
```

## 📦 Dependencies

```json
{
  "react-resizable": "^3.0.5",
  "@types/react-resizable": "^3.0.8",
  "@tiptap/react": "^2.x.x"
}
```

## ⚙️ Key Features

- ✅ Drag-to-resize với handles ở 4 góc
- ✅ Giữ tỷ lệ khung hình (aspect ratio locked)
- ✅ Kích thước tối thiểu 100px
- ✅ Visual feedback (outline, cursor, handles)
- ✅ Smooth transitions
- ✅ Tương thích với các nút resize nhanh
- ✅ Responsive và hoạt động mượt mà

## 🚀 Future Enhancements

1. **Alt + Drag** - Resize không giữ tỷ lệ (free aspect ratio)
2. **Shift + Drag** - Resize từ trung tâm
3. **Double Click Handle** - Reset về kích thước gốc
4. **Resize Grip Animation** - Hiệu ứng khi hover/active
5. **Touch Support** - Hỗ trợ thiết bị cảm ứng
6. **Keyboard Shortcuts** - Ctrl + Arrow để resize
7. **Size Indicator** - Hiển thị kích thước khi resize (e.g., "800 × 600")

## 🎯 User Experience

- **Intuitive**: Handles xuất hiện tự động khi chọn ảnh
- **Smooth**: Transition mượt mà, không lag
- **Flexible**: Có cả drag handles và quick buttons
- **Visual**: Outline rõ ràng khi hover/selected
- **Safe**: Có giới hạn kích thước (min 100px, max 100%)
