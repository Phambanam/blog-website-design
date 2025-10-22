"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { Moon, Sun, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import LanguageSwitcher from "./language-switcher"

export default function Header() {
  const t = useTranslations("nav")
  const [isDark, setIsDark] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark")
    setIsDark(isDarkMode)
  }, [])

  const toggleTheme = () => {
    const html = document.documentElement
    html.classList.toggle("dark")
    setIsDark(!isDark)
    localStorage.setItem("theme", isDark ? "light" : "dark")
  }

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <nav className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary">
          Blog
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-foreground hover:text-primary transition">
            {t("home")}
          </Link>
          <Link href="/posts" className="text-foreground hover:text-primary transition">
            {t("posts")}
          </Link>
          <Link href="/about" className="text-foreground hover:text-primary transition">
            {t("about")}
          </Link>
          <Link href="/contact" className="text-foreground hover:text-primary transition">
            {t("contact")}
          </Link>
          <Link href="/admin" className="text-foreground hover:text-primary transition">
            {t("admin")}
          </Link>
        </div>

        {/* Theme Toggle, Language Switcher & Mobile Menu */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="px-4 py-4 space-y-3">
            <Link href="/" className="block text-foreground hover:text-primary transition py-2">
              {t("home")}
            </Link>
            <Link href="/posts" className="block text-foreground hover:text-primary transition py-2">
              {t("posts")}
            </Link>
            <Link href="/about" className="block text-foreground hover:text-primary transition py-2">
              {t("about")}
            </Link>
            <Link href="/contact" className="block text-foreground hover:text-primary transition py-2">
              {t("contact")}
            </Link>
            <Link href="/admin" className="block text-foreground hover:text-primary transition py-2">
              {t("admin")}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
