import { create } from "zustand"
import { persist } from "zustand/middleware"

export const MIN_PLAYERS = 3
export const MAX_PLAYERS = 12
export const NAME_MAX = 18

export type Player = { id: string; name: string; tone: number }
export type RenameResult = "ok" | "empty" | "duplicate"

export const maxSpies = (playerCount: number) =>
  Math.max(1, Math.floor((playerCount - 1) / 2))

const starter: Player[] = ["Aziz", "Madina", "Bekzod", "Laylo"].map(
  (name, i) => ({ id: `starter-${i + 1}`, name, tone: i }),
)

const norm = (value: string) => value.trim().toLowerCase()

// crypto.randomUUID faqat HTTPS/localhost da bor; telefonda HTTP orqali sinash uchun zaxira.
const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

type PlayersState = {
  players: Player[]
  spies: number
  addPlayer: (baseName: string) => string | null
  renamePlayer: (id: string, name: string) => RenameResult
  removePlayer: (id: string) => boolean
  setSpies: (value: number) => void
}

export const usePlayersStore = create<PlayersState>()(
  persist(
    (set, get) => ({
      players: starter,
      spies: 1,

      addPlayer: (baseName) => {
        const { players, spies } = get()
        if (players.length >= MAX_PLAYERS) return null
        let n = players.length + 1
        const taken = new Set(players.map((p) => norm(p.name)))
        while (taken.has(norm(`${baseName} ${n}`))) n++
        const player: Player = {
          id: newId(),
          name: `${baseName} ${n}`,
          tone: Math.max(-1, ...players.map((p) => p.tone)) + 1,
        }
        set({ players: [...players, player], spies })
        return player.id
      },

      renamePlayer: (id, name) => {
        const clean = name.trim()
        if (!clean) return "empty"
        const { players } = get()
        if (players.some((p) => p.id !== id && norm(p.name) === norm(clean)))
          return "duplicate"
        set({ players: players.map((p) => (p.id === id ? { ...p, name } : p)) })
        return "ok"
      },

      removePlayer: (id) => {
        const { players, spies } = get()
        if (players.length <= MIN_PLAYERS) return false
        const next = players.filter((p) => p.id !== id)
        set({ players: next, spies: Math.min(spies, maxSpies(next.length)) })
        return true
      },

      setSpies: (value) => {
        const limit = maxSpies(get().players.length)
        set({ spies: Math.min(limit, Math.max(1, value)) })
      },
    }),
    {
      name: "spy-players",
      skipHydration: true,
      partialize: (s) => ({ players: s.players, spies: s.spies }),
    },
  ),
)
