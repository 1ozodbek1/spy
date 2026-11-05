"use client"

import { AnimatePresence } from "framer-motion"
import { Info, UserPlus } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/use-i18n"
import { MAX_PLAYERS, MIN_PLAYERS, usePlayersStore } from "@/store/players-store"
import { PlayerRow } from "./player-row"

export function PlayersPanel() {
  const { t } = useI18n()
  const players = usePlayersStore((s) => s.players)
  const addPlayer = usePlayersStore((s) => s.addPlayer)
  const [freshId, setFreshId] = useState<string | null>(null)

  const atMin = players.length <= MIN_PLAYERS
  const atMax = players.length >= MAX_PLAYERS

  return (
    <section className="rounded-[32px] border border-white/10 bg-surface/70 p-4 backdrop-blur-xl sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3 px-1">
        <h2 className="font-display text-2xl font-extrabold">{t("playersTitle")}</h2>
        <span className="rounded-full bg-white/8 px-4 py-1.5 font-mono text-sm font-bold" aria-live="polite">
          {players.length} / {MAX_PLAYERS}
        </span>
      </div>

      <ul className="space-y-2.5">
        <AnimatePresence initial={false}>
          {players.map((p) => (
            <PlayerRow key={p.id} player={p} canRemove={!atMin} focusOnMount={p.id === freshId} />
          ))}
        </AnimatePresence>
      </ul>

      <Button
        size="lg"
        variant="secondary"
        className="mt-4 w-full border-dashed border-brand-soft/50 text-brand-soft"
        disabled={atMax}
        onClick={() => setFreshId(addPlayer(t("defaultName")))}
      >
        <UserPlus className="size-5" aria-hidden />
        {t("addPlayer")}
      </Button>

      {(atMin || atMax) && (
        <p className="mt-4 flex items-start gap-2.5 rounded-2xl bg-warn/10 px-4 py-3 text-sm leading-snug text-warn">
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
          {atMax ? t("maxNote") : t("minNote")}
        </p>
      )}
    </section>
  )
}
