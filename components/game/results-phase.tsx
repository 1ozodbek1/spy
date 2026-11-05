"use client"

import { motion } from "framer-motion"
import { Lightbulb, RotateCcw, Trophy } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/use-i18n"
import { useStartGame } from "@/lib/use-start-game"
import { cn } from "@/lib/utils"
import { useGameStore } from "@/store/game-store"
import { useHistoryStore } from "@/store/history-store"

export function ResultsPhase() {
  const { t } = useI18n()
  const router = useRouter()
  const startGame = useStartGame()
  const { players, roles, outcome, word, hint, categoryName, reset } = useGameStore()
  const addHistory = useHistoryStore((s) => s.add)
  const saved = useRef(false)

  useEffect(() => {
    if (!outcome || saved.current) return
    saved.current = true
    addHistory({ winner: outcome.winner, players: players.length, category: categoryName, word })
  }, [outcome, addHistory, players.length, categoryName, word])

  if (!outcome) return null
  const citizensWon = outcome.winner === "citizens"
  const spies = players.filter((p) => roles[p.id] === "spy")
  const accused = players.find((p) => p.id === outcome.accusedId)
  const ranked = [...players].sort((a, b) => (outcome.counts[b.id] ?? 0) - (outcome.counts[a.id] ?? 0))

  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 2.2, rotate: -12, opacity: 0 }}
        animate={{ scale: 1, rotate: -4, opacity: 1 }}
        transition={{ type: "spring", damping: 12 }}
        className={cn(
          "mx-auto inline-flex items-center gap-3 rounded-full border-4 px-7 py-3 font-display text-2xl font-extrabold uppercase sm:text-3xl",
          citizensWon ? "border-ok text-ok" : "border-danger text-danger",
        )}
      >
        <Trophy className="size-7" aria-hidden />
        {citizensWon ? t("citizensWin") : t("spiesWin")}
      </motion.div>

      <div className="mt-8 space-y-3 text-left">
        <div className="rounded-[28px] border border-white/10 bg-surface/80 p-5 backdrop-blur-xl">
          <Row label={t("secretWas")} value={word} big />
          <Row label={t("categoryLabel")} value={categoryName} />
          <Row label={t("spiesWere")} value={spies.map((p) => p.name).join(", ")} danger />
          {hint && (
            <div className="mt-3 flex items-center gap-2 text-sm text-warn">
              <Lightbulb className="size-4" aria-hidden />
              {t("hintWas")}: <b>{hint}</b>
            </div>
          )}
          <Row label={t("accusedLabel")} value={accused ? accused.name : t("nobody")} />
        </div>

        <ul className="space-y-2">
          {ranked.map((p) => (
            <li key={p.id} className="flex items-center justify-between rounded-full bg-white/5 px-5 py-3">
              <span className={cn("font-bold", roles[p.id] === "spy" && "text-danger")}>{p.name}</span>
              <span className="font-mono text-sm text-muted">
                {outcome.counts[p.id] ?? 0} {t("votesWord")}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <Button size="lg" onClick={() => startGame("normal", false)}>
          <RotateCcw className="size-5" aria-hidden />
          {t("playAgain")}
        </Button>
        <Button size="lg" variant="secondary" onClick={() => { reset(); router.push("/play") }}>
          {t("newGame")}
        </Button>
      </div>
    </div>
  )
}

function Row({ label, value, big, danger }: { label: string; value: string; big?: boolean; danger?: boolean }) {
  return (
    <div className="py-2">
      <div className="font-mono text-xs uppercase tracking-wider text-muted">{label}</div>
      <div className={cn("mt-0.5 break-words font-bold", big ? "font-display text-3xl" : "text-lg", danger && "text-danger")}>
        {value}
      </div>
    </div>
  )
}
