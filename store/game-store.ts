import { create } from "zustand"
import type { Role, Outcome } from "@/lib/game-logic"
import type { Player } from "@/store/players-store"

export type Phase = "idle" | "randomizing" | "reveal" | "playing" | "voting" | "results"

type StartInput = {
  players: Player[]
  roles: Record<string, Role>
  categoryName: string
  word: string
  hint: string | null
  seconds: number
  firstAsker: number
  randomizing: boolean
}

type GameState = {
  phase: Phase
  players: Player[]
  roles: Record<string, Role>
  categoryName: string
  word: string
  hint: string | null
  seconds: number
  revealIndex: number
  asker: number
  voteIndex: number
  votes: Record<string, string>
  outcome: Outcome | null
  start: (input: StartInput) => void
  finishRandomizing: () => void
  nextReveal: () => void
  nextAsker: () => void
  toVoting: () => void
  castVote: (voterId: string, targetId: string, outcome: (votes: Record<string, string>) => Outcome) => void
  reset: () => void
}

const empty = {
  phase: "idle" as Phase,
  players: [] as Player[],
  roles: {} as Record<string, Role>,
  categoryName: "",
  word: "",
  hint: null as string | null,
  seconds: 300,
  revealIndex: 0,
  asker: 0,
  voteIndex: 0,
  votes: {} as Record<string, string>,
  outcome: null as Outcome | null,
}

// Muhim: bu store saqlanmaydi, shuning uchun sirli so‘z brauzer xotirasiga yozilmaydi.
export const useGameStore = create<GameState>()((set, get) => ({
  ...empty,
  start: (i) =>
    set({
      ...empty,
      players: i.players,
      roles: i.roles,
      categoryName: i.categoryName,
      word: i.word,
      hint: i.hint,
      seconds: i.seconds,
      asker: i.firstAsker,
      phase: i.randomizing ? "randomizing" : "reveal",
    }),
  finishRandomizing: () => set({ phase: "reveal" }),
  nextReveal: () => {
    const { revealIndex, players } = get()
    if (revealIndex + 1 >= players.length) set({ phase: "playing" })
    else set({ revealIndex: revealIndex + 1 })
  },
  nextAsker: () => set((s) => ({ asker: (s.asker + 1) % s.players.length })),
  toVoting: () => set({ phase: "voting", voteIndex: 0, votes: {} }),
  castVote: (voterId, targetId, outcome) => {
    const { votes, voteIndex, players } = get()
    if (votes[voterId]) return
    const next = { ...votes, [voterId]: targetId }
    if (voteIndex + 1 >= players.length) set({ votes: next, outcome: outcome(next), phase: "results" })
    else set({ votes: next, voteIndex: voteIndex + 1 })
  },
  reset: () => set({ ...empty }),
}))
