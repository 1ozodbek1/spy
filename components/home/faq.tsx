"use client"

import { Plus } from "lucide-react"
import { useI18n } from "@/lib/use-i18n"

const items = [
  ["q1", "a1"],
  ["q2", "a2"],
  ["q3", "a3"],
] as const

export function Faq() {
  const { t } = useI18n()
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{t("faqTitle")}</h2>
      <div className="mt-8 space-y-3">
        {items.map(([q, a]) => (
          <details
            key={q}
            className="group rounded-3xl border border-white/10 bg-white/5 px-6 backdrop-blur open:bg-white/8"
          >
            <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 font-bold [&::-webkit-details-marker]:hidden">
              {t(q)}
              <Plus className="size-5 shrink-0 text-brand-soft transition group-open:rotate-45" aria-hidden />
            </summary>
            <p className="pb-5 leading-relaxed text-muted">{t(a)}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
