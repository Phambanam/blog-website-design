"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  isLoading: boolean
  signUp: (email: string, password: string) => Promise<{ error: string | null }>
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        if (!supabase) {
          setIsLoading(false)
          return
        }

        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user || null)
        setIsAuthenticated(!!user)
      } catch (error) {
        console.error("[v0] Auth check error:", error)
        setIsAuthenticated(false)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    const supabase = createClient()
    if (!supabase) return

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      setIsAuthenticated(!!session?.user)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string) => {
    try {
      const supabase = createClient()
      if (!supabase) {
        return { error: "Supabase is not configured" }
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/admin`,
        },
      })
      return { error: error?.message || null }
    } catch (error) {
      return { error: error instanceof Error ? error.message : "An error occurred" }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const supabase = createClient()
      if (!supabase) {
        return { error: "Supabase is not configured" }
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { error: error?.message || null }
    } catch (error) {
      return { error: error instanceof Error ? error.message : "An error occurred" }
    }
  }

  const signOut = async () => {
    try {
      const supabase = createClient()
      if (!supabase) return

      await supabase.auth.signOut()
      setUser(null)
      setIsAuthenticated(false)
    } catch (error) {
      console.error("[v0] Sign out error:", error)
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
