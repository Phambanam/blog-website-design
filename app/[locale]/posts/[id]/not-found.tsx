import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import Header from "@/components/blog/header"
import Footer from "@/components/blog/footer"
import { FileQuestion } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <FileQuestion className="w-12 h-12 text-muted-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">Post not found</h1>
          <p className="text-lg text-muted-foreground">
            The post you're looking for doesn't exist or has been removed.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/posts">
              <Button>Browse all posts</Button>
            </Link>
            <Link href="/">
              <Button variant="outline">Go home</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
