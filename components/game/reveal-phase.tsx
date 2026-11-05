"use client"

import { AnimatePresence, motion } from "framer-motion"
import { EyeOff, Lightbulb, ScanEye } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/use-i18n"
import { beep, vibrate } from "@/lib/sound"
import { cn } from "@/lib/utils"
import { useGameStore } from "@/store/game-store"
import { useSettingsStore } from "@/store/settings-store"

export function RevealPhase() {
  const { t } = useI18n()
  const { players, roles, revealIndex, word, hint, categoryName, nextReveal } = useGameStore()
  const sound = useSettingsStore((s) => s.sound)
  const [shown, setShown] = useState(false)
  const player = players[revealIndex]
  const isSpy = roles[player.id] === "spy"
  const last = revealIndex + 1 >= players.length

  const reveal = () => {
    setShown(true)
    beep(sound, isSpy ? 220 : 740)
    vibrate(isSpy ? [80, 40, 80] : 40)
  }

  const next = () => {
    setShown(false)
    nextReveal()
  }

  return (
    <div className="flex min-h-[70dvh] flex-col justify-center">
      <div className="mb-6 text-center font-mono text-xs font-bold uppercase tracking-[.2em] text-muted">
        {revealIndex + 1} / {players.length}
      </div>

      <AnimatePresence mode="wait">
        {!shown ? (
          <motion.div
            key="hidden"
            initial={{ opacity: 0, rotateY: -90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: 90 }}
            className="rounded-[36px] border border-white/10 bg-surface/80 p-8 text-center backdrop-blur-xl"
          >
            <p className="font-mono text-sm font-bold uppercase tracking-wider text-muted">{t("passTo")}</p>
            <h1 className="mt-3 break-words font-display text-5xl font-extrabold">{player.name}</h1>
            <Button size="lg" className="mt-8 w-full" onClick={reveal}>
              <ScanEye className="size-5" aria-hidden />
              {t("showRole")}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="shown"
            initial={{ opacity: 0, rotateY: -90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: 90 }}
            className={cn(
              "rounded-[36px] border p-8 text-center backdrop-blur-xl",
              isSpy ? "border-danger/60 bg-danger/15" : "border-ok/50 bg-ok/10",
            )}
          >
            <p className="font-mono text-sm font-bold uppercase tracking-wider text-muted">{t("yourRole")}</p>
            <h1 className={cn("mt-3 font-display text-5xl font-extrabold", isSpy ? "text-danger" : "text-ok")}>
              {isSpy ? t("roleSpy") : t("roleCitizen")}
            </h1>

            <div className="mt-6 rounded-3xl bg-black/30 p-5">
              <div className="font-mono text-xs uppercase tracking-wider text-muted">{t("categoryLabel")}</div>
              <div className="mt-1 text-lg font-bold">{categoryName}</div>
              {isSpy ? (
                <>
                  <p className="mt-4 text-sm leading-relaxed text-muted">{t("spyNote")}</p>
                  {hint && (
                    <div className="mt-4 rounded-2xl bg-warn/15 p-4">
                      <div className="flex items-center justify-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-warn">
                        <Lightbulb className="size-4" aria-hidden />
                        {t("hintLabel")}
                      </div>
                      <div className="mt-1 font-display text-3xl font-extrabold">{hint}</div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="mt-4 font-mono text-xs uppercase tracking-wider text-muted">{t("secretWordLabel")}</div>
                  <div className="mt-1 break-words font-display text-4xl font-extrabold">{word}</div>
                </>
              )}
            </div>

            <Button size="lg" variant="secondary" className="mt-6 w-full" onClick={next}>
              <EyeOff className="size-5" aria-hidden />
              {last ? t("startRound") : t("hideRole")}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
