"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, X, Plus, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import RichTextEditor from "./rich-text-editor"
import { PostPreview } from "./post-preview"
import type { BlogPost } from "@/lib/blog-context"
import { apiClient } from "@/lib/api-client"
import { useAuth } from "@/lib/auth-context"

interface PostEditorProps {
  post: BlogPost | null
  onSave: (post: Partial<BlogPost>) => Promise<void>
  onCancel: () => void
}

interface Tag {
  id: string
  name: string
  slug: string
}

interface PostTranslation {
  locale: string
  title: string
  excerpt: string
  content: string
}

export default function PostEditor({ post, onSave, onCancel }: PostEditorProps) {
  const [activeLanguage, setActiveLanguage] = useState<"vi" | "en">("vi")
  const [titleVi, setTitleVi] = useState("")
  const [excerptVi, setExcerptVi] = useState("")
  const [contentVi, setContentVi] = useState("")
  const [titleEn, setTitleEn] = useState("")
  const [excerptEn, setExcerptEn] = useState("")
  const [contentEn, setContentEn] = useState("")
  const [featuredImage, setFeaturedImage] = useState("")
  const [status, setStatus] = useState<"draft" | "published">("draft")
  const [readTime, setReadTime] = useState(5)
  const [isSaving, setIsSaving] = useState(false)
  const [availableTags, setAvailableTags] = useState<Tag[]>([])
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [showTagDropdown, setShowTagDropdown] = useState(false)
  const [tagSearchQuery, setTagSearchQuery] = useState("")
  const [isLoadingTags, setIsLoadingTags] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const { user } = useAuth()
  
  useEffect(() => {
    const loadTags = async () => {
      setIsLoadingTags(true)
      try {
        const response = await apiClient.get<Tag[]>('/tags')
        setAvailableTags(response || [])
      } catch (error) {
        console.error('Failed to load tags:', error)
        setAvailableTags([])
      } finally {
        setIsLoadingTags(false)
      }
    }
    loadTags()
  }, [])
  
  useEffect(() => {
    const loadPostData = async () => {
      if (post) {
        try {
          const translations = await apiClient.get<PostTranslation[]>(
            `/posts/${post.id}/translations`
          )
          const viTranslation = translations?.find((t) => t.locale === 'vi')
          const enTranslation = translations?.find((t) => t.locale === 'en')
          
          if (viTranslation) {
            setTitleVi(viTranslation.title)
            setExcerptVi(viTranslation.excerpt || '')
            setContentVi(viTranslation.content)
          } else {
            setTitleVi(post.title)
            setExcerptVi(post.excerpt || '')
            setContentVi(post.content)
          }
          
          if (enTranslation) {
            setTitleEn(enTranslation.title)
            setExcerptEn(enTranslation.excerpt || '')
            setContentEn(enTranslation.content)
          }
        } catch (error) {
          console.error('Failed to load translations:', error)
          setTitleVi(post.title)
          setExcerptVi(post.excerpt || '')
          setContentVi(post.content)
        }
        
        setFeaturedImage(post.featured_image || '')
        setStatus(post.status)
        setReadTime(post.read_time || 5)
        setSelectedTags(post.tags || [])
      }
    }
    
    loadPostData()
  }, [post])
  
  const addTag = (tag: Tag) => {
    if (!selectedTags.find((t) => t.id === tag.id)) {
      setSelectedTags([...selectedTags, tag])
    }
    setShowTagDropdown(false)
    setTagSearchQuery("")
  }
  
  const removeTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter((t) => t.id !== tagId))
  }
  
  const filteredTags = (availableTags || []).filter(
    (tag) =>
      tag.name.toLowerCase().includes(tagSearchQuery.toLowerCase()) &&
      !selectedTags.find((t) => t.id === tag.id)
  )
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      const postData = {
        title: titleVi,
        excerpt: excerptVi,
        content: contentVi,
        featuredImage,
        status,
        read_time: readTime,
        tags: selectedTags,
      }
      
      await onSave(postData)
      
      if (post?.id) {
        if (titleVi || contentVi) {
          try {
            await apiClient.post(`/posts/${post.id}/translations`, {
              locale: 'vi',
              title: titleVi,
              excerpt: excerptVi,
              content: contentVi,
            })
          } catch (error) {
            console.error('Failed to save VI translation:', error)
          }
        }
        
        if (titleEn || contentEn) {
          try {
            await apiClient.post(`/posts/${post.id}/translations`, {
              locale: 'en',
              title: titleEn,
              excerpt: excerptEn,
              content: contentEn,
            })
          } catch (error) {
            console.error('Failed to save EN translation:', error)
          }
        }
      }
    } catch (error) {
      console.error('Failed to save post:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={onCancel} className="p-2 hover:bg-muted rounded-md transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{post ? "Edit Post" : "New Post"}</h1>
          <p className="text-muted-foreground">Create or edit your blog post in Vietnamese and English</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Language / Ngôn ngữ</CardTitle>
            <CardDescription>Edit your post in both languages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={activeLanguage === "vi" ? "default" : "outline"}
                onClick={() => setActiveLanguage("vi")}
              >
                🇻🇳 Tiếng Việt
              </Button>
              <Button
                type="button"
                variant={activeLanguage === "en" ? "default" : "outline"}
                onClick={() => setActiveLanguage("en")}
              >
                🇬🇧 English
              </Button>
            </div>
          </CardContent>
        </Card>

        {activeLanguage === "vi" && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Tiêu đề</CardTitle>
              </CardHeader>
              <CardContent>
                <input
                  type="text"
                  value={titleVi}
                  onChange={(e) => setTitleVi(e.target.value)}
                  placeholder="Nhập tiêu đề..."
                  className="w-full px-4 py-2 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Trích đoạn</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={excerptVi}
                  onChange={(e) => setExcerptVi(e.target.value)}
                  placeholder="Tóm tắt ngắn..."
                  rows={3}
                  className="w-full px-4 py-2 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Nội dung</CardTitle>
              </CardHeader>
              <CardContent>
                <RichTextEditor content={contentVi} onChange={setContentVi} placeholder="Viết nội dung..." />
              </CardContent>
            </Card>
          </>
        )}

        {activeLanguage === "en" && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Title</CardTitle>
              </CardHeader>
              <CardContent>
                <input
                  type="text"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="Enter title..."
                  className="w-full px-4 py-2 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Excerpt</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={excerptEn}
                  onChange={(e) => setExcerptEn(e.target.value)}
                  placeholder="Brief summary..."
                  rows={3}
                  className="w-full px-4 py-2 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Content</CardTitle>
              </CardHeader>
              <CardContent>
                <RichTextEditor content={contentEn} onChange={setContentEn} placeholder="Write content..." />
              </CardContent>
            </Card>
          </>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <Badge key={tag.id} variant="secondary" className="flex items-center gap-1">
                    {tag.name}
                    <button type="button" onClick={() => removeTag(tag.id)} className="ml-1">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={tagSearchQuery}
                  onChange={(e) => {
                    setTagSearchQuery(e.target.value)
                    setShowTagDropdown(true)
                  }}
                  placeholder="Search tags..."
                  className="w-full px-4 py-2 rounded-md border border-border bg-background"
                />
                {showTagDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredTags.map((tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => addTag(tag)}
                        className="w-full text-left px-4 py-2 hover:bg-accent"
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Featured Image</CardTitle>
          </CardHeader>
          <CardContent>
            <input
              type="url"
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2 rounded-md border border-border bg-background"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <label>
                <input
                  type="radio"
                  value="draft"
                  checked={status === "draft"}
                  onChange={(e) => setStatus(e.target.value as "draft")}
                />
                <span className="ml-2">Draft</span>
              </label>
              <label>
                <input
                  type="radio"
                  value="published"
                  checked={status === "published"}
                  onChange={(e) => setStatus(e.target.value as "published")}
                />
                <span className="ml-2">Published</span>
              </label>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : post ? "Update" : "Create"}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setShowPreview(true)}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>

      {/* Post Preview Dialog */}
      <PostPreview
        open={showPreview}
        onOpenChange={setShowPreview}
        title={activeLanguage === "vi" ? titleVi : titleEn}
        content={activeLanguage === "vi" ? contentVi : contentEn}
        excerpt={activeLanguage === "vi" ? excerptVi : excerptEn}
        featuredImage={featuredImage}
        tags={selectedTags.map(tag => tag.name)}
        author={user ? {
          name: user.name || '',
          email: user.email
        } : undefined}
        createdAt={post?.created_at ? new Date(post.created_at) : new Date()}
      />
    </div>
  )
}
