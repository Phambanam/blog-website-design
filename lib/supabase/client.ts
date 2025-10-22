import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    console.warn("[v0] Supabase environment variables not configured. Using demo mode.")
    // Return a mock client for demo purposes
    return null
  }

  return createBrowserClient(url, key)
}
