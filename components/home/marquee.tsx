"use client"

import { useI18n } from "@/lib/use-i18n"

export function Marquee() {
  const { dict } = useI18n()
  const items = [...dict.marquee, ...dict.marquee]
  return (
    <div aria-hidden className="overflow-hidden border-y border-white/10 bg-white/[.03] py-4 backdrop-blur">
      <div className="marquee-track flex w-max gap-4">
        {items.map((word, i) => (
          <span
            key={i}
            className="rounded-full border border-white/12 bg-white/5 px-6 py-2 font-mono text-sm font-bold uppercase tracking-wider text-brand-soft"
          >
            {word}
          </span>
        ))}
      </div>
    </div>
  )
}
