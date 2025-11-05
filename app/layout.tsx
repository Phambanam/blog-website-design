import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { BlogProvider } from "@/lib/blog-context"
import { AuthProvider } from "@/lib/auth-context"

export const metadata: Metadata = {
  title: "Modern Blog",
  description: "A modern personal blog with admin dashboard",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AuthProvider>
      <BlogProvider>
        {children}
        <Analytics />
      </BlogProvider>
    </AuthProvider>
  )
}
