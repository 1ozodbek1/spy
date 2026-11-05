"use client"

import { useI18n } from "@/lib/use-i18n"
import { PlayersPanel } from "./players-panel"
import { SummaryCard } from "./summary-card"

export function PlayView() {
  const { t } = useI18n()
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <span className="font-mono text-xs font-bold uppercase tracking-[.2em] text-brand-soft">
        {t("playEyebrow")}
      </span>
      <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-6xl">
        {t("playTitle")}
      </h1>
      <p className="mt-4 max-w-xl text-lg text-muted">{t("playText")}</p>

      <div className="mt-10 grid items-start gap-6 lg:grid-cols-[1.25fr_.75fr]">
        <PlayersPanel />
        <SummaryCard />
      </div>
    </div>
  )
}
