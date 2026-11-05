"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useGameStore } from "@/store/game-store"
import { PlayingPhase } from "./playing-phase"
import { RandomizingPhase } from "./randomizing-phase"
import { RevealPhase } from "./reveal-phase"
import { ResultsPhase } from "./results-phase"
import { VotingPhase } from "./voting-phase"

export function GameView() {
  const router = useRouter()
  const phase = useGameStore((s) => s.phase)

  // Sahifa yangilansa o‘yin xotiradan o‘chadi (sirli so‘z saqlanmaydi), shuning uchun sozlamalarga qaytamiz.
  useEffect(() => {
    if (phase === "idle") router.replace("/play")
  }, [phase, router])

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      {phase === "randomizing" && <RandomizingPhase />}
      {phase === "reveal" && <RevealPhase />}
      {phase === "playing" && <PlayingPhase />}
      {phase === "voting" && <VotingPhase />}
      {phase === "results" && <ResultsPhase />}
    </div>
  )
}
