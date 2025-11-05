"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

import { apiClient } from "./api-client"

export interface User {
  id: string
  email: string
  name: string | null
  role: string
}

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  isLoading: boolean
  signUp: (email: string, password: string, name?: string) => Promise<{ error: string | null }>
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  getToken: () => string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken')
    }
    return null
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getToken()
        if (!token) {
          setIsAuthenticated(false)
          setUser(null)
          setIsLoading(false)
          return
        }

        const data: any = await apiClient.get('/auth/profile')
        setUser({
          id: data.userId,
          email: data.email,
          name: null,
          role: data.role,
        })
        setIsAuthenticated(true)
      } catch (error) {
        console.error("[AUTH] Auth check error:", error)
        localStorage.removeItem('accessToken')
        setIsAuthenticated(false)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      await apiClient.post('/auth/register', { email, password, name })
      // Backend returns user data but not token on register, need to login
      return await signIn(email, password)
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Registration failed' }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const data: any = await apiClient.post('/auth/login', { email, password })
      localStorage.setItem('accessToken', data.accessToken)
      setUser(data.user)
      setIsAuthenticated(true)
      return { error: null }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Login failed' }
    }
  }

  const signOut = async () => {
    try {
      localStorage.removeItem('accessToken')
      setUser(null)
      setIsAuthenticated(false)
    } catch (error) {
      console.error("[AUTH] Sign out error:", error)
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, signUp, signIn, signOut, getToken }}>
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
