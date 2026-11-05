"use client"

import { Copy, Crown, Layers, LogOut, Play, UserX } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Stepper } from "@/components/players/summary-card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import type { StringKey } from "@/data/translations"
import { hostStart, kickPlayer, leave, MAX_ONLINE } from "@/lib/online/session"
import { useI18n } from "@/lib/use-i18n"
import { useOnlineStore } from "@/store/online-store"
import { maxSpies } from "@/store/players-store"
import { useSettingsStore } from "@/store/settings-store"

export function OnlineLobby() {
  const { t } = useI18n()
  const { code, isHost, players, meId, spies } = useOnlineStore()
  const { duration, spyHint, setDuration, set, selected } = useSettingsStore()
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<StringKey | null>(null)
  const limit = maxSpies(players.length)
  const activeSpies = Math.min(spies, limit)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${location.origin}/online?room=${code}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* nusxalash mumkin emas */
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      <div className="rounded-[32px] bg-paper p-6 text-center text-ink">
        <div className="font-mono text-xs font-bold uppercase tracking-[.14em] text-[#5a5568]">{t("roomLabel")}</div>
        <div className="mt-2 font-mono text-5xl font-bold tracking-[.25em]">{code}</div>
        <Button variant="secondary" size="sm" className="mt-4 border-ink/20 bg-ink/5 text-ink hover:bg-ink/10" onClick={copy}>
          <Copy className="size-4" aria-hidden />
          {copied ? t("copied") : t("copyLink")}
        </Button>
      </div>

      <section className="rounded-[32px] border border-white/10 bg-surface/70 p-4 backdrop-blur-xl">
        <div className="mb-3 flex items-center justify-between px-2">
          <h2 className="font-display text-xl font-extrabold">{t("playersTitle")}</h2>
          <span className="rounded-full bg-white/8 px-3 py-1 font-mono text-sm font-bold" aria-live="polite">{players.length} / {MAX_ONLINE}</span>
        </div>
        <ul className="space-y-2">
          {players.map((p) => (
            <li key={p.id} className="flex items-center gap-3 rounded-full bg-white/5 py-2 pl-5 pr-2">
              <span className="min-w-0 flex-1 truncate font-bold">
                {p.name}
                {p.id === meId && <span className="ml-2 font-mono text-xs text-brand-soft">{t("youBadge")}</span>}
              </span>
              {p.host && (
                <span className="flex items-center gap-1 rounded-full bg-warn/15 px-3 py-1 font-mono text-xs font-bold text-warn">
                  <Crown className="size-3.5" aria-hidden />{t("hostBadge")}
                </span>
              )}
              {isHost && !p.host && (
                <Button size="icon" variant="danger" aria-label={`${t("kick")}: ${p.name}`} onClick={() => kickPlayer(p.id)}>
                  <UserX className="size-5" aria-hidden />
                </Button>
              )}
            </li>
          ))}
        </ul>
      </section>

      {isHost ? (
        <>
          <section className="space-y-5 rounded-[32px] border border-white/10 bg-surface/70 p-5 backdrop-blur-xl">
            <div>
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-muted">{t("spiesTitle")}</div>
              <Stepper value={activeSpies} min={1} max={limit} onChange={(v) => useOnlineStore.setState({ spies: v })} />
            </div>
            <div>
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-muted">{t("durationLabel")}</div>
              <Stepper value={duration} min={1} max={15} unit={t("minuteShort")} onChange={setDuration} />
            </div>
            <div className="flex items-center gap-4">
              <div className="min-w-0 flex-1">
                <div className="font-bold">{t("spyHintTitle")}</div>
                <p className="mt-1 text-sm leading-snug text-muted">{t("spyHintDesc")}</p>
              </div>
              <Switch checked={spyHint} onChange={(v) => set({ spyHint: v })} label={t("spyHintTitle")} />
            </div>
            <Link href="/categories" className="flex min-h-14 items-center gap-3 rounded-full border border-white/12 bg-white/5 px-5 font-bold transition hover:bg-white/10">
              <Layers className="size-5 text-brand-soft" aria-hidden />
              <span className="flex-1">{t("chooseCategories")}</span>
              <span className="rounded-full bg-brand/25 px-3 py-1 font-mono text-xs text-brand-soft">{selected.length}</span>
            </Link>
          </section>

          {error && <p role="alert" className="rounded-2xl bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">{t(error)}</p>}
          <Button size="lg" className="w-full" disabled={players.length < 3} onClick={() => setError(hostStart(activeSpies))}>
            <Play className="size-5" aria-hidden />
            {t("startOnline")}
          </Button>
          {players.length < 3 && <p className="text-center text-sm text-warn">{t("needThree")}</p>}
        </>
      ) : (
        <p className="rounded-full bg-white/5 px-5 py-4 text-center text-muted">{t("waitHost")}</p>
      )}

      <Button variant="ghost" className="w-full" onClick={leave}>
        <LogOut className="size-5" aria-hidden />
        {t("leaveRoom")}
      </Button>
    </div>
  )
}
