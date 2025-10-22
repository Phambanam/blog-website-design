import { defineConfig } from "next-intl/config"

export default defineConfig({
  locales: ["en", "vi"],
  defaultLocale: "en",
  pathnames: {
    "/": "/",
    "/about": {
      en: "/about",
      vi: "/ve-toi",
    },
    "/contact": {
      en: "/contact",
      vi: "/lien-he",
    },
    "/posts": {
      en: "/posts",
      vi: "/bai-viet",
    },
    "/admin": {
      en: "/admin",
      vi: "/quan-ly",
    },
  },
})
