"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import Header from "@/components/blog/header"
import Footer from "@/components/blog/footer"
import BlogList from "@/components/blog/blog-list"

export default function Home() {
  const t = useTranslations()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-4 md:px-8 max-w-6xl mx-auto">
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">{t("home.title")}</h1>
              <p className="text-lg text-muted-foreground max-w-2xl">{t("home.subtitle")}</p>
            </div>
            <div className="flex gap-4">
              <Link href="#posts">
                <Button className="bg-primary hover:bg-primary/90">{t("home.readArticles")}</Button>
              </Link>
              <Link href="/about">
                <Button variant="outline">{t("home.aboutMe")}</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Blog Posts Section */}
        <section id="posts" className="py-12 px-4 md:px-8 max-w-6xl mx-auto">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">{t("home.latestArticles")}</h2>
              <p className="text-muted-foreground">{t("home.discoverInsights")}</p>
            </div>
            <BlogList />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
