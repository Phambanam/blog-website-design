"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context"

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  featured_image: string | null
  status: "draft" | "published"
  read_time: number
  created_at: string
  tags: Array<{ id: string; name: string; slug: string }>
}

interface BlogContextType {
  posts: BlogPost[]
  isLoading: boolean
  error: string | null
  addPost: (post: Omit<BlogPost, "id" | "created_at">) => Promise<BlogPost | null>
  updatePost: (id: string, post: Partial<BlogPost>) => Promise<BlogPost | null>
  deletePost: (id: string) => Promise<boolean>
  getPost: (id: string) => BlogPost | undefined
  getPublishedPosts: () => BlogPost[]
  refreshPosts: () => Promise<void>
}

const BlogContext = createContext<BlogContextType | undefined>(undefined)

export function BlogProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshPosts = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch("/api/posts?status=published")
      if (!response.ok) throw new Error("Failed to fetch posts")
      const data = await response.json()
      setPosts(data || [])
    } catch (err) {
      console.error("[v0] Error fetching posts:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch posts")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshPosts()
  }, [])

  const addPost = async (post: Omit<BlogPost, "id" | "created_at">) => {
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          featured_image: post.featured_image,
          tags: post.tags.map((t) => t.name),
        }),
      })
      if (!response.ok) throw new Error("Failed to create post")
      const newPost = await response.json()
      setPosts([newPost, ...posts])
      return newPost
    } catch (err) {
      console.error("[v0] Error creating post:", err)
      return null
    }
  }

  const updatePost = async (id: string, updates: Partial<BlogPost>) => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: updates.title,
          excerpt: updates.excerpt,
          content: updates.content,
          featured_image: updates.featured_image,
          status: updates.status,
          tags: updates.tags?.map((t) => t.name),
        }),
      })
      if (!response.ok) throw new Error("Failed to update post")
      const updatedPost = await response.json()
      setPosts(posts.map((p) => (p.id === id ? updatedPost : p)))
      return updatedPost
    } catch (err) {
      console.error("[v0] Error updating post:", err)
      return null
    }
  }

  const deletePost = async (id: string) => {
    try {
      const response = await fetch(`/api/posts/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete post")
      setPosts(posts.filter((p) => p.id !== id))
      return true
    } catch (err) {
      console.error("[v0] Error deleting post:", err)
      return false
    }
  }

  const getPost = (id: string) => {
    return posts.find((post) => post.id === id)
  }

  const getPublishedPosts = () => {
    return posts.filter((post) => post.status === "published")
  }

  return (
    <BlogContext.Provider
      value={{ posts, isLoading, error, addPost, updatePost, deletePost, getPost, getPublishedPosts, refreshPosts }}
    >
      {children}
    </BlogContext.Provider>
  )
}

export function useBlog() {
  const context = useContext(BlogContext)
  if (!context) {
    throw new Error("useBlog must be used within a BlogProvider")
  }
  return context
}
