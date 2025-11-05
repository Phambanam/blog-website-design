import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { query } from './client'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production'
const TOKEN_COOKIE_NAME = 'auth-token'

export interface User {
  id: string
  email: string
  name: string | null
  role: string
  created_at: string
}

export interface JWTPayload {
  userId: string
  email: string
  role: string
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

// Verify password
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Generate JWT token
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
  })
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}

// Get user from database by email
export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await query<User>(
    'SELECT id, email, name, role, created_at FROM users WHERE email = $1',
    [email]
  )
  return result.rows[0] || null
}

// Get user from database by ID
export async function getUserById(id: string): Promise<User | null> {
  const result = await query<User>(
    'SELECT id, email, name, role, created_at FROM users WHERE id = $1',
    [id]
  )
  return result.rows[0] || null
}

// Create new user
export async function createUser(
  email: string,
  password: string,
  name?: string
): Promise<User> {
  const hashedPassword = await hashPassword(password)
  const result = await query<User>(
    `INSERT INTO users (email, password_hash, name, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, name, role, created_at`,
    [email, hashedPassword, name || null, 'user']
  )
  return result.rows[0]
}

// Authenticate user
export async function authenticateUser(
  email: string,
  password: string
): Promise<{ user: User; token: string } | null> {
  const result = await query<User & { password_hash: string }>(
    'SELECT * FROM users WHERE email = $1',
    [email]
  )

  const user = result.rows[0]
  if (!user) {
    return null
  }

  const isValid = await verifyPassword(password, user.password_hash)
  if (!isValid) {
    return null
  }

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  })

  const { password_hash, ...userWithoutPassword } = user
  return { user: userWithoutPassword, token }
}

// Set auth cookie
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

// Get auth cookie
export async function getAuthCookie(): Promise<string | null> {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(TOKEN_COOKIE_NAME)
  return cookie?.value || null
}

// Remove auth cookie
export async function removeAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(TOKEN_COOKIE_NAME)
}

// Get current user from cookie
export async function getCurrentUser(): Promise<User | null> {
  const token = await getAuthCookie()
  if (!token) {
    return null
  }

  const payload = verifyToken(token)
  if (!payload) {
    await removeAuthCookie()
    return null
  }

  const user = await getUserById(payload.userId)
  return user
}

// Require authentication middleware
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

// Require admin role
export async function requireAdmin(): Promise<User> {
  const user = await requireAuth()
  if (user.role !== 'admin') {
    throw new Error('Forbidden: Admin access required')
  }
  return user
}
