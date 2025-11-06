"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Calendar, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"

interface PostPreviewProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  content: string
  excerpt?: string
  featuredImage?: string
  tags?: string[]
  author?: {
    name: string
    email: string
    bio?: string | null
    avatar?: string | null
  }
  createdAt?: Date
}

export function PostPreview({ 
  open, 
  onOpenChange, 
  title, 
  content, 
  excerpt,
  featuredImage,
  tags,
  author,
  createdAt
}: PostPreviewProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Preview Post</DialogTitle>
        </DialogHeader>
        
        <article className="space-y-6">
          {/* Featured Image */}
          {featuredImage && (
            <div className="relative w-full h-[400px] rounded-xl overflow-hidden">
              <img 
                src={featuredImage} 
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {/* Title */}
          <h1 className="text-4xl font-bold tracking-tight">{title || "Untitled Post"}</h1>
          
          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {author && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{author.name || author.email}</span>
              </div>
            )}
            {createdAt && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time dateTime={createdAt.toISOString()}>
                  {format(createdAt, "MMMM dd, yyyy")}
                </time>
              </div>
            )}
          </div>
          
          {/* Excerpt */}
          {excerpt && (
            <p className="text-lg text-muted-foreground leading-relaxed border-l-4 border-primary pl-4 italic">
              {excerpt}
            </p>
          )}
          
          {/* Divider */}
          <hr className="border-border" />
          
          {/* Content */}
          <div 
            className="prose prose-lg prose-slate dark:prose-invert max-w-none
              prose-headings:font-bold prose-headings:tracking-tight
              prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
              prose-p:leading-relaxed prose-p:text-foreground/90
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-strong:text-foreground prose-strong:font-semibold
              prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
              prose-pre:bg-muted prose-pre:border prose-pre:border-border
              prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:py-1
              prose-img:rounded-lg prose-img:shadow-lg
              prose-video:rounded-lg prose-video:shadow-lg
              prose-ul:list-disc prose-ol:list-decimal
              prose-li:text-foreground/90"
            dangerouslySetInnerHTML={{ __html: content || "<p class='text-muted-foreground italic'>No content yet...</p>" }} 
          />
          
          {/* Tags - Moved to bottom */}
          {tags && tags.length > 0 && (
            <div className="mt-8 pt-8 border-t border-border">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="px-3 py-1 text-sm"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Author Bio - Added at bottom */}
          {author && (
            <div className="mt-8 pt-8 border-t border-border">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={author.avatar || undefined} alt={author.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {author.name?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{author.name || author.email}</h3>
                  <p className="text-muted-foreground text-sm">
                    {author.bio || "This author hasn't written a bio yet."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </article>
      </DialogContent>
    </Dialog>
  )
}
