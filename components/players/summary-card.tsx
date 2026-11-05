"use client"

import Link from "next/link"
import { Dices, Eye, Layers, Minus, Play, Plus } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import type { StringKey } from "@/data/translations"
import { useAllCategories } from "@/lib/use-categories"
import { useI18n } from "@/lib/use-i18n"
import { useStartGame } from "@/lib/use-start-game"
import { maxSpies, usePlayersStore } from "@/store/players-store"
import { useSettingsStore } from "@/store/settings-store"

export function SummaryCard() {
  const { t } = useI18n()
  const startGame = useStartGame()
  const all = useAllCategories()
  const count = usePlayersStore((s) => s.players.length)
  const spies = usePlayersStore((s) => s.spies)
  const setSpies = usePlayersStore((s) => s.setSpies)
  const { selected, duration, spyHint, setDuration, set } = useSettingsStore()
  const [error, setError] = useState<StringKey | null>(null)
  const limit = maxSpies(count)
  const chosen = selected.filter((id) => all.some((c) => c.id === id)).length

  const go = (mode: "normal" | "random") => setError(startGame(mode))

  return (
    <aside className="space-y-4 lg:sticky lg:top-24">
      <div className="rounded-[32px] bg-paper p-6 text-ink">
        <div className="font-mono text-xs font-bold uppercase tracking-[.12em] text-[#5a5568]">
          {t("caseTitle")} · №0427
        </div>
        <div className="mt-3 flex items-end gap-3">
          <span className="font-display text-7xl font-extrabold leading-none">{count}</span>
          <span className="pb-2 font-mono text-sm font-bold uppercase">{t("summaryPlayers")}</span>
        </div>

        <div className="mt-6 rounded-3xl bg-ink p-4 text-paper">
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider">
            <Eye className="size-4 text-danger" aria-hidden />
            {t("spiesTitle")}
          </div>
          <Stepper value={spies} min={1} max={limit} onChange={setSpies} />
          <p className="mt-2 text-center text-sm text-paper/70">{t("spiesHint", { max: limit })}</p>
        </div>
      </div>

      <div className="space-y-5 rounded-[32px] border border-white/10 bg-surface/70 p-5 backdrop-blur-xl">
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

        <Link
          href="/categories"
          className="flex min-h-14 items-center gap-3 rounded-full border border-white/12 bg-white/5 px-5 font-bold transition hover:bg-white/10"
        >
          <Layers className="size-5 text-brand-soft" aria-hidden />
          <span className="flex-1">{t("chooseCategories")}</span>
          <span className="rounded-full bg-brand/25 px-3 py-1 font-mono text-xs text-brand-soft">{chosen}</span>
        </Link>
      </div>

      {error && <p role="alert" className="rounded-2xl bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">{t(error)}</p>}

      <Button size="lg" className="w-full" onClick={() => go("normal")}>
        <Play className="size-5" aria-hidden />
        {t("ctaStart")}
      </Button>
      <Button size="lg" variant="secondary" className="w-full" onClick={() => go("random")}>
        <Dices className="size-5" aria-hidden />
        {t("randomGame")}
      </Button>
    </aside>
  )
}

type StepperProps = { value: number; min: number; max: number; unit?: string; onChange: (v: number) => void }

export function Stepper({ value, min, max, unit, onChange }: StepperProps) {
  return (
    <div className="mt-3 flex items-center justify-between">
      <Button size="icon" variant="secondary" aria-label="−" disabled={value <= min} onClick={() => onChange(value - 1)}>
        <Minus className="size-5" aria-hidden />
      </Button>
      <span className="font-display text-4xl font-extrabold" aria-live="polite">
        {value}
        {unit && <span className="ml-1.5 font-mono text-sm font-bold opacity-60">{unit}</span>}
      </span>
      <Button size="icon" variant="secondary" aria-label="+" disabled={value >= max} onClick={() => onChange(value + 1)}>
        <Plus className="size-5" aria-hidden />
      </Button>
    </div>
  )
}
