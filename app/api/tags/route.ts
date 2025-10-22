import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

const DEMO_TAGS = [
  { id: "1", name: "Next.js", slug: "nextjs" },
  { id: "2", name: "CSS", slug: "css" },
  { id: "3", name: "React", slug: "react" },
]

export async function GET() {
  try {
    const supabase = await createClient()

    if (!supabase) {
      console.log("[v0] Supabase not configured, returning demo tags")
      return NextResponse.json(DEMO_TAGS)
    }

    const { data: tags, error } = await supabase.from("tags").select("*").order("name")

    if (error) throw error

    return NextResponse.json(tags)
  } catch (error) {
    console.error("[v0] Error fetching tags:", error)
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 })
  }
}
