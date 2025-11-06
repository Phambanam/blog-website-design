"use client"

import { useState, useEffect, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { apiClient } from "@/lib/api-client"

interface Tag {
  id: string
  name: string
  slug: string
}

interface HashtagTagInputProps {
  selectedTags: Tag[]
  onTagsChange: (tags: Tag[]) => void
  placeholder?: string
}

/**
 * Component cho phép người dùng nhập tags bằng cách sử dụng hashtag (#)
 * Ví dụ: #react #nextjs #typescript
 * - Mỗi tag bắt đầu bằng #
 * - Các tag cách nhau bởi khoảng trắng
 * - Tự động tạo tag mới nếu chưa có trong backend
 */
export default function HashtagTagInput({ selectedTags, onTagsChange, placeholder }: HashtagTagInputProps) {
  const [inputValue, setInputValue] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [suggestions, setSuggestions] = useState<Tag[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [allTags, setAllTags] = useState<Tag[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  // Load tất cả tags có sẵn
  useEffect(() => {
    const loadTags = async () => {
      try {
        const response = await apiClient.get<Tag[]>("/tags")
        setAllTags(response || [])
      } catch (error) {
        console.error("Failed to load tags:", error)
      }
    }
    loadTags()
  }, [])

  // Tạo slug từ tên tag
  const createSlug = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Loại bỏ ký tự đặc biệt
      .replace(/\s+/g, "-") // Thay khoảng trắng bằng dấu gạch ngang
      .replace(/-+/g, "-") // Loại bỏ dấu gạch ngang liên tiếp
  }

  // Tìm hoặc tạo tag mới
  const findOrCreateTag = async (tagName: string): Promise<Tag | null> => {
    const normalizedName = tagName.trim()
    if (!normalizedName) return null

    // Tìm tag đã có
    const existingTag = allTags.find(
      (t) => t.name.toLowerCase() === normalizedName.toLowerCase() || t.slug === createSlug(normalizedName)
    )

    if (existingTag) {
      return existingTag
    }

    // Tạo tag mới
    try {
      const newTag = await apiClient.post<Tag>("/tags", {
        name: normalizedName,
        slug: createSlug(normalizedName),
      })

      // Cập nhật danh sách tags
      setAllTags((prev) => [...prev, newTag])
      return newTag
    } catch (error) {
      console.error(`Failed to create tag "${normalizedName}":`, error)
      return null
    }
  }

  // Xử lý khi người dùng nhấn phím
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      await processInput()
    } else if (e.key === "Backspace" && !inputValue && selectedTags.length > 0) {
      // Xóa tag cuối cùng khi nhấn Backspace trên input rỗng
      const newTags = selectedTags.slice(0, -1)
      onTagsChange(newTags)
    }
  }

  // Xử lý input khi blur
  const handleBlur = async () => {
    await processInput()
    setShowSuggestions(false)
  }

  // Phân tích và xử lý input
  const processInput = async () => {
    if (!inputValue.trim() || isProcessing) return

    setIsProcessing(true)
    const text = inputValue.trim()

    // Tách các hashtags từ input
    // Ví dụ: "#react #nextjs typescript #tailwind" -> ["react", "nextjs", "typescript", "tailwind"]
    const words = text.split(/\s+/)
    const tagNames: string[] = []

    for (const word of words) {
      if (word.startsWith("#")) {
        // Tag với hashtag: #react
        tagNames.push(word.substring(1))
      } else if (word.length > 0 && !word.match(/^[#\s]*$/)) {
        // Tag không có hashtag nhưng có nội dung
        tagNames.push(word)
      }
    }

    // Tìm hoặc tạo các tags
    const newTags: Tag[] = []
    for (const tagName of tagNames) {
      const tag = await findOrCreateTag(tagName)
      if (tag && !selectedTags.find((t) => t.id === tag.id) && !newTags.find((t) => t.id === tag.id)) {
        newTags.push(tag)
      }
    }

    if (newTags.length > 0) {
      onTagsChange([...selectedTags, ...newTags])
    }

    setInputValue("")
    setShowSuggestions(false)
    setIsProcessing(false)
  }

  // Xử lý thay đổi input và hiển thị suggestions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)

    // Lấy từ cuối cùng để tìm suggestions
    const lastWord = value.split(/\s+/).pop() || ""
    const searchTerm = lastWord.startsWith("#") ? lastWord.substring(1) : lastWord

    if (searchTerm.length > 0) {
      const filtered = allTags.filter(
        (tag) =>
          (tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tag.slug.toLowerCase().includes(searchTerm.toLowerCase())) &&
          !selectedTags.find((t) => t.id === tag.id)
      )
      setSuggestions(filtered.slice(0, 5)) // Giới hạn 5 suggestions
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  // Chọn suggestion
  const selectSuggestion = (tag: Tag) => {
    // Thay thế từ cuối cùng bằng tag đã chọn
    const words = inputValue.split(/\s+/)
    words.pop() // Xóa từ cuối

    if (!selectedTags.find((t) => t.id === tag.id)) {
      onTagsChange([...selectedTags, tag])
    }

    setInputValue(words.join(" ") + (words.length > 0 ? " " : ""))
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  // Xóa tag
  const removeTag = (tagId: string) => {
    onTagsChange(selectedTags.filter((t) => t.id !== tagId))
  }

  return (
    <div className="space-y-3">
      {/* Hiển thị tags đã chọn */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <Badge key={tag.id} variant="secondary" className="flex items-center gap-1 px-2 py-1">
              <span>#{tag.name}</span>
              <button
                type="button"
                onClick={() => removeTag(tag.id)}
                className="ml-1 hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
                aria-label={`Remove ${tag.name}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Input field */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={placeholder || "Type #tagname and press Enter or Space (e.g., #react #nextjs #typescript)"}
          disabled={isProcessing}
          className="w-full px-4 py-2 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
        />

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault() // Prevent blur event
                  selectSuggestion(tag)
                }}
                className="w-full text-left px-4 py-2 hover:bg-accent transition-colors flex items-center gap-2"
              >
                <span className="text-muted-foreground">#</span>
                <span>{tag.name}</span>
                <span className="text-xs text-muted-foreground ml-auto">{tag.slug}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Hướng dẫn sử dụng */}
      <p className="text-xs text-muted-foreground">
        💡 Tip: Type <code className="px-1 py-0.5 bg-muted rounded">#tagname</code> and press{" "}
        <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Enter</kbd> or{" "}
        <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Space</kbd>. New tags will be created automatically.
      </p>
    </div>
  )
}
