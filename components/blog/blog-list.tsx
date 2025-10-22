"use client"

import { useState } from "react"
import BlogCard from "./blog-card"
import { Badge } from "@/components/ui/badge"
import { useBlog } from "@/lib/blog-context"

export default function BlogList() {
  const { getPublishedPosts } = useBlog()
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

  return (
    <div className="space-y-8">
      {/* Tag Filter */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={selectedTag === null ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setSelectedTag(null)}
        >
          All
        </Badge>
        {allTags.map((tag) => (
          <Badge
            key={tag}
            variant={selectedTag === tag ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedTag(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No posts found for this tag.</p>
        </div>
      )}
    </div>
  )
}
