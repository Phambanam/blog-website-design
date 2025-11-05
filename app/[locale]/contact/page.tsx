import { getTranslations } from "next-intl/server"
import Header from "@/components/blog/header"
import Footer from "@/components/blog/footer"
import ContactForm from "@/components/blog/contact-form"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "contact" })
  
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

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "contact" })

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <main className="flex-1">
        <section className="max-w-3xl mx-auto px-4 md:px-8 py-12">
          <div className="space-y-12">
            {/* Header */}
            <div className="space-y-3 bg-card rounded-2xl shadow-sm border border-border/50 p-8">
              <h1 className="text-4xl font-bold text-foreground">{t("title")}</h1>
              <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
            </div>

            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
