"use client"

import type React from "react"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Linkedin, Github } from "lucide-react"

export default function ContactForm() {
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
    <>
      {/* Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <Mail className="h-8 w-8 text-primary mb-2" />
            <CardTitle className="text-lg">{t("emailTitle")}</CardTitle>
            <CardDescription>contact@example.com</CardDescription>
          </CardHeader>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <Linkedin className="h-8 w-8 text-primary mb-2" />
            <CardTitle className="text-lg">{t("linkedinTitle")}</CardTitle>
            <CardDescription>linkedin.com/in/yourprofile</CardDescription>
          </CardHeader>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <Github className="h-8 w-8 text-primary mb-2" />
            <CardTitle className="text-lg">{t("githubTitle")}</CardTitle>
            <CardDescription>github.com/yourusername</CardDescription>
          </CardHeader>
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
                {t("nameLabel")}
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
                {t("messageLabel")}
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
            <Button type="submit" className="w-full" disabled={submitted}>
              {submitted ? t("submitted") : t("submitButton")}
            </Button>
            {submitted && (
              <p className="text-sm text-center text-green-600 dark:text-green-400">
                {t("successMessage")}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </>
  )
}
