import { Link } from "@/i18n/routing"
import { getTranslations } from "next-intl/server"
import { Button } from "@/components/ui/button"
import Header from "@/components/blog/header"
import Footer from "@/components/blog/footer"
import BlogListClient from "@/components/blog/blog-list-client"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "home" })
  
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

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "home" })

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-4 md:px-8 max-w-6xl mx-auto">
          <div className="space-y-6 bg-card rounded-2xl shadow-sm border border-border/50 p-8 md:p-12">
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">{t("title")}</h1>
              <p className="text-lg text-muted-foreground max-w-2xl">{t("subtitle")}</p>
            </div>
            <div className="flex gap-4">
              <Link href="#posts">
                <Button className="bg-primary hover:bg-primary/90">{t("readArticles")}</Button>
              </Link>
              <Link href="/about">
                <Button variant="outline">{t("aboutMe")}</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Blog Posts Section */}
        <section id="posts" className="py-12 px-4 md:px-8 max-w-6xl mx-auto">
          <div className="space-y-8">
            <div className="bg-card rounded-2xl shadow-sm border border-border/50 p-6">
              <h2 className="text-3xl font-bold text-foreground mb-2">{t("latestArticles")}</h2>
              <p className="text-muted-foreground">{t("discoverInsights")}</p>
            </div>
            <BlogListClient />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
