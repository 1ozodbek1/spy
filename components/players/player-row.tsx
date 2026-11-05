"use client"

import { motion } from "framer-motion"
import { Trash2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useI18n } from "@/lib/use-i18n"
import { cn } from "@/lib/utils"
import { NAME_MAX, usePlayersStore, type Player, type RenameResult } from "@/store/players-store"

const tones = [
  "bg-violet-500/25 text-violet-200",
  "bg-fuchsia-500/25 text-fuchsia-200",
  "bg-sky-500/25 text-sky-200",
  "bg-emerald-500/25 text-emerald-200",
  "bg-amber-500/25 text-amber-200",
  "bg-rose-500/25 text-rose-200",
]

type Props = { player: Player; canRemove: boolean; focusOnMount: boolean }

export function PlayerRow({ player, canRemove, focusOnMount }: Props) {
  const { t } = useI18n()
  const rename = usePlayersStore((s) => s.renamePlayer)
  const remove = usePlayersStore((s) => s.removePlayer)
  const [draft, setDraft] = useState(player.name)
  const [error, setError] = useState<RenameResult>("ok")
  const [confirming, setConfirming] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (focusOnMount) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [focusOnMount])

  const errorText = error === "empty" ? t("errEmpty") : error === "duplicate" ? t("errDuplicate") : ""
  const errorId = `err-${player.id}`

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ type: "spring", damping: 22, stiffness: 260 }}
      className={cn(
        "rounded-3xl border bg-white/5 p-2.5 backdrop-blur transition-colors",
        error !== "ok" ? "border-danger/60" : confirming ? "border-danger/40" : "border-white/10",
      )}
    >
      <div className="flex items-center gap-3">
        <div
          aria-hidden
          className={cn(
            "grid size-12 shrink-0 place-items-center rounded-full font-display text-lg font-extrabold",
            tones[player.tone % tones.length],
          )}
        >
          {(draft.trim()[0] ?? player.name[0] ?? "?").toUpperCase()}
        </div>

        {confirming ? (
          <>
            <p className="min-w-0 flex-1 text-sm font-bold">
              {t("confirmRemove")} <span className="text-muted">{player.name}</span>
            </p>
            <Button size="sm" variant="danger" onClick={() => remove(player.id)}>
              {t("yes")}
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setConfirming(false)}>
              {t("no")}
            </Button>
          </>
        ) : (
          <>
            <Input
              ref={inputRef}
              value={draft}
              maxLength={NAME_MAX}
              aria-label={t("nameLabel")}
              aria-invalid={error !== "ok"}
              aria-describedby={error !== "ok" ? errorId : undefined}
              className="flex-1 border-transparent bg-transparent font-bold hover:bg-white/5"
              onChange={(e) => {
                setDraft(e.target.value)
                setError(rename(player.id, e.target.value))
              }}
              onBlur={() => {
                if (error !== "ok") {
                  setDraft(player.name)
                  setError("ok")
                } else {
                  const clean = draft.trim()
                  setDraft(clean)
                  rename(player.id, clean)
                }
              }}
              onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
            />
            <Button
              variant="danger"
              size="icon"
              aria-label={`${t("removePlayer")}: ${player.name}`}
              title={canRemove ? t("removePlayer") : t("minNote")}
              disabled={!canRemove}
              onClick={() => setConfirming(true)}
            >
              <Trash2 className="size-5" aria-hidden />
            </Button>
          </>
        )}
      </div>
      {error !== "ok" && (
        <p id={errorId} role="alert" className="px-3 pb-1.5 pt-2 text-sm font-semibold text-danger">
          {errorText}
        </p>
      )}
    </motion.li>
  )
}
