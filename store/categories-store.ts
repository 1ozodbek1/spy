import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Category, Word } from "@/data/categories"

type CategoriesState = {
  custom: Category[]
  save: (input: { id?: string; name: string; words: Word[] }) => string
  remove: (id: string) => void
}

const makeId = () => `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`

export const useCategoriesStore = create<CategoriesState>()(
  persist(
    (set) => ({
      custom: [],
      save: ({ id, name, words }) => {
        const finalId = id ?? makeId()
        const cat: Category = {
          id: finalId,
          icon: "Sparkles",
          color: "#a78bfa",
          name: { uz: name, ru: name, kg: name },
          words: { uz: words, ru: words, kg: words },
          custom: true,
        }
        set((s) => ({
          custom: s.custom.some((c) => c.id === finalId)
            ? s.custom.map((c) => (c.id === finalId ? cat : c))
            : [...s.custom, cat],
        }))
        return finalId
      },
      remove: (id) => set((s) => ({ custom: s.custom.filter((c) => c.id !== id) })),
    }),
    { name: "spy-categories", skipHydration: true },
  ),
)
