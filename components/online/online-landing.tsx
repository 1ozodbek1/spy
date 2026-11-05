"use client"

import { Plus, Wifi } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createRoom, joinRoom } from "@/lib/online/session"
import { useI18n } from "@/lib/use-i18n"
import { useOnlineStore } from "@/store/online-store"
import { useSettingsStore } from "@/store/settings-store"

export function OnlineLanding() {
  const { t } = useI18n()
  const error = useOnlineStore((s) => s.error)
  const nickname = useSettingsStore((s) => s.nickname)
  const set = useSettingsStore((s) => s.set)
  const [code, setCode] = useState("")
  const [needName, setNeedName] = useState(false)

  useEffect(() => {
    const room = new URLSearchParams(location.search).get("room")
    if (room) setCode(room.toUpperCase().slice(0, 6))
  }, [])

  const withName = (action: () => void) => {
    if (!nickname.trim()) return setNeedName(true)
    setNeedName(false)
    action()
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      <div className="rounded-[32px] border border-white/10 bg-surface/70 p-5 backdrop-blur-xl">
        <label htmlFor="nick" className="font-mono text-xs font-bold uppercase tracking-wider text-muted">{t("yourName")}</label>
        <Input id="nick" value={nickname} maxLength={18} aria-invalid={needName} className="mt-2" onChange={(e) => set({ nickname: e.target.value })} />
        {needName && <p role="alert" className="mt-2 text-sm font-semibold text-danger">{t("errEmpty")}</p>}

        <Button size="lg" className="mt-5 w-full" onClick={() => withName(() => void createRoom(nickname))}>
          <Plus className="size-5" aria-hidden />
          {t("createRoom")}
        </Button>
      </div>

      <p className="text-center font-mono text-xs uppercase tracking-widest text-muted">{t("orWord")}</p>

      <div className="rounded-[32px] border border-white/10 bg-surface/70 p-5 backdrop-blur-xl">
        <label htmlFor="code" className="font-mono text-xs font-bold uppercase tracking-wider text-muted">{t("roomCode")}</label>
        <Input
          id="code" value={code} maxLength={6} autoCapitalize="characters" autoComplete="off"
          className="mt-2 text-center font-mono text-2xl font-bold uppercase tracking-[.4em]"
          onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
        />
        <Button size="lg" variant="secondary" className="mt-5 w-full" disabled={code.length !== 6} onClick={() => withName(() => void joinRoom(code, nickname))}>
          <Wifi className="size-5" aria-hidden />
          {t("joinRoom")}
        </Button>
      </div>

      {error && <p role="alert" className="rounded-2xl bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">{t(error)}</p>}
      <p className="px-3 text-center text-sm text-muted">{t("onlineNote")}</p>
    </div>
  )
}
