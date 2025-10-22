"use client"

import { useTranslations } from "next-intl"
import Header from "@/components/blog/header"
import Footer from "@/components/blog/footer"
import BlogList from "@/components/blog/blog-list"

export default function PostsPage() {
  const t = useTranslations("posts")

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="py-12 px-4 md:px-8 max-w-6xl mx-auto">
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">{t("title")}</h1>
              <p className="text-muted-foreground">{t("subtitle")}</p>
            </div>
            <BlogList />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
