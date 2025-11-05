import { getTranslations } from "next-intl/server"
import Header from "@/components/blog/header"
import Footer from "@/components/blog/footer"
import BlogListClient from "@/components/blog/blog-list-client"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "posts" })
  
  return {
    title: t("title"),
    description: t("subtitle"),
    openGraph: {
      title: t("title"),
      description: t("subtitle"),
      type: "website",
    },
  }
}

export default async function PostsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "posts" })

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <main className="flex-1">
        <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="space-y-10">
            {/* Hero Section */}
            <div className="text-center space-y-4 py-8 bg-card rounded-2xl shadow-sm border border-border/50 p-8">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight">
                {t("title")}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                {t("subtitle")}
              </p>
              {/* Decorative underline */}
              <div className="flex justify-center pt-4">
                <div className="h-1 w-24 bg-gradient-to-r from-primary to-accent rounded-full" />
              </div>
            </div>
            
            <BlogListClient />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
