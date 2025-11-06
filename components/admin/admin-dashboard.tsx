"use client"

import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import PostEditor from "./post-editor"
import UsersManager from "./users-manager"
import TagsManager from "./tags-manager"
import SettingsManager from "./settings-manager"
import { useBlog, type BlogPost } from "@/lib/blog-context"
import { apiClient } from "@/lib/api-client"

interface AdminDashboardProps {
  activeTab: string
  onLogout: () => void
}

export default function AdminDashboard({ activeTab, onLogout }: AdminDashboardProps) {
  const { posts, addPost, updatePost, deletePost, refreshPosts } = useBlog()
  const [showEditor, setShowEditor] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [allPosts, setAllPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        setIsLoading(true)
        const posts: any[] = await apiClient.get('/posts')

        // Ensure we have an array
        if (Array.isArray(posts)) {
          setAllPosts(posts.map((post: any) => {
            // Normalize tags to ensure consistent format
            const tags = Array.isArray(post.tags) 
              ? post.tags.map((tag: any) => ({
                  id: tag.id,
                  name: tag.name,
                  slug: tag.slug || tag.name.toLowerCase().replace(/\s+/g, '-'),
                }))
              : []
            
            console.log('[ADMIN] Post tags:', post.title, tags)
            
            return {
              id: post.id,
              title: post.title,
              excerpt: post.excerpt || '',
              content: post.content,
              featured_image: post.featuredImage,
              status: post.status?.toLowerCase() === 'published' ? 'published' : 'draft',
              read_time: post.readTime || 5,
              created_at: post.createdAt,
              updated_at: post.updatedAt,
              author: post.author,
              tags: tags,
            }
          }))
        } else {
          setAllPosts([])
        }
      } catch (error) {
        console.error("[ADMIN] Error fetching posts:", error)
        setAllPosts([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchAllPosts()
  }, [])

  const filteredPosts = allPosts.filter((post) => post.title.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleNewPost = () => {
    setEditingPost(null)
    setShowEditor(true)
  }

  const handleEditPost = (post: BlogPost) => {
    console.log('[ADMIN] Edit post - Full object:', post)
    console.log('[ADMIN] Edit post - tags:', post.tags)
    console.log('[ADMIN] Edit post - tags is array:', Array.isArray(post.tags))
    console.log('[ADMIN] Edit post - tags length:', post.tags?.length)
    setEditingPost(post)
    setShowEditor(true)
  }

  const handleDeletePost = (id: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      deletePost(id)
      setAllPosts(allPosts.filter((p) => p.id !== id))
    }
  }

  const handleSavePost = async (post: Partial<BlogPost>) => {
    if (editingPost) {
      const updated = await updatePost(editingPost.id, post)
      if (updated) {
        setAllPosts(allPosts.map((p) => (p.id === editingPost.id ? updated : p)))
      }
    } else {
      const newPost = await addPost({
        title: post.title || "",
        excerpt: post.excerpt || "",
        content: post.content || "",
        featured_image: post.featured_image || null,
        status: post.status || "draft",
        read_time: post.read_time || 5,
        tags: [], // Will be set by backend based on tagIds
        tagIds: post.tagIds || [], // Send tag IDs to backend
      })
      if (newPost) {
        setAllPosts([newPost, ...allPosts])
      }
    }
    setShowEditor(false)
  }

  if (showEditor) {
    return <PostEditor post={editingPost} onSave={handleSavePost} onCancel={() => setShowEditor(false)} />
  }

  // Render different content based on active tab
  if (activeTab === 'users') {
    return <UsersManager />
  }

  if (activeTab === 'tags') {
    return <TagsManager />
  }

  if (activeTab === 'settings') {
    return <SettingsManager />
  }

  // Default to posts tab
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Posts</h1>
          <p className="text-muted-foreground">Manage your blog posts and content</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{allPosts.length}</div>
              <p className="text-sm text-muted-foreground">Total Posts</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {allPosts.filter((p) => p.status === "published").length}
              </div>
              <p className="text-sm text-muted-foreground">Published</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {allPosts.filter((p) => p.status === "draft").length}
              </div>
              <p className="text-sm text-muted-foreground">Drafts</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Posts</CardTitle>
              <CardDescription>Manage your blog posts</CardDescription>
            </div>
            <Button onClick={handleNewPost} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading posts...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-foreground">Title</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="border-b border-border hover:bg-muted/50 transition">
                      <td className="py-3 px-4 text-foreground">{post.title}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            post.status === "published"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                          }`}
                        >
                          {post.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(post.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditPost(post)}
                            className="p-2 hover:bg-muted rounded-md transition"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="p-2 hover:bg-muted rounded-md transition text-destructive"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filteredPosts.length === 0 && !isLoading && (
            <div className="text-center py-8 text-muted-foreground">No posts found</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
