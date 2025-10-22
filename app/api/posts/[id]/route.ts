import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

const DEMO_POSTS = [
  {
    id: "1",
    title: "Getting Started with Next.js",
    excerpt: "Learn the basics of Next.js and build your first application",
    content:
      "Next.js is a React framework that enables you to build full-stack web applications. It provides features like server-side rendering, static site generation, and API routes.",
    featured_image: "/next-js-development.jpg",
    status: "published",
    read_time: 5,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    tags: [{ id: "1", name: "Next.js", slug: "nextjs" }],
  },
  {
    id: "2",
    title: "Tailwind CSS Design System",
    excerpt: "Build beautiful UIs with Tailwind CSS utility-first approach",
    content:
      "Tailwind CSS is a utility-first CSS framework that helps you build modern designs without leaving your HTML. It provides a comprehensive set of pre-built utility classes.",
    featured_image: "/tailwind-css-design.jpg",
    status: "published",
    read_time: 8,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    tags: [{ id: "2", name: "CSS", slug: "css" }],
  },
  {
    id: "3",
    title: "React Hooks Best Practices",
    excerpt: "Master React Hooks and write cleaner, more efficient code",
    content:
      "React Hooks allow you to use state and other React features without writing a class. Learn the best practices for using hooks in your React applications.",
    featured_image: "/react-hooks-programming.jpg",
    status: "published",
    read_time: 10,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    tags: [{ id: "3", name: "React", slug: "react" }],
  },
]

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const { id } = await params

    if (!supabase) {
      const demoPost = DEMO_POSTS.find((p) => p.id === id)
      if (!demoPost) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 })
      }
      return NextResponse.json(demoPost)
    }

    const { data: post, error } = await supabase
      .from("posts")
      .select(
        `
        id,
        title,
        excerpt,
        content,
        featured_image,
        status,
        read_time,
        created_at,
        post_tags(tags(id, name, slug))
      `,
      )
      .eq("id", id)
      .single()

    if (error) throw error
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error("[v0] Error fetching post:", error)
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { title, excerpt, content, featured_image, status, tags } = body

    const { data: post, error: updateError } = await supabase
      .from("posts")
      .update({
        title,
        excerpt,
        content,
        featured_image,
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("author_id", user.id)
      .select()
      .single()

    if (updateError) throw updateError

    if (tags) {
      await supabase.from("post_tags").delete().eq("post_id", id)

      if (tags.length > 0) {
        const tagIds = await Promise.all(
          tags.map(async (tagName: string) => {
            const { data: tag } = await supabase.from("tags").select("id").eq("name", tagName).single()

            if (tag) return tag.id

            const { data: newTag } = await supabase
              .from("tags")
              .insert({
                name: tagName,
                slug: tagName.toLowerCase().replace(/\s+/g, "-"),
              })
              .select()
              .single()

            return newTag?.id
          }),
        )

        await supabase.from("post_tags").insert(
          tagIds.map((tagId) => ({
            post_id: id,
            tag_id: tagId,
          })),
        )
      }
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error("[v0] Error updating post:", error)
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const { error } = await supabase.from("posts").delete().eq("id", id).eq("author_id", user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting post:", error)
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
  }
}
