"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useI18n } from "@/lib/use-i18n"
import { cn } from "@/lib/utils"
import { navItems } from "./nav-items"

export function MobileNav() {
  const { t } = useI18n()
  const pathname = usePathname()

  return (
    <nav className="fixed inset-x-3 bottom-[calc(.75rem+env(safe-area-inset-bottom))] z-40 flex h-16 gap-1 rounded-full border border-white/12 bg-surface/90 p-1.5 shadow-2xl backdrop-blur-2xl md:hidden">
      {navItems.map((item) => {
        const active = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-label={t(item.label)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-w-0 items-center justify-center gap-2 rounded-full font-mono text-xs font-bold uppercase tracking-wider transition-all",
              active ? "flex-[2.4] bg-brand text-white" : "flex-1 text-muted",
            )}
          >
            <item.icon className="size-5 shrink-0" aria-hidden />
            {active && <span className="truncate">{t(item.label)}</span>}
          </Link>
        )
      })}
    </nav>
  )
}
