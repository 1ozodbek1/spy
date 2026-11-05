"use client"

import { motion } from "framer-motion"
import { useEffect } from "react"
import { useI18n } from "@/lib/use-i18n"
import { useGameStore } from "@/store/game-store"

export function RandomizingPhase() {
  const { t } = useI18n()
  const finish = useGameStore((s) => s.finishRandomizing)

  useEffect(() => {
    const id = setTimeout(finish, 1800)
    return () => clearTimeout(id)
  }, [finish])

  return (
    <div className="flex min-h-[60dvh] flex-col items-center justify-center gap-8 text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        className="size-32 rounded-full border-4 border-brand/30 border-t-brand-soft"
      />
      <p className="font-mono text-sm font-bold uppercase tracking-[.2em] text-brand-soft">{t("randomizing")}</p>
    </div>
  )
}
