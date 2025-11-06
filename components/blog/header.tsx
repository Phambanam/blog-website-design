"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { Moon, Sun, Menu, X, User, LogOut, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import LanguageSwitcher from "./language-switcher"
import { useAuth } from "@/lib/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const t = useTranslations("nav")
  const { isAuthenticated, user, signOut } = useAuth()
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
        <Link href="/" className="text-2xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tracking-tight">
          Devhunter9x
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

        {/* Theme Toggle, Language Switcher, Auth & Mobile Menu */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          {/* Auth UI - Desktop */}
          <div className="hidden md:block">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    <span className="max-w-[100px] truncate">
                      {user.name || user.email}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name || 'User'}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user.role === 'ADMIN' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer">
                        <Shield className="h-4 w-4 mr-2" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="default" size="sm" asChild>
                <Link href="/admin">Login</Link>
              </Button>
            )}
          </div>

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
            
            {/* Mobile Auth UI */}
            <div className="border-t border-border pt-3 mt-3">
              {isAuthenticated && user ? (
                <>
                  <div className="px-2 py-2 mb-2">
                    <p className="text-sm font-medium text-foreground">{user.name || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  {user.role === 'ADMIN' && (
                    <Link 
                      href="/admin" 
                      className="flex items-center gap-2 text-foreground hover:text-primary transition py-2 px-2"
                    >
                      <Shield className="h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={signOut}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 transition py-2 px-2 w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/admin" className="block w-full">
                  <Button variant="default" size="sm" className="w-full">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
