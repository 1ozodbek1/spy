"use client"

import { useI18n } from "@/lib/use-i18n"
import { useOnlineStore } from "@/store/online-store"
import { OnlineLanding } from "./online-landing"
import { OnlineLobby } from "./online-lobby"
import { OnlinePlaying, OnlineReveal, OnlineResults, OnlineVoting } from "./online-game"

export function OnlineView() {
  const { t } = useI18n()
  const status = useOnlineStore((s) => s.status)

  return (
    <div className="px-4 py-8 sm:px-6">
      {(status === "idle" || status === "connecting" || status === "lobby") && (
        <div className="mx-auto mb-8 max-w-md text-center">
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{t("onlineTitle")}</h1>
          <p className="mt-3 text-muted">{t("onlineText")}</p>
        </div>
      )}
      {status === "idle" && <OnlineLanding />}
      {status === "connecting" && (
        <p className="text-center font-mono text-sm font-bold uppercase tracking-widest text-brand-soft" role="status">{t("connecting")}</p>
      )}
      {status === "lobby" && <OnlineLobby />}
      {status === "reveal" && <OnlineReveal />}
      {status === "playing" && <OnlinePlaying />}
      {status === "voting" && <OnlineVoting />}
      {status === "results" && <OnlineResults />}
    </div>
  )
}
