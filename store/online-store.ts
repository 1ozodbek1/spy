import { create } from "zustand"
import type { StringKey } from "@/data/translations"
import type { Role } from "@/lib/game-logic"

export type OnlinePlayer = { id: string; name: string; host?: boolean }

export type OnlineResults = {
  winner: "citizens" | "spies"
  accusedId: string | null
  counts: Record<string, number>
  roles: Record<string, Role>
  players: { id: string; name: string }[]
  word: string
  hint: string | null
  categoryName: string
}

export type OnlineRole = {
  role: Role
  categoryName: string
  word: string | null
  hint: string | null
  seconds: number
}

export type OnlineStatus = "idle" | "connecting" | "lobby" | "reveal" | "playing" | "voting" | "results"

export type OnlineState = {
  status: OnlineStatus
  error: StringKey | null
  code: string
  isHost: boolean
  meId: string
  players: OnlinePlayer[]
  spies: number
  role: OnlineRole | null
  ready: boolean
  readyCount: number
  total: number
  left: number
  candidates: OnlinePlayer[]
  voted: boolean
  votedCount: number
  results: OnlineResults | null
}

export const freshOnline: OnlineState = {
  status: "idle",
  error: null,
  code: "",
  isHost: false,
  meId: "",
  players: [],
  spies: 1,
  role: null,
  ready: false,
  readyCount: 0,
  total: 0,
  left: 0,
  candidates: [],
  voted: false,
  votedCount: 0,
  results: null,
}

// Saqlanmaydi: rollar va so‘z faqat xotirada turadi.
export const useOnlineStore = create<OnlineState>()(() => ({ ...freshOnline }))
