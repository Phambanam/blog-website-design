import Link from "next/link"
import { Button } from "@/components/ui/button"
import Header from "@/components/blog/header"
import Footer from "@/components/blog/footer"
import BlogList from "@/components/blog/blog-list"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-4 md:px-8 max-w-6xl mx-auto">
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">Welcome to My Blog</h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Exploring ideas about web development, design, and technology. Join me on this journey of learning and
                sharing knowledge.
              </p>
            </div>
            <div className="flex gap-4">
              <Link href="#posts">
                <Button className="bg-primary hover:bg-primary/90">Read Articles</Button>
              </Link>
              <Link href="/about">
                <Button variant="outline">About Me</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Blog Posts Section */}
        <section id="posts" className="py-12 px-4 md:px-8 max-w-6xl mx-auto">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Latest Articles</h2>
              <p className="text-muted-foreground">Discover my latest thoughts and insights</p>
            </div>
            <BlogList />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
