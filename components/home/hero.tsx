"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Dices, Wifi } from "lucide-react"
import { useState } from "react"
import type { StringKey } from "@/data/translations"
import { useStartGame } from "@/lib/use-start-game"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/use-i18n"

const bars = [3, 6, 2, 4, 8, 2, 5, 3, 7, 2, 4, 6, 3, 8, 2, 5]

export function Hero() {
  const { t } = useI18n()
  const startGame = useStartGame()
  const [error, setError] = useState<StringKey | null>(null)

  return (
    <section className="mx-auto flex min-h-[calc(100dvh-6rem)] max-w-6xl flex-wrap items-center gap-12 px-4 py-10 sm:px-6">
      <div className="min-w-0 flex-[1_1_520px]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-danger/30 bg-danger/10 px-4 py-2 font-mono text-xs font-bold uppercase tracking-[.14em] text-danger"
        >
          <span className="size-2 animate-pulse rounded-full bg-danger" />
          {t("heroEyebrow")}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display text-[clamp(2.75rem,7vw,5.75rem)] font-extrabold uppercase leading-[.95] tracking-[-.04em]"
        >
          {t("heroA")} <span className="text-danger">{t("heroB")}</span>
          {t("heroC")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mt-7 max-w-xl text-lg leading-relaxed text-muted"
        >
          {t("heroText")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-9 flex flex-wrap gap-3"
        >
          <Button asChild size="lg">
            <Link href="/play">
              {t("ctaStart")}
              <ArrowRight className="size-5" aria-hidden />
            </Link>
          </Button>
          <Button size="lg" variant="secondary" onClick={() => setError(startGame("random"))}>
            <Dices className="size-5" aria-hidden />
            {t("randomGame")}
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/online">
              <Wifi className="size-5" aria-hidden />
              {t("navOnline")}
            </Link>
          </Button>
          {error && <p role="alert" className="w-full text-sm font-semibold text-danger">{t(error)}</p>}
        </motion.div>

        <ul className="mt-10 flex flex-wrap gap-2.5 font-mono text-xs uppercase tracking-wider text-muted">
          {(["statPlayers", "statCategories", "statPhone"] as const).map((k) => (
            <li key={k} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">
              {t(k)}
            </li>
          ))}
        </ul>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotate: 6 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ delay: 0.3, type: "spring", damping: 16 }}
        className="flex flex-[1_1_340px] justify-center p-4"
      >
        <div className="bob relative w-[340px] max-w-full rounded-[28px] bg-paper p-6 text-ink shadow-[0_30px_80px_-20px_rgba(124,58,237,.6)]">
          <div className="flex items-center justify-between font-mono text-xs font-bold tracking-[.1em] text-[#5a5568] uppercase">
            <span>{t("caseTitle")}</span>
            <span>№0427</span>
          </div>
          <div className="absolute right-5 top-16 rotate-12 rounded-xl border-[3px] border-[#c81e3a] px-3 py-1 font-mono text-xl font-bold uppercase tracking-[.12em] text-[#c81e3a]">
            {t("caseStamp")}
          </div>
          <div className="mt-5 grid size-28 place-items-center rounded-3xl bg-ink font-display text-6xl font-extrabold text-paper">
            ?
          </div>
          {(
            [
              ["casePlayer", "w-3/4"],
              ["caseRole", "w-1/2"],
              ["casePlace", "w-5/6"],
            ] as const
          ).map(([k, w]) => (
            <div key={k} className="mt-5">
              <div className="font-mono text-[11px] font-bold tracking-[.1em] text-[#5a5568] uppercase">
                {t(k)}
              </div>
              <div className={`mt-1.5 h-6 rounded-full bg-ink ${w}`} />
            </div>
          ))}
          <div className="mt-7 flex h-11 items-end gap-[3px]" aria-hidden>
            {bars.map((b, i) => (
              <span key={i} className="h-full rounded-full bg-ink" style={{ width: b }} />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
