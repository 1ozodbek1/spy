"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Eye } from "lucide-react"
import { useI18n } from "@/lib/use-i18n"
import { cn } from "@/lib/utils"
import { LanguageSwitcher } from "./language-switcher"
import { navItems } from "./nav-items"

export function SiteHeader() {
  const { t } = useI18n()
  const pathname = usePathname()

  return (
    <header className="fixed inset-x-3 top-3 z-40 mx-auto flex h-16 max-w-6xl items-center justify-between rounded-full border border-white/10 bg-bg/60 pl-3 pr-2 backdrop-blur-2xl">
      <Link href="/" aria-label="SPY" className="group flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-full bg-brand text-white transition group-hover:-rotate-12">
          <Eye className="size-5" aria-hidden />
        </span>
        <span className="flex flex-col leading-none">
          <span className="font-display text-lg font-extrabold tracking-[.28em]">SPY</span>
          <span className="mt-1 font-mono text-[11px] font-bold tracking-wide text-brand-soft">1ozod.chik1</span>
        </span>
      </Link>

      <nav className="hidden items-center gap-1 rounded-full bg-white/5 p-1 md:flex">
        {navItems.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-full px-5 py-2.5 font-mono text-xs font-bold tracking-wider uppercase transition",
                active ? "bg-white/12 text-white" : "text-muted hover:text-white",
              )}
            >
              {t(item.label)}
            </Link>
          )
        })}
      </nav>

      <LanguageSwitcher />
    </header>
  )
}
