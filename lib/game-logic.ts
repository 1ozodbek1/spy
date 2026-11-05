import type { Category, Word } from "@/data/categories"
import type { Language } from "@/data/translations"
import type { Player } from "@/store/players-store"

export type Role = "spy" | "citizen"

export const shuffle = <T,>(items: T[]): T[] => {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export const pickOne = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)]

export function assignRoles(players: Player[], spyCount: number): Record<string, Role> {
  const spies = new Set(shuffle(players).slice(0, spyCount).map((p) => p.id))
  return Object.fromEntries(players.map((p) => [p.id, spies.has(p.id) ? "spy" : "citizen"]))
}

export function pickRound(pool: Category[], lang: Language): { category: Category; word: Word } | null {
  const usable = pool.filter((c) => c.words[lang].length > 0)
  if (!usable.length) return null
  const category = pickOne(usable)
  return { category, word: pickOne(category.words[lang]) }
}

export type Outcome = {
  winner: "citizens" | "spies"
  accusedId: string | null
  counts: Record<string, number>
}

export function tally(votes: Record<string, string>, roles: Record<string, Role>): Outcome {
  const counts: Record<string, number> = {}
  for (const target of Object.values(votes)) counts[target] = (counts[target] ?? 0) + 1
  const max = Math.max(0, ...Object.values(counts))
  const top = Object.keys(counts).filter((id) => counts[id] === max)
  const accusedId = top.length === 1 ? top[0] : null
  const winner = accusedId && roles[accusedId] === "spy" ? "citizens" : "spies"
  return { winner, accusedId, counts }
}
