import { create } from "zustand"
import { persist } from "zustand/middleware"

export type HistoryEntry = {
  id: string
  date: string
  winner: "citizens" | "spies"
  players: number
  category: string
  word: string
}

type HistoryState = {
  entries: HistoryEntry[]
  add: (entry: Omit<HistoryEntry, "id" | "date">) => void
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      entries: [],
      add: (entry) =>
        set((s) => ({
          entries: [
            { ...entry, id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, date: new Date().toISOString() },
            ...s.entries,
          ].slice(0, 30),
        })),
    }),
    { name: "spy-history", skipHydration: true },
  ),
)
