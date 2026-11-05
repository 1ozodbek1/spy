"use client"

import { translations, type StringKey } from "@/data/translations"
import { useLanguageStore } from "@/store/language-store"

export function useI18n() {
  const lang = useLanguageStore((s) => s.lang)
  const setLang = useLanguageStore((s) => s.setLang)
  const dict = translations[lang]
  const t = (key: StringKey, vars?: Record<string, string | number>) => {
    let value: string = dict[key]
    if (vars)
      for (const [name, replacement] of Object.entries(vars))
        value = value.replace(`{${name}}`, String(replacement))
    return value
  }
  return { lang, setLang, dict, t }
}
