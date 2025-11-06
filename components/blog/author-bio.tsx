"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { User } from "lucide-react"

interface AuthorBioProps {
  author: {
    name: string
    email?: string
    bio?: string | null
    avatar?: string | null
  } | null
}

/**
 * Component hiển thị thông tin tác giả với ảnh đại diện, tên và giới thiệu
 * Displays author information with avatar, name and bio
 */
export default function AuthorBio({ author }: AuthorBioProps) {
  if (!author) {
    return null
  }

  // Lấy chữ cái đầu của tên để làm fallback avatar
  const initials = author.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2) || "A"

  return (
    <Card className="bg-card/50 border-primary/20">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <Avatar className="h-16 w-16 border-2 border-primary/20">
            <AvatarImage src={author.avatar || undefined} alt={author.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
              {author.avatar ? <User className="h-8 w-8" /> : initials}
            </AvatarFallback>
          </Avatar>

          {/* Author Info */}
          <div className="flex-1 space-y-2">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Về tác giả / About the Author</h3>
              <p className="text-base font-medium text-foreground mt-1">{author.name}</p>
            </div>
            
            {author.bio && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {author.bio}
              </p>
            )}
            
            {!author.bio && (
              <p className="text-sm text-muted-foreground italic">
                Chưa có thông tin giới thiệu / No bio available
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
