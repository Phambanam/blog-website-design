"use client"

import Link from "next/link"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/blog/header"
import Footer from "@/components/blog/footer"
import { ArrowLeft } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { useBlog } from "@/lib/blog-context"
import { useEffect, useState } from "react"

export default function PostDetailPage({ params }: { params: { id: string; locale: string } }) {
  const t = useTranslations()
  const { getPost } = useBlog()
  const [post, setPost] = useState<any>(null)

  useEffect(() => {
    const foundPost = getPost(Number.parseInt(params.id))
    setPost(foundPost)
  }, [params.id, getPost])

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Post not found</h1>
            <Link href="/posts">
              <Button variant="outline">Back to Posts</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <article className="max-w-3xl mx-auto px-4 md:px-8 py-12">
          {/* Back Button */}
          <Link href="/posts" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8">
            <ArrowLeft className="w-4 h-4" />
            {t("nav.posts")}
          </Link>

          {/* Post Header */}
          <div className="space-y-6 mb-8">
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">{post.title}</h1>
              <p className="text-lg text-muted-foreground">{post.excerpt}</p>
            </div>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-b border-border pb-6">
              <span>{formatDate(post.date)}</span>
              <span>•</span>
              <span>{post.readTime}</span>
              <span>•</span>
              <span>By {post.author}</span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
            <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag: any) => (
              <Badge key={tag.id || tag} className="bg-primary text-primary-foreground">
                {typeof tag === "string" ? tag : tag.name}
              </Badge>
            ))}
          </div>

          {/* Post Content */}
          <div className="prose prose-invert max-w-none mb-12">
            <div className="space-y-6 text-foreground" dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          {/* Navigation */}
          <div className="border-t border-border pt-8">
            <Link href="/posts">
              <Button variant="outline">{t("posts.title")}</Button>
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
