import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 })
    }

    await supabase.auth.signOut()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error logging out:", error)
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 })
  }
}
