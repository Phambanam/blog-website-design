"use client"

import { useTranslations } from "next-intl"
import Header from "@/components/blog/header"
import Footer from "@/components/blog/footer"
import { Card, CardContent } from "@/components/ui/card"

export default function AboutPage() {
  const t = useTranslations("about")

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="max-w-3xl mx-auto px-4 md:px-8 py-12">
          <div className="space-y-12">
            {/* About Section */}
            <div className="space-y-6">
              <h1 className="text-4xl font-bold text-foreground">{t("title")}</h1>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>{t("intro")}</p>
                <p>{t("expertise")}</p>
                <p>{t("hobby")}</p>
              </div>
            </div>

            {/* Skills Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">{t("skillsTitle")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-bold text-foreground mb-3">{t("frontend")}</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {(t.raw("frontendSkills") as string[]).map((skill, i) => (
                        <li key={i}>• {skill}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-bold text-foreground mb-3">{t("backend")}</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {(t.raw("backendSkills") as string[]).map((skill, i) => (
                        <li key={i}>• {skill}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
