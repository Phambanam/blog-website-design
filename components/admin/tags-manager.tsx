"use client"

import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { apiClient } from "@/lib/api-client"

interface Tag {
  id: string
  name: string
  slug: string
  createdAt: string
}

export default function TagsManager() {
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [tagName, setTagName] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchTags()
  }, [])

  const fetchTags = async () => {
    try {
      setIsLoading(true)
      const data = await apiClient.get('/tags')
      setTags(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching tags:", error)
      setTags([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateTag = async () => {
    if (!tagName.trim()) return

    try {
      const newTag = await apiClient.post('/tags', {
        name: tagName,
        slug: tagName.toLowerCase().replace(/\s+/g, '-')
      }) as Tag
      setTags([newTag, ...tags])
      setTagName("")
      setIsEditing(false)
    } catch (error) {
      console.error("Error creating tag:", error)
      alert("Failed to create tag")
    }
  }

  const handleDeleteTag = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tag?")) return

    try {
      await apiClient.delete(`/tags/${id}`)
      setTags(tags.filter(t => t.id !== id))
    } catch (error) {
      console.error("Error deleting tag:", error)
      alert("Failed to delete tag")
    }
  }

  const filteredTags = tags.filter(tag => 
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tags</h1>
          <p className="text-muted-foreground">Manage your blog tags and categories</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{tags.length}</div>
              <p className="text-sm text-muted-foreground">Total Tags</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Tags</CardTitle>
              <CardDescription>Create and manage your blog tags</CardDescription>
            </div>
            <Button 
              onClick={() => setIsEditing(!isEditing)} 
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Tag
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isEditing && (
            <div className="mb-6 p-4 border border-border rounded-md bg-muted/30">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Tag name..."
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreateTag()
                    if (e.key === 'Escape') setIsEditing(false)
                  }}
                  className="flex-1"
                  autoFocus
                />
                <Button onClick={handleCreateTag}>Create</Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              </div>
            </div>
          )}

          <div className="mb-6">
            <Input
              type="text"
              placeholder="Search tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading tags...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-foreground">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Slug</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Created</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTags.map((tag) => (
                    <tr key={tag.id} className="border-b border-border hover:bg-muted/50 transition">
                      <td className="py-3 px-4 text-foreground font-medium">{tag.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{tag.slug}</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(tag.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDeleteTag(tag.id)}
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

          {filteredTags.length === 0 && !isLoading && (
            <div className="text-center py-8 text-muted-foreground">No tags found</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
