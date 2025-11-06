"use client"

import { useState } from "react"
import PostContentClient, { TocSidebar, type TocItem } from "./post-content-client"

interface PostDetailLayoutProps {
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
}

export default function PostDetailLayout({ post }: PostDetailLayoutProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([])

  return (
    <>
      {/* Main Content */}
      <article className="min-w-0">
        <PostContentClient post={post} onTocGenerated={setTocItems} />
      </article>

      {/* Sidebar - Table of Contents */}
      <TocSidebar items={tocItems} />
    </>
  )
}
