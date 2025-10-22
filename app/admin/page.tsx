"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/admin/admin-layout"
import AdminDashboard from "@/components/admin/admin-dashboard"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"

export default function AdminPage() {
  const { isAuthenticated, isLoading, signIn, signOut } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    const { error: signInError } = await signIn(email, password)
    if (signInError) {
      setError(signInError)
    }
    setIsSubmitting(false)
  }

  const handleLogout = async () => {
    await signOut()
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <AdminLayout>
          <div className="w-full max-w-md">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-foreground">Admin Login</h1>
                <p className="text-muted-foreground">Sign in to manage your blog</p>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                {error && <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">{error}</div>}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full px-4 py-2 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </Button>
              </form>
              <p className="text-xs text-center text-muted-foreground">
                Create an account at{" "}
                <a href="/auth/sign-up" className="text-primary hover:underline">
                  sign up
                </a>
              </p>
            </div>
          </div>
        </AdminLayout>
      </div>
    )
  }

  return (
    <AdminLayout>
      <AdminDashboard onLogout={handleLogout} />
    </AdminLayout>
  )
}
