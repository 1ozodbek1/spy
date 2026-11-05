"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Modal } from "@/components/ui/modal"
import type { Category, Word } from "@/data/categories"
import { useI18n } from "@/lib/use-i18n"
import { useCategoriesStore } from "@/store/categories-store"
import { useSettingsStore } from "@/store/settings-store"

type Props = { open: boolean; editing: Category | null; onClose: () => void }

const toText = (words: Word[]) => words.map((w) => (w.hint ? `${w.word} - ${w.hint}` : w.word)).join("\n")

const parseWords = (text: string): Word[] => {
  const seen = new Set<string>()
  const out: Word[] = []
  for (const line of text.split("\n")) {
    const [word, ...rest] = line.split(" - ")
    const clean = word.trim()
    if (!clean || seen.has(clean.toLowerCase())) continue
    seen.add(clean.toLowerCase())
    out.push({ word: clean, hint: rest.join(" - ").trim() || undefined })
  }
  return out
}

export function CategoryForm({ open, editing, onClose }: Props) {
  const { t, lang } = useI18n()
  const save = useCategoriesStore((s) => s.save)
  const toggle = useSettingsStore((s) => s.toggleCategory)
  const selected = useSettingsStore((s) => s.selected)
  const [name, setName] = useState("")
  const [text, setText] = useState("")
  const [error, setError] = useState<"errCatName" | "errCatWords" | null>(null)

  useEffect(() => {
    if (!open) return
    setName(editing?.name[lang] ?? "")
    setText(editing ? toText(editing.words[lang]) : "")
    setError(null)
  }, [open, editing, lang])

  const submit = () => {
    const words = parseWords(text)
    if (name.trim().length < 2) return setError("errCatName")
    if (words.length < 3) return setError("errCatWords")
    const id = save({ id: editing?.id, name: name.trim(), words })
    if (!editing && !selected.includes(id)) toggle(id)
    onClose()
  }

  return (
    <Modal open={open} title={editing ? t("editCategory") : t("newCategory")} onClose={onClose}>
      <label className="block text-sm font-bold text-muted" htmlFor="cat-name">{t("catName")}</label>
      <Input id="cat-name" value={name} maxLength={30} onChange={(e) => setName(e.target.value)} className="mt-2" />

      <label className="mt-5 block text-sm font-bold text-muted" htmlFor="cat-words">{t("catWords")}</label>
      <textarea
        id="cat-words"
        value={text}
        rows={8}
        onChange={(e) => setText(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-base outline-none focus:border-brand-soft"
      />
      <p className="mt-2 text-sm text-muted">{t("catWordsHint")}</p>
      {error && <p role="alert" className="mt-3 text-sm font-semibold text-danger">{t(error)}</p>}

      <div className="mt-6 flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={onClose}>{t("cancel")}</Button>
        <Button className="flex-1" onClick={submit}>{t("save")}</Button>
      </div>
    </Modal>
  )
}
