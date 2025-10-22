"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import type { BlogPost } from "@/lib/blog-context"

interface PostEditorProps {
  post: BlogPost | null
  onSave: (post: Partial<BlogPost>) => Promise<void>
  onCancel: () => void
}

export default function PostEditor({ post, onSave, onCancel }: PostEditorProps) {
  const [title, setTitle] = useState(post?.title || "")
  const [excerpt, setExcerpt] = useState(post?.excerpt || "")
  const [content, setContent] = useState(post?.content || "")
  const [status, setStatus] = useState<"draft" | "published">(post?.status || "draft")
  const [tags, setTags] = useState(post?.tags.map((t) => t.name).join(", ") || "")
  const [readTime, setReadTime] = useState(post?.read_time || 5)
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await onSave({
        title,
        excerpt,
        content,
        status,
        tags: tags
          .split(",")
          .map((t) => ({ id: "", name: t.trim(), slug: t.trim().toLowerCase().replace(/\s+/g, "-") }))
          .filter((t) => t.name),
        read_time: readTime,
        featured_image: post?.featured_image || null,
      })
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
          <p className="text-muted-foreground">Create or edit your blog post</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Post Title</CardTitle>
          </CardHeader>
          <CardContent>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title..."
              className="w-full px-4 py-2 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Excerpt</CardTitle>
            <CardDescription>Brief summary of your post</CardDescription>
          </CardHeader>
          <CardContent>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Write a brief excerpt..."
              rows={3}
              className="w-full px-4 py-2 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
            <CardDescription>Write your post content here</CardDescription>
          </CardHeader>
          <CardContent>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your content here..."
              rows={12}
              className="w-full px-4 py-2 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
            <CardDescription>Separate tags with commas</CardDescription>
          </CardHeader>
          <CardContent>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="React, Next.js, Web Development"
              className="w-full px-4 py-2 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Read Time (minutes)</CardTitle>
          </CardHeader>
          <CardContent>
            <input
              type="number"
              value={readTime}
              onChange={(e) => setReadTime(Number.parseInt(e.target.value) || 5)}
              placeholder="5"
              className="w-full px-4 py-2 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="draft"
                  checked={status === "draft"}
                  onChange={(e) => setStatus(e.target.value as "draft" | "published")}
                  className="w-4 h-4"
                />
                <span className="text-foreground">Draft</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="published"
                  checked={status === "published"}
                  onChange={(e) => setStatus(e.target.value as "draft" | "published")}
                  className="w-4 h-4"
                />
                <span className="text-foreground">Published</span>
              </label>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSaving}>
            {isSaving ? "Saving..." : post ? "Update Post" : "Create Post"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
