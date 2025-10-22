import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"

interface BlogCardProps {
  post: {
    id: number
    title: string
    excerpt: string
    tags: string[]
    date: string
    image: string
  }
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/posts/${post.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
        <div className="relative h-48 w-full bg-muted">
          <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
        </div>
        <CardHeader>
          <CardTitle className="line-clamp-2">{post.title}</CardTitle>
          <CardDescription>{formatDate(post.date)}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={typeof tag === "string" ? tag : tag.id} variant="secondary" className="text-xs">
                {typeof tag === "string" ? tag : tag.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
