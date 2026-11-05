"use client"

import { useI18n } from "@/lib/use-i18n"

export function SiteFooter() {
  const { t } = useI18n()
  return (
    <footer className="px-4 pb-28 pt-10 text-center font-mono text-xs tracking-wider text-muted md:pb-10">
      SPY · 1ozod.chik1 · {t("footer")}
    </footer>
  )
}
