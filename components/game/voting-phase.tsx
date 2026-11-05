"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { tally } from "@/lib/game-logic"
import { useI18n } from "@/lib/use-i18n"
import { cn } from "@/lib/utils"
import { useGameStore } from "@/store/game-store"

export function VotingPhase() {
  const { t } = useI18n()
  const { players, voteIndex, roles, castVote } = useGameStore()
  const [choice, setChoice] = useState<string | null>(null)
  const voter = players[voteIndex]

  const confirm = () => {
    if (!choice) return
    castVote(voter.id, choice, (votes) => tally(votes, roles))
    setChoice(null)
  }

  return (
    <motion.div key={voter.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="text-center font-mono text-xs font-bold uppercase tracking-[.2em] text-muted">
        {t("voting")} · {voteIndex + 1} / {players.length}
      </div>
      <h1 className="mt-4 text-center font-display text-3xl font-extrabold leading-tight sm:text-4xl">
        {t("voteTurn", { name: voter.name })}
      </h1>

      <ul className="mt-8 space-y-2.5">
        {players
          .filter((p) => p.id !== voter.id)
          .map((p) => {
            const on = choice === p.id
            return (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => setChoice(p.id)}
                  aria-pressed={on}
                  className={cn(
                    "flex min-h-16 w-full items-center justify-between rounded-full border px-6 text-left text-lg font-bold transition",
                    on ? "border-danger bg-danger/15" : "border-white/10 bg-white/5 hover:bg-white/10",
                  )}
                >
                  {p.name}
                  {on && <Check className="size-5 text-danger" aria-hidden />}
                </button>
              </li>
            )
          })}
      </ul>

      <Button size="lg" className="mt-6 w-full" disabled={!choice} onClick={confirm}>
        {t("confirmVote")}
      </Button>
    </motion.div>
  )
}
