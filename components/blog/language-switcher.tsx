"use client"

import { useLocale } from "next-intl"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  const switchLanguage = (newLocale: string) => {
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`)
    router.push(newPathname)
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={locale === "en" ? "default" : "ghost"}
        size="sm"
        onClick={() => switchLanguage("en")}
        className="text-xs"
      >
        EN
      </Button>
      <Button
        variant={locale === "vi" ? "default" : "ghost"}
        size="sm"
        onClick={() => switchLanguage("vi")}
        className="text-xs"
      >
        VI
      </Button>
    </div>
  )
}
