import { getRequestConfig } from "next-intl/server"
import { notFound } from "next/navigation"

export const locales = ["en", "vi"]
export const defaultLocale = "en"

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    notFound()
  }

  return {
    messages: (await import(`../public/locales/${locale}.json`)).default,
  }
})
