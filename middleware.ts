import { updateSession } from "@/lib/supabase/middleware"
import createMiddleware from "next-intl/middleware"
import type { NextRequest } from "next/server"

const intlMiddleware = createMiddleware({
  locales: ["en", "vi"],
  defaultLocale: "en",
})

export async function middleware(request: NextRequest) {
  const intlResponse = intlMiddleware(request)
  if (intlResponse) {
    return intlResponse
  }
  return await updateSession(request)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
