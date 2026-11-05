import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Language } from "@/data/translations"

type LanguageState = {
  lang: Language
  setLang: (lang: Language) => void
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({ lang: "uz", setLang: (lang) => set({ lang }) }),
    { name: "spy-language", skipHydration: true },
  ),
)
