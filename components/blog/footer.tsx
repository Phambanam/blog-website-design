"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { Github, Linkedin, Twitter } from "lucide-react"

export default function Footer() {
  const t = useTranslations("footer")
  const navT = useTranslations("nav")

  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg text-foreground mb-4">{t("blog")}</h3>
            <p className="text-muted-foreground text-sm">{t("description")}</p>
          </div>
          <div>
            <h3 className="font-bold text-lg text-foreground mb-4">{t("navigation")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition">
                  {navT("home")}
                </Link>
              </li>
              <li>
                <Link href="/posts" className="text-muted-foreground hover:text-primary transition">
                  {navT("posts")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition">
                  {navT("about")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition">
                  {navT("contact")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg text-foreground mb-4">{t("follow")}</h3>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>{t("copyright")}</p>
        </div>
      </div>
    </footer>
  )
}
