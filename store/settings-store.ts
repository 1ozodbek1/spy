import { create } from "zustand"
import { persist } from "zustand/middleware"

type SettingsState = {
  selected: string[]
  duration: number
  spyHint: boolean
  sound: boolean
  animations: boolean
  nickname: string
  toggleCategory: (id: string) => void
  setSelected: (ids: string[]) => void
  setDuration: (minutes: number) => void
  set: (patch: Partial<Pick<SettingsState, "spyHint" | "sound" | "animations" | "nickname">>) => void
}

export const DEFAULT_SELECTED = ["travel", "food", "sports", "movies", "animals", "places"]

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      selected: DEFAULT_SELECTED,
      duration: 5,
      spyHint: true,
      sound: true,
      animations: true,
      nickname: "",
      toggleCategory: (id) =>
        set((s) => ({
          selected: s.selected.includes(id) ? s.selected.filter((x) => x !== id) : [...s.selected, id],
        })),
      setSelected: (ids) => set({ selected: ids }),
      setDuration: (m) => set({ duration: Math.min(15, Math.max(1, m)) }),
      set: (patch) => set(patch),
    }),
    { name: "spy-settings", skipHydration: true },
  ),
)
