"use client"

import type React from "react"
import { useState } from "react"
import { useTranslations } from "next-intl"
import Header from "@/components/blog/header"
import Footer from "@/components/blog/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Linkedin, Github } from "lucide-react"

export default function ContactPage() {
  const t = useTranslations("contact")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    setSubmitted(true)
    setTimeout(() => {
      setFormData({ name: "", email: "", message: "" })
      setSubmitted(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="max-w-3xl mx-auto px-4 md:px-8 py-12">
          <div className="space-y-12">
            {/* Header */}
            <div className="space-y-3">
              <h1 className="text-4xl font-bold text-foreground">{t("title")}</h1>
              <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {/* Contact Info Cards */}
              <Card>
                <CardContent className="pt-6 text-center">
                  <Mail className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-bold text-foreground mb-2">{t("email")}</h3>
                  <a
                    href="mailto:hello@example.com"
                    className="text-sm text-muted-foreground hover:text-primary transition"
                  >
                    hello@example.com
                  </a>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <Github className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-bold text-foreground mb-2">{t("github")}</h3>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition">
                    @yourprofile
                  </a>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <Linkedin className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-bold text-foreground mb-2">{t("linkedin")}</h3>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition">
                    /in/yourprofile
                  </a>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>{t("formTitle")}</CardTitle>
                <CardDescription>{t("formDescription")}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-foreground">
                      {t("name")}
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t("namePlaceholder")}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">
                      {t("emailLabel")}
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t("emailPlaceholder")}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-foreground">
                      {t("message")}
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={t("messagePlaceholder")}
                      rows={6}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                    {submitted ? t("sentButton") : t("sendButton")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
