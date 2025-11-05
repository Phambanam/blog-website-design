"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context"
import { apiClient } from "./api-client"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  featured_image: string | null
  status: "draft" | "published"
  read_time: number
  created_at: string
  updated_at: string
  author?: {
    id: string
    name: string
    email: string
  }
  tags: Array<{ id: string; name: string; slug: string }>
}

interface BlogContextType {
  posts: BlogPost[]
  isLoading: boolean
  error: string | null
  addPost: (post: Omit<BlogPost, "id" | "created_at" | "updated_at" | "author">) => Promise<BlogPost | null>
  updatePost: (id: string, post: Partial<BlogPost>) => Promise<BlogPost | null>
  deletePost: (id: string) => Promise<boolean>
  publishPost: (id: string) => Promise<BlogPost | null>
  getPost: (id: string) => BlogPost | undefined
  getPublishedPosts: () => BlogPost[]
  refreshPosts: (locale?: string) => Promise<void>
}

const BlogContext = createContext<BlogContextType | undefined>(undefined)

export function BlogProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, getToken } = useAuth()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Helper function to convert backend post format to frontend format
  const normalizePost = (backendPost: any): BlogPost => ({
    id: backendPost.id,
    title: backendPost.title,
    excerpt: backendPost.excerpt || '',
    content: backendPost.content,
    featured_image: backendPost.featuredImage,
    status: backendPost.status?.toLowerCase() === 'published' ? 'published' : 'draft',
    read_time: backendPost.readTime || 5,
    created_at: backendPost.createdAt,
    updated_at: backendPost.updatedAt,
    author: backendPost.author,
    tags: backendPost.tags || [],
  })

  const refreshPosts = async (locale: string = 'en') => {
    try {
      setIsLoading(true)
      setError(null)
      const data: any[] = await apiClient.get(`/posts?locale=${locale}&status=published`)
      setPosts((data || []).map(normalizePost))
    } catch (err) {
      console.error("[BLOG] Error fetching posts:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch posts")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshPosts()
  }, [])

  const addPost = async (post: Omit<BlogPost, "id" | "created_at" | "updated_at" | "author">) => {
    try {
      const data = await apiClient.post('/posts', {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        featuredImage: post.featured_image,
        status: post.status,
      })
      const newPost = normalizePost(data)
      setPosts([newPost, ...posts])
      return newPost
    } catch (err) {
      console.error("[BLOG] Error creating post:", err)
      return null
    }
  }

  const updatePost = async (id: string, updates: Partial<BlogPost>) => {
    try {
      const data = await apiClient.put(`/posts/${id}`, {
        title: updates.title,
        excerpt: updates.excerpt,
        content: updates.content,
        featuredImage: updates.featured_image,
        status: updates.status,
      })
      const updatedPost = normalizePost(data)
      setPosts(posts.map((p) => (p.id === id ? updatedPost : p)))
      return updatedPost
    } catch (err) {
      console.error("[BLOG] Error updating post:", err)
      return null
    }
  }

  const deletePost = async (id: string) => {
    try {
      await apiClient.delete(`/posts/${id}`)
      setPosts(posts.filter((p) => p.id !== id))
      return true
    } catch (err) {
      console.error("[BLOG] Error deleting post:", err)
      return false
    }
  }

  const publishPost = async (id: string) => {
    try {
      const data = await apiClient.put(`/posts/${id}/publish`)
      const publishedPost = normalizePost(data)
      setPosts(posts.map((p) => (p.id === id ? publishedPost : p)))
      return publishedPost
    } catch (err) {
      console.error("[BLOG] Error publishing post:", err)
      return null
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
      value={{ posts, isLoading, error, addPost, updatePost, deletePost, publishPost, getPost, getPublishedPosts, refreshPosts }}
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
