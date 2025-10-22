import { getRequestConfig } from "next-intl/server"

const locales = ["en", "vi"]

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) {
    return {}
  }

  return {
    messages: (await import(`../public/locales/${locale}.json`)).default,
  }
})
