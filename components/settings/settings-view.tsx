"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import type { Language } from "@/data/translations"
import { useI18n } from "@/lib/use-i18n"
import { cn } from "@/lib/utils"
import { useSettingsStore } from "@/store/settings-store"

const langs: { id: Language; label: string }[] = [
  { id: "uz", label: "O‘zbekcha" },
  { id: "ru", label: "Русский" },
  { id: "kg", label: "Кыргызча" },
]

const STORAGE_KEYS = ["spy-language", "spy-players", "spy-settings", "spy-categories", "spy-history"]

export function SettingsView() {
  const { t, lang, setLang } = useI18n()
  const { sound, animations, spyHint, set } = useSettingsStore()
  const [confirming, setConfirming] = useState(false)

  const reset = () => {
    STORAGE_KEYS.forEach((k) => localStorage.removeItem(k))
    location.href = "/"
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-6xl">{t("settingsPageTitle")}</h1>

      <section className="mt-8 rounded-[32px] border border-white/10 bg-surface/70 p-5 backdrop-blur-xl">
        <h2 className="font-bold">{t("language")}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {langs.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => setLang(l.id)}
              aria-pressed={lang === l.id}
              className={cn(
                "min-h-12 rounded-full border px-6 font-bold transition",
                lang === l.id ? "border-brand bg-brand text-white" : "border-white/12 bg-white/5 hover:bg-white/10",
              )}
            >
              {l.label}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-4 divide-y divide-white/10 rounded-[32px] border border-white/10 bg-surface/70 px-5 backdrop-blur-xl">
        {[
          { label: t("sound"), checked: sound, apply: (v: boolean) => set({ sound: v }) },
          { label: t("animations"), checked: animations, apply: (v: boolean) => set({ animations: v }) },
          { label: t("spyHintTitle"), checked: spyHint, apply: (v: boolean) => set({ spyHint: v }) },
        ].map((row) => (
          <div key={row.label} className="flex min-h-16 items-center justify-between gap-4">
            <span className="font-bold">{row.label}</span>
            <Switch checked={row.checked} label={row.label} onChange={row.apply} />
          </div>
        ))}
      </section>

      <section className="mt-4 rounded-[32px] border border-danger/30 bg-danger/5 p-5">
        <h2 className="font-bold text-danger">{t("resetData")}</h2>
        <p className="mt-1 text-sm text-muted">{t("resetHint")}</p>
        {confirming ? (
          <div className="mt-4 flex gap-3">
            <Button variant="danger" onClick={reset}>{t("confirmReset")}</Button>
            <Button variant="secondary" onClick={() => setConfirming(false)}>{t("cancel")}</Button>
          </div>
        ) : (
          <Button variant="danger" className="mt-4" onClick={() => setConfirming(true)}>{t("resetData")}</Button>
        )}
      </section>
    </div>
  )
}
