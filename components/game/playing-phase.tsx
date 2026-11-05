"use client"

import { MessageCircleQuestion, Vote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/use-i18n"
import { beep, vibrate } from "@/lib/sound"
import { useCountdown } from "@/lib/use-countdown"
import { cn } from "@/lib/utils"
import { useGameStore } from "@/store/game-store"
import { useSettingsStore } from "@/store/settings-store"

const R = 88
const C = 2 * Math.PI * R

export function PlayingPhase() {
  const { t } = useI18n()
  const { players, asker, seconds, categoryName, nextAsker, toVoting } = useGameStore()
  const sound = useSettingsStore((s) => s.sound)

  const left = useCountdown(seconds, () => {
    beep(sound, 330, 400)
    vibrate([200, 80, 200])
    toVoting()
  })

  const urgent = left <= 10
  const mm = String(Math.floor(left / 60)).padStart(2, "0")
  const ss = String(left % 60).padStart(2, "0")
  const target = players[(asker + 1) % players.length]

  return (
    <div className="flex flex-col items-center gap-8 pt-4 text-center">
      <span className="rounded-full border border-white/12 bg-white/5 px-5 py-2 font-mono text-sm font-bold uppercase tracking-wider text-brand-soft">
        {t("categoryLabel")}: {categoryName}
      </span>

      <div className="relative grid size-56 place-items-center" role="timer" aria-label={t("timeLeft")}>
        <svg viewBox="0 0 200 200" className="absolute inset-0 -rotate-90" aria-hidden>
          <circle cx="100" cy="100" r={R} fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="10" />
          <circle
            cx="100" cy="100" r={R} fill="none" strokeWidth="10" strokeLinecap="round"
            stroke={urgent ? "#fb7185" : "#a78bfa"}
            strokeDasharray={C}
            strokeDashoffset={C * (1 - left / seconds)}
            style={{ transition: "stroke-dashoffset .3s linear" }}
          />
        </svg>
        <div>
          <div className={cn("font-display text-6xl font-extrabold tabular-nums", urgent && "text-danger")}>
            {mm}:{ss}
          </div>
          <div className="font-mono text-xs uppercase tracking-wider text-muted">{t("timeLeft")}</div>
        </div>
      </div>

      <div className="w-full rounded-[32px] border border-white/10 bg-surface/80 p-6 backdrop-blur-xl">
        <div className="flex items-center justify-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-muted">
          <MessageCircleQuestion className="size-4" aria-hidden />
          {t("askNow")}
        </div>
        <div className="mt-3 font-display text-3xl font-extrabold">
          {players[asker].name} <span className="text-brand-soft">→</span> {target.name}
        </div>
        <Button variant="secondary" className="mt-5 w-full" onClick={nextAsker}>
          {t("nextAsker")}
        </Button>
      </div>

      <Button size="lg" className="w-full" onClick={toVoting}>
        <Vote className="size-5" aria-hidden />
        {t("toVoting")}
      </Button>
    </div>
  )
}
