import { Link } from "@/i18n/routing"
import { getTranslations } from "next-intl/server"
import { Button } from "@/components/ui/button"
import Header from "@/components/blog/header"
import Footer from "@/components/blog/footer"
import PostDetailLayout from "@/components/blog/post-detail-layout"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"

// Fetch post data from API and normalize to frontend shape
async function getPost(id: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"
    const res = await fetch(`${apiUrl}/posts/${id}`, {
      cache: "no-store", // Always fetch fresh data for now
    })

    if (!res.ok) {
      return null
    }
    const raw = await res.json()

    // Normalize field names to match frontend expectations
    const normalizeTag = (input: any) => {
      if (!input) return null

      const candidate = typeof input === "string" ? input : input.tag ?? input.tags ?? input

      if (!candidate) return null
      if (typeof candidate === "string") {
        return { id: candidate, name: candidate }
      }

      const id =
        candidate.id ??
        candidate.slug ??
        input.id ??
        input.slug

      if (!id) return null

      const name =
        candidate.name ??
        candidate.title ??
        candidate.slug ??
        input.name ??
        input.title ??
        String(id)

      return { id: String(id), name: String(name) }
    }

    const rawTags =
      (Array.isArray(raw.tags) && raw.tags.length && raw.tags) ||
      (Array.isArray(raw.post_tags) && raw.post_tags.length && raw.post_tags) ||
      (Array.isArray(raw.postTags) && raw.postTags.length && raw.postTags) ||
      []

    const normalized = {
      id: raw.id,
      title: raw.title,
      excerpt: raw.excerpt ?? "",
      content: raw.content,
      featured_image: raw.featured_image ?? raw.featuredImage ?? null,
      read_time: raw.read_time ?? raw.readTime ?? 5,
      created_at: raw.created_at ?? raw.createdAt,
      updated_at: raw.updated_at ?? raw.updatedAt ?? null,
      author: raw.author ? {
        name: raw.author.name || raw.author.email || 'Anonymous',
        email: raw.author.email,
        bio: raw.author.bio ?? null,
        avatar: raw.author.avatar ?? null,
      } : null,
      tags: Array.isArray(rawTags) ? rawTags.map(normalizeTag).filter((tag): tag is { id: string; name: string } => tag !== null) : [],
    }

    return normalized
  } catch (error) {
    console.error("Error fetching post:", error)
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string; locale: string }> }) {
  const { id, locale } = await params
  const post = await getPost(id)
  
  if (!post) {
    return {
      title: "Post not found",
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
      authors: [post.author?.name || "Anonymous"],
      images: post.featured_image ? [post.featured_image] : [],
    },
  }
}

export default async function PostDetailPage({ params }: { params: Promise<{ id: string; locale: string }> }) {
  const { id, locale } = await params
  const t = await getTranslations({ locale, namespace: "nav" })
  const post = await getPost(id)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          {/* Back Button */}
          <div className="mb-8">
            <Link href="/posts" className="inline-flex items-center gap-2 text-primary hover:text-primary/80">
              <ArrowLeft className="w-4 h-4" />
              {t("posts")}
            </Link>
          </div>

          {/* Two-column layout: Content + TOC Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
            {/* PostDetailLayout renders both article and sidebar */}
            <PostDetailLayout post={post} />
          </div>

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t border-border">
            <Link href="/posts">
              <Button variant="outline">{t("posts")}</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
