"use client"

import { MotionConfig } from "framer-motion"
import { useEffect } from "react"
import { useCategoriesStore } from "@/store/categories-store"
import { useHistoryStore } from "@/store/history-store"
import { useLanguageStore } from "@/store/language-store"
import { usePlayersStore } from "@/store/players-store"
import { useSettingsStore } from "@/store/settings-store"

export function Providers({ children }: { children: React.ReactNode }) {
  const lang = useLanguageStore((s) => s.lang)
  const animations = useSettingsStore((s) => s.animations)

  useEffect(() => {
    void useLanguageStore.persist.rehydrate()
    void usePlayersStore.persist.rehydrate()
    void useSettingsStore.persist.rehydrate()
    void useCategoriesStore.persist.rehydrate()
    void useHistoryStore.persist.rehydrate()
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang === "kg" ? "ky" : lang
  }, [lang])

  useEffect(() => {
    document.documentElement.dataset.motion = animations ? "on" : "off"
  }, [animations])

  return <MotionConfig reducedMotion={animations ? "user" : "always"}>{children}</MotionConfig>
}
