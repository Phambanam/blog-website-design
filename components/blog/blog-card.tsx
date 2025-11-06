import Image from "next/image"
import { Link } from "@/i18n/routing"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import type { BlogPost } from "@/lib/blog-context"
import { Calendar, Clock, User } from "lucide-react"

interface BlogCardProps {
  post: BlogPost
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/posts/${post.id}`} className="group">
      <Card className="h-full border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer overflow-hidden bg-card">
        {/* Image with overlay gradient */}
        <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
          {post.featured_image ? (
            <Image 
              src={post.featured_image} 
              alt={post.title} 
              fill 
              className="object-cover transition-transform duration-500 group-hover:scale-110" 
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-10 h-10 text-primary/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-muted-foreground">No Image</p>
              </div>
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        </div>

        <CardHeader className="pb-3 space-y-3">
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge 
                  key={typeof tag === "string" ? tag : tag.id} 
                  variant="secondary" 
                  className="text-xs px-2 py-0.5 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  #{typeof tag === "string" ? tag : tag.name}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-muted text-muted-foreground">
                  +{post.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Title */}
          <CardTitle className="line-clamp-2 text-xl font-bold group-hover:text-primary transition-colors leading-tight">
            {post.title}
          </CardTitle>

          {/* Meta information */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(post.created_at)}</span>
            </div>
            {post.read_time && (
              <>
                <span className="text-border">•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{post.read_time} min</span>
                </div>
              </>
            )}
            {post.author && (
              <>
                <span className="text-border">•</span>
                <div className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[100px]">{post.author.name}</span>
                </div>
              </>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {/* Excerpt */}
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {post.excerpt || "No description available."}
          </p>

          {/* Read more indicator */}
          <div className="mt-4 flex items-center text-sm font-medium text-primary group-hover:gap-2 transition-all">
            <span>Read more</span>
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
