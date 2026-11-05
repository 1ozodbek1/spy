"use client"

import { useRouter } from "next/navigation"
import { useAllCategories } from "@/lib/use-categories"
import { useI18n } from "@/lib/use-i18n"
import { assignRoles, pickOne, pickRound } from "@/lib/game-logic"
import { useGameStore } from "@/store/game-store"
import { usePlayersStore } from "@/store/players-store"
import { useSettingsStore } from "@/store/settings-store"
import type { StringKey } from "@/data/translations"

export function useStartGame() {
  const router = useRouter()
  const { lang } = useI18n()
  const all = useAllCategories()
  const start = useGameStore((s) => s.start)

  return (mode: "normal" | "random", navigate = true): StringKey | null => {
    const { players, spies } = usePlayersStore.getState()
    const { selected, duration, spyHint } = useSettingsStore.getState()

    const pool = mode === "random" ? all : all.filter((c) => selected.includes(c.id))
    if (!pool.length) return "errNoCategory"
    const round = pickRound(pool, lang)
    if (!round) return "errNoWords"

    start({
      players,
      roles: assignRoles(players, spies),
      categoryName: round.category.name[lang],
      word: round.word.word,
      hint: spyHint ? (round.word.hint ?? null) : null,
      seconds: duration * 60,
      firstAsker: players.indexOf(pickOne(players)),
      randomizing: mode === "random",
    })
    if (navigate) router.push("/play/game")
    return null
  }
}
