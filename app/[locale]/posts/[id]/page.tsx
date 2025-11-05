import { Link } from "@/i18n/routing"
import { getTranslations } from "next-intl/server"
import { Button } from "@/components/ui/button"
import Header from "@/components/blog/header"
import Footer from "@/components/blog/footer"
import PostDetailLayout from "@/components/blog/post-detail-layout"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"

// Fetch post data from API
async function getPost(id: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"
    const res = await fetch(`${apiUrl}/posts/${id}`, {
      cache: "no-store", // Always fetch fresh data for now
    })

    if (!res.ok) {
      return null
    }

    return await res.json()
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
