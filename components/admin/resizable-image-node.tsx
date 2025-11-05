'use client';

import React, { useState, useRef, useEffect } from 'react';
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';

interface ResizableImageNodeProps extends NodeViewProps {
  // Additional custom props can go here
}

export const ResizableImageNode: React.FC<ResizableImageNodeProps> = ({
  node,
  updateAttributes,
  selected,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [startWidth, setStartWidth] = useState(0);
  const [startX, setStartX] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const [naturalRatio, setNaturalRatio] = useState(1);

  const src = node.attrs.src as string;
  const alt = node.attrs.alt as string | undefined;
  const title = node.attrs.title as string | undefined;
  const width = node.attrs.width as string | undefined;
  const height = node.attrs.height as string | undefined;

  useEffect(() => {
    if (imgRef.current && imgRef.current.naturalWidth) {
      setNaturalRatio(imgRef.current.naturalHeight / imgRef.current.naturalWidth);
    }
  }, [src]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    setStartX(e.clientX);
    setStartWidth(imgRef.current?.offsetWidth || 0);
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!imgRef.current) return;
      
      const deltaX = e.clientX - startX;
      const newWidth = Math.max(100, startWidth + deltaX);
      const newHeight = newWidth * naturalRatio;

      updateAttributes({
        width: `${newWidth}px`,
        height: `${newHeight}px`,
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, startX, startWidth, naturalRatio, updateAttributes]);

  return (
    <NodeViewWrapper className="inline-block relative group">
      <img
        ref={imgRef}
        src={src}
        alt={alt || ''}
        title={title || ''}
        style={{
          width: width || 'auto',
          height: height || 'auto',
          maxWidth: '100%',
          display: 'block',
          outline: selected ? '3px solid hsl(var(--primary))' : '2px solid transparent',
          transition: isResizing ? 'none' : 'outline 0.2s',
        }}
        onLoad={() => {
          if (imgRef.current) {
            setNaturalRatio(imgRef.current.naturalHeight / imgRef.current.naturalWidth);
          }
        }}
      />
      
      {/* Resize Handle - Bottom Right */}
      {selected && (
        <div
          onMouseDown={handleMouseDown}
          className="absolute bottom-0 right-0 w-4 h-4 bg-primary border-2 border-white cursor-nwse-resize opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            transform: 'translate(50%, 50%)',
            zIndex: 10,
          }}
          title="Kéo để thay đổi kích thước"
        />
      )}

      {/* Resize Handle - Bottom Left */}
      {selected && (
        <div
          onMouseDown={(e) => {
            e.preventDefault();
            setIsResizing(true);
            setStartX(e.clientX);
            setStartWidth(imgRef.current?.offsetWidth || 0);
          }}
          className="absolute bottom-0 left-0 w-4 h-4 bg-primary border-2 border-white cursor-nesw-resize opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            transform: 'translate(-50%, 50%)',
            zIndex: 10,
          }}
          title="Kéo để thay đổi kích thước"
        />
      )}

      {/* Resize Handle - Top Right */}
      {selected && (
        <div
          onMouseDown={(e) => {
            e.preventDefault();
            setIsResizing(true);
            setStartX(e.clientX);
            setStartWidth(imgRef.current?.offsetWidth || 0);
          }}
          className="absolute top-0 right-0 w-4 h-4 bg-primary border-2 border-white cursor-nesw-resize opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            transform: 'translate(50%, -50%)',
            zIndex: 10,
          }}
          title="Kéo để thay đổi kích thước"
        />
      )}

      {/* Resize Handle - Top Left */}
      {selected && (
        <div
          onMouseDown={(e) => {
            e.preventDefault();
            setIsResizing(true);
            setStartX(e.clientX);
            setStartWidth(imgRef.current?.offsetWidth || 0);
          }}
          className="absolute top-0 left-0 w-4 h-4 bg-primary border-2 border-white cursor-nwse-resize opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
          }}
          title="Kéo để thay đổi kích thước"
        />
      )}
    </NodeViewWrapper>
  );
};
