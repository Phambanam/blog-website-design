"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import TableOfContents from "@/components/blog/table-of-contents"
import AuthorBio from "@/components/blog/author-bio"
import { List } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { useState, useEffect } from "react"
import Image from "next/image"

export interface TocItem {
  id: string
  text: string
  level: number
}

interface PostContentClientProps {
  post: {
    id: string
    title: string
    excerpt: string
    content: string
    featured_image: string | null
    read_time: number
    created_at: string
    updated_at: string | null
    tags: Array<{ id: string; name: string }>
    author: { 
      name: string
      email?: string
      bio?: string | null
      avatar?: string | null
    } | null
  }
  onTocGenerated?: (items: TocItem[]) => void
}

export default function PostContentClient({ post, onTocGenerated }: PostContentClientProps) {
  const [processedContent, setProcessedContent] = useState<string>("")
  const [tocItems, setTocItems] = useState<TocItem[]>([])
  const [showMobileToc, setShowMobileToc] = useState(false)

  useEffect(() => {
    if (post?.content) {
      const parser = new DOMParser()
      const doc = parser.parseFromString(post.content, 'text/html')
      const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6')
      
      const items: TocItem[] = Array.from(headings).map((heading, index) => {
        const level = parseInt(heading.tagName.substring(1))
        const text = heading.textContent || ''
        const id = heading.id || text.toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/^-+|-+$/g, '') || `heading-${index}`
        
        if (!heading.id) {
          heading.id = id
        }
        
        return { id, text, level }
      })
      
      setTocItems(items)
      setProcessedContent(doc.body.innerHTML)
      
      // Notify parent component about TOC items
      if (onTocGenerated) {
        onTocGenerated(items)
      }
    }
  }, [post?.content, onTocGenerated])

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-8">
      {/* Mobile TOC Toggle */}
      <div className="flex justify-end mb-8 lg:hidden">
        {tocItems.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMobileToc(!showMobileToc)}
          >
            <List className="w-4 h-4 mr-2" />
            Mục lục
          </Button>
        )}
      </div>

      {/* Mobile TOC Dropdown */}
      {showMobileToc && tocItems.length > 0 && (
        <div className="lg:hidden mb-8 rounded-lg border-2 border-primary/20 bg-card/95 backdrop-blur-sm p-6 shadow-lg animate-in slide-in-from-top-2">
          <TableOfContents items={tocItems} />
        </div>
      )}

      {/* Post Header */}
      <div className="space-y-6 mb-8">
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">{post.title}</h1>
          <p className="text-lg text-muted-foreground">{post.excerpt}</p>
        </div>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-b border-border pb-6">
          <span>{formatDate(post.created_at)}</span>
          <span>•</span>
          <span>{post.read_time} min read</span>
          <span>•</span>
          <span>By {post.author?.name || 'Anonymous'}</span>
          {post.updated_at && post.updated_at !== post.created_at && (
            <>
              <span>•</span>
              <span>Updated: {formatDate(post.updated_at)}</span>
            </>
          )}
        </div>
      </div>

      {/* Featured Image */}
      {post.featured_image && (
        <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden bg-muted/50 -mx-8 -mt-8 mb-8">
          <Image src={post.featured_image} alt={post.title} fill className="object-cover" />
        </div>
      )}

      {/* Post Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-ul:text-foreground prose-ol:text-foreground prose-li:text-foreground prose-a:text-primary prose-code:text-foreground prose-pre:bg-muted prose-pre:text-foreground mb-8">
        <div dangerouslySetInnerHTML={{ __html: processedContent }} />
      </div>

      {/* Tags - Moved to bottom */}
      {post.tags.length > 0 && (
        <div className="border-t border-border pt-6 mb-6">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag.id} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                #{tag.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Author Bio */}
      <AuthorBio author={post.author} />
    </div>
  )
}

// Separate component for TOC Sidebar
export function TocSidebar({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null
  
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 space-y-6">
        <div className="rounded-lg border-2 border-primary/20 bg-card/80 backdrop-blur-sm p-6 shadow-lg">
          <TableOfContents items={items} />
        </div>
      </div>
    </aside>
  )
}
