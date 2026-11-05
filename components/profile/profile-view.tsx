"use client"

import { Swords, Trophy, Eye } from "lucide-react"
import { useI18n } from "@/lib/use-i18n"
import { cn } from "@/lib/utils"
import { useHistoryStore } from "@/store/history-store"

export function ProfileView() {
  const { t, lang } = useI18n()
  const entries = useHistoryStore((s) => s.entries)
  const citizens = entries.filter((e) => e.winner === "citizens").length
  const stats = [
    { icon: Swords, label: t("gamesPlayed"), value: entries.length, tone: "text-brand-soft" },
    { icon: Trophy, label: t("citizenWinsLabel"), value: citizens, tone: "text-ok" },
    { icon: Eye, label: t("spyWinsLabel"), value: entries.length - citizens, tone: "text-danger" },
  ]
  const locale = lang === "kg" ? "ky" : lang === "ru" ? "ru" : "uz"

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-6xl">{t("profileTitle")}</h1>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {stats.map(({ icon: Icon, label, value, tone }) => (
          <div key={label} className="rounded-[28px] border border-white/10 bg-surface/70 p-5 backdrop-blur-xl">
            <Icon className={cn("size-6", tone)} aria-hidden />
            <div className="mt-4 font-display text-5xl font-extrabold">{value}</div>
            <div className="mt-1 font-mono text-xs uppercase tracking-wider text-muted">{label}</div>
          </div>
        ))}
      </div>

      <h2 className="mt-12 font-display text-2xl font-extrabold">{t("historyTitle")}</h2>
      {entries.length === 0 ? (
        <p className="mt-4 text-muted">{t("noHistory")}</p>
      ) : (
        <ul className="mt-4 space-y-2.5">
          {entries.map((e) => (
            <li key={e.id} className="flex items-center gap-4 rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur">
              <span className={cn("size-3 shrink-0 rounded-full", e.winner === "citizens" ? "bg-ok" : "bg-danger")} />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-bold">{e.word}</span>
                <span className="font-mono text-xs text-muted">
                  {e.category} · {e.players} {t("summaryPlayers")}
                </span>
              </span>
              <span className="shrink-0 font-mono text-xs text-muted">
                {new Date(e.date).toLocaleDateString(locale, { day: "numeric", month: "short" })}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
