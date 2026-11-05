"use client"

import { motion } from "framer-motion"
import { Check, Eye, EyeOff, Lightbulb, LogOut, RotateCcw, Trophy, Vote } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { TimerRing } from "@/components/game/timer-ring"
import { Button } from "@/components/ui/button"
import { hostNewRound, hostToVoting, leave, sendReady, sendVote } from "@/lib/online/session"
import { beep, vibrate } from "@/lib/sound"
import { useI18n } from "@/lib/use-i18n"
import { cn } from "@/lib/utils"
import { useHistoryStore } from "@/store/history-store"
import { useOnlineStore } from "@/store/online-store"
import { useSettingsStore } from "@/store/settings-store"

function RoleCard({ defaultShown }: { defaultShown: boolean }) {
  const { t } = useI18n()
  const role = useOnlineStore((s) => s.role)
  const sound = useSettingsStore((s) => s.sound)
  const [shown, setShown] = useState(defaultShown)
  if (!role) return null
  const isSpy = role.role === "spy"

  const toggle = () => {
    if (!shown) {
      beep(sound, isSpy ? 220 : 740)
      vibrate(isSpy ? [80, 40, 80] : 40)
    }
    setShown(!shown)
  }

  return (
    <div className={cn("rounded-[32px] border p-6 text-center backdrop-blur-xl", shown ? (isSpy ? "border-danger/60 bg-danger/15" : "border-ok/50 bg-ok/10") : "border-white/10 bg-surface/80")}>
      {shown ? (
        <>
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-muted">{t("yourRole")}</p>
          <h2 className={cn("mt-2 font-display text-4xl font-extrabold", isSpy ? "text-danger" : "text-ok")}>{isSpy ? t("roleSpy") : t("roleCitizen")}</h2>
          <div className="mt-5 rounded-3xl bg-black/30 p-4">
            <div className="font-mono text-xs uppercase tracking-wider text-muted">{t("categoryLabel")}</div>
            <div className="mt-1 text-lg font-bold">{role.categoryName}</div>
            {isSpy ? (
              <>
                <p className="mt-3 text-sm text-muted">{t("spyNote")}</p>
                {role.hint && (
                  <div className="mt-3 rounded-2xl bg-warn/15 p-3">
                    <div className="flex items-center justify-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-warn"><Lightbulb className="size-4" aria-hidden />{t("hintLabel")}</div>
                    <div className="mt-1 font-display text-3xl font-extrabold">{role.hint}</div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="mt-3 font-mono text-xs uppercase tracking-wider text-muted">{t("secretWordLabel")}</div>
                <div className="mt-1 break-words font-display text-4xl font-extrabold">{role.word}</div>
              </>
            )}
          </div>
        </>
      ) : (
        <p className="py-6 font-display text-2xl font-extrabold text-muted">• • •</p>
      )}
      <Button variant="secondary" className="mt-5 w-full" onClick={toggle}>
        {shown ? <EyeOff className="size-5" aria-hidden /> : <Eye className="size-5" aria-hidden />}
        {shown ? t("hideMyRole") : t("showMyRole")}
      </Button>
    </div>
  )
}

export function OnlineReveal() {
  const { t } = useI18n()
  const { ready, readyCount, total } = useOnlineStore()
  return (
    <div className="mx-auto max-w-md space-y-4">
      <RoleCard defaultShown />
      <Button size="lg" className="w-full" disabled={ready} onClick={sendReady}>
        <Check className="size-5" aria-hidden />
        {t("imReady")}
      </Button>
      <p className="text-center font-mono text-sm text-muted" aria-live="polite">{t("readyCount", { a: readyCount, b: total })}</p>
    </div>
  )
}

export function OnlinePlaying() {
  const { t } = useI18n()
  const { left, role, isHost } = useOnlineStore()
  const sound = useSettingsStore((s) => s.sound)
  const prev = useRef(left)

  useEffect(() => {
    if (left <= 10 && left > 0 && left !== prev.current) beep(sound, 520, 80)
    prev.current = left
  }, [left, sound])

  return (
    <div className="mx-auto max-w-md space-y-6 text-center">
      <span className="inline-block rounded-full border border-white/12 bg-white/5 px-5 py-2 font-mono text-sm font-bold uppercase tracking-wider text-brand-soft">
        {t("categoryLabel")}: {role?.categoryName}
      </span>
      <TimerRing left={left} total={role?.seconds ?? 300} label={t("timeLeft")} />
      <RoleCard defaultShown={false} />
      {isHost ? (
        <Button size="lg" className="w-full" onClick={hostToVoting}>
          <Vote className="size-5" aria-hidden />
          {t("toVoting")}
        </Button>
      ) : (
        <p className="rounded-full bg-white/5 px-5 py-3 text-sm text-muted">{t("waitHost")}</p>
      )}
    </div>
  )
}

export function OnlineVoting() {
  const { t } = useI18n()
  const { candidates, meId, voted, votedCount, total } = useOnlineStore()
  const [choice, setChoice] = useState<string | null>(null)

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-center font-display text-3xl font-extrabold leading-tight">{t("voting")}</h1>
      {voted ? (
        <div className="mt-8 rounded-[32px] border border-ok/40 bg-ok/10 p-6 text-center">
          <Check className="mx-auto size-10 text-ok" aria-hidden />
          <p className="mt-3 font-bold">{t("voteSent")}</p>
          <p className="mt-2 font-mono text-sm text-muted" aria-live="polite">{t("votedCount", { a: votedCount, b: total })}</p>
        </div>
      ) : (
        <>
          <ul className="mt-6 space-y-2.5">
            {candidates.filter((p) => p.id !== meId).map((p) => {
              const on = choice === p.id
              return (
                <li key={p.id}>
                  <button type="button" aria-pressed={on} onClick={() => setChoice(p.id)}
                    className={cn("flex min-h-16 w-full items-center justify-between rounded-full border px-6 text-left text-lg font-bold transition", on ? "border-danger bg-danger/15" : "border-white/10 bg-white/5 hover:bg-white/10")}>
                    {p.name}
                    {on && <Check className="size-5 text-danger" aria-hidden />}
                  </button>
                </li>
              )
            })}
          </ul>
          <Button size="lg" className="mt-6 w-full" disabled={!choice} onClick={() => choice && sendVote(choice)}>{t("confirmVote")}</Button>
        </>
      )}
    </div>
  )
}

export function OnlineResults() {
  const { t } = useI18n()
  const { results, isHost } = useOnlineStore()
  const addHistory = useHistoryStore((s) => s.add)
  const saved = useRef(false)

  useEffect(() => {
    if (!results || saved.current) return
    saved.current = true
    addHistory({ winner: results.winner, players: results.players.length, category: results.categoryName, word: results.word })
  }, [results, addHistory])

  if (!results) return null
  const citizensWon = results.winner === "citizens"
  const spies = results.players.filter((p) => results.roles[p.id] === "spy")
  const accused = results.players.find((p) => p.id === results.accusedId)
  const ranked = [...results.players].sort((a, b) => (results.counts[b.id] ?? 0) - (results.counts[a.id] ?? 0))

  return (
    <div className="mx-auto max-w-md text-center">
      <motion.div initial={{ scale: 2.2, rotate: -12, opacity: 0 }} animate={{ scale: 1, rotate: -4, opacity: 1 }} transition={{ type: "spring", damping: 12 }}
        className={cn("inline-flex items-center gap-3 rounded-full border-4 px-7 py-3 font-display text-2xl font-extrabold uppercase", citizensWon ? "border-ok text-ok" : "border-danger text-danger")}>
        <Trophy className="size-7" aria-hidden />
        {citizensWon ? t("citizensWin") : t("spiesWin")}
      </motion.div>

      <div className="mt-8 space-y-1 rounded-[28px] border border-white/10 bg-surface/80 p-5 text-left backdrop-blur-xl">
        <Line label={t("secretWas")} value={results.word} big />
        <Line label={t("categoryLabel")} value={results.categoryName} />
        <Line label={t("spiesWere")} value={spies.map((p) => p.name).join(", ")} danger />
        {results.hint && <p className="flex items-center gap-2 pt-2 text-sm text-warn"><Lightbulb className="size-4" aria-hidden />{t("hintWas")}: <b>{results.hint}</b></p>}
        <Line label={t("accusedLabel")} value={accused ? accused.name : t("nobody")} />
      </div>

      <ul className="mt-3 space-y-2 text-left">
        {ranked.map((p) => (
          <li key={p.id} className="flex items-center justify-between rounded-full bg-white/5 px-5 py-3">
            <span className={cn("font-bold", results.roles[p.id] === "spy" && "text-danger")}>{p.name}</span>
            <span className="font-mono text-sm text-muted">{results.counts[p.id] ?? 0} {t("votesWord")}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col gap-3">
        {isHost ? (
          <Button size="lg" onClick={hostNewRound}><RotateCcw className="size-5" aria-hidden />{t("newRound")}</Button>
        ) : (
          <p className="rounded-full bg-white/5 px-5 py-3 text-sm text-muted">{t("waitHost")}</p>
        )}
        <Button size="lg" variant="secondary" onClick={leave}><LogOut className="size-5" aria-hidden />{t("leaveRoom")}</Button>
      </div>
    </div>
  )
}

function Line({ label, value, big, danger }: { label: string; value: string; big?: boolean; danger?: boolean }) {
  return (
    <div className="py-1.5">
      <div className="font-mono text-xs uppercase tracking-wider text-muted">{label}</div>
      <div className={cn("break-words font-bold", big ? "font-display text-3xl" : "text-lg", danger && "text-danger")}>{value}</div>
    </div>
  )
}
