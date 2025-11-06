"use client"

import { useBlog } from "@/lib/blog-context"
import BlogCard from "./blog-card"
import { Badge } from "@/components/ui/badge"
import { Filter } from "lucide-react"
import { useState } from "react"

export default function BlogListClient() {
  const { getPublishedPosts, isLoading } = useBlog()
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const posts = getPublishedPosts()
  const allTags = Array.from(
    new Set(posts.flatMap((post) => post.tags.map((tag) => (typeof tag === "string" ? tag : tag.name)))),
  )
  const filteredPosts = selectedTag
    ? posts.filter((post) =>
        post.tags.some((tag) => {
          const tagName = typeof tag === "string" ? tag : tag.name
          return tagName === selectedTag
        }),
      )
    : posts

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Skeleton for filters */}
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-7 w-20 bg-muted animate-pulse rounded-full" />
          ))}
        </div>
        
        {/* Skeleton for cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-4 rounded-lg border border-border/50 overflow-hidden bg-card">
              <div className="h-56 bg-muted animate-pulse" />
              <div className="p-6 space-y-4">
                <div className="flex gap-2">
                  <div className="h-5 w-16 bg-muted animate-pulse rounded-full" />
                  <div className="h-5 w-20 bg-muted animate-pulse rounded-full" />
                </div>
                <div className="space-y-2">
                  <div className="h-6 bg-muted animate-pulse rounded w-3/4" />
                  <div className="h-6 bg-muted animate-pulse rounded w-1/2" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded" />
                  <div className="h-4 bg-muted animate-pulse rounded w-5/6" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Tag Filter */}
      {allTags.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Filter className="w-4 h-4" />
            <span>Filter by tag:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedTag === null ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/90 transition-all text-sm px-4 py-1.5"
              onClick={() => setSelectedTag(null)}
            >
              All Posts
              <span className="ml-2 text-xs opacity-70">({posts.length})</span>
            </Badge>
            {allTags.map((tag) => {
              const count = posts.filter((post) =>
                post.tags.some((t) => (typeof t === "string" ? t : t.name) === tag),
              ).length
              return (
                <Badge
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/90 hover:text-primary-foreground transition-all text-sm px-4 py-1.5"
                  onClick={() => setSelectedTag(tag)}
                >
                  #{tag}
                  <span className="ml-2 text-xs opacity-70">({count})</span>
                </Badge>
              )
            })}
          </div>
        </div>
      )}

      {/* Blog Posts Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <svg className="w-10 h-10 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground">No posts found</h3>
            <p className="text-muted-foreground">
              {selectedTag 
                ? `There are no posts with the tag "${selectedTag}". Try selecting a different tag.`
                : "There are no published posts yet. Check back later!"}
            </p>
            {selectedTag && (
              <button
                onClick={() => setSelectedTag(null)}
                className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                View all posts
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
