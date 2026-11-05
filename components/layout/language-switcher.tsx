"use client"

import { Check, Languages } from "lucide-react"
import { useEffect, useState } from "react"
import { useI18n } from "@/lib/use-i18n"
import type { Language } from "@/data/translations"
import { cn } from "@/lib/utils"

const options: { id: Language; label: string; short: string }[] = [
  { id: "uz", label: "O‘zbekcha", short: "UZ" },
  { id: "ru", label: "Русский", short: "RU" },
  { id: "kg", label: "Кыргызча", short: "KG" },
]

export function LanguageSwitcher() {
  const { lang, setLang } = useI18n()
  const [open, setOpen] = useState(false)
  const active = options.find((o) => o.id === lang)!

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex h-11 items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 font-mono text-sm font-bold backdrop-blur transition hover:bg-white/10"
      >
        <Languages className="size-4 text-brand-soft" aria-hidden />
        {active.short}
      </button>
      {open && (
        <>
          <button
            type="button"
            aria-label="Close"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <ul
            role="listbox"
            className="absolute right-0 top-14 z-50 w-52 rounded-3xl border border-white/12 bg-surface/95 p-2 shadow-2xl backdrop-blur-xl"
          >
            {options.map((o) => (
              <li key={o.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={o.id === lang}
                  onClick={() => {
                    setLang(o.id)
                    setOpen(false)
                  }}
                  className={cn(
                    "flex min-h-11 w-full items-center gap-3 rounded-2xl px-4 text-left text-sm transition hover:bg-white/8",
                    o.id === lang ? "text-white" : "text-muted",
                  )}
                >
                  <span className="w-7 font-mono text-xs font-bold">{o.short}</span>
                  <span className="flex-1">{o.label}</span>
                  {o.id === lang && <Check className="size-4 text-brand-soft" aria-hidden />}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
