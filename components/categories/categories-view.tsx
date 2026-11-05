"use client"

import { motion } from "framer-motion"
import { Check, Dices, Pencil, Plus, Search, Trash2 } from "lucide-react"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { CategoryIcon } from "@/components/ui/category-icon"
import { Input } from "@/components/ui/input"
import type { Category } from "@/data/categories"
import { pickOne } from "@/lib/game-logic"
import { useAllCategories } from "@/lib/use-categories"
import { useI18n } from "@/lib/use-i18n"
import { cn } from "@/lib/utils"
import { useCategoriesStore } from "@/store/categories-store"
import { useSettingsStore } from "@/store/settings-store"
import { CategoryForm } from "./category-form"

export function CategoriesView() {
  const { t, lang } = useI18n()
  const all = useAllCategories()
  const selected = useSettingsStore((s) => s.selected)
  const toggle = useSettingsStore((s) => s.toggleCategory)
  const setSelected = useSettingsStore((s) => s.setSelected)
  const removeCustom = useCategoriesStore((s) => s.remove)
  const [query, setQuery] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return all.filter((c) => !q || c.name[lang].toLowerCase().includes(q))
  }, [all, query, lang])

  const validSelected = selected.filter((id) => all.some((c) => c.id === id))

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-6xl">{t("catTitle")}</h1>
      <p className="mt-4 max-w-xl text-lg text-muted">{t("catText")}</p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" aria-hidden />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("search")} aria-label={t("search")} className="rounded-full pl-12" />
        </div>
        <Button variant="secondary" onClick={() => setSelected(all.map((c) => c.id))}>{t("selectAll")}</Button>
        <Button variant="secondary" onClick={() => setSelected([])}>{t("clearAll")}</Button>
        <Button variant="secondary" onClick={() => setSelected([pickOne(all).id])}>
          <Dices className="size-5" aria-hidden />
          {t("randomOne")}
        </Button>
        <Button onClick={() => { setEditing(null); setFormOpen(true) }}>
          <Plus className="size-5" aria-hidden />
          {t("newCategory")}
        </Button>
      </div>

      <p className="mt-5 font-mono text-sm font-bold text-brand-soft" aria-live="polite">
        {t("categoriesSelected", { n: validSelected.length })}
      </p>

      {list.length === 0 && <p className="mt-10 text-center text-muted">{t("noResults")}</p>}

      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((c, i) => {
          const on = selected.includes(c.id)
          return (
            <motion.li
              key={c.id}
              layout
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i, 8) * 0.03 }}
              className={cn(
                "relative rounded-[28px] border p-4 backdrop-blur transition-colors",
                on ? "border-brand-soft/70 bg-brand/15" : "border-white/10 bg-white/5",
              )}
            >
              <button
                type="button"
                onClick={() => toggle(c.id)}
                aria-pressed={on}
                className="flex w-full items-center gap-4 rounded-2xl text-left"
              >
                <span className="grid size-14 shrink-0 place-items-center rounded-full" style={{ background: `${c.color}33`, color: c.color }}>
                  <CategoryIcon name={c.icon} className="size-7" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-lg font-bold">{c.name[lang]}</span>
                  <span className="font-mono text-xs text-muted">
                    {c.words[lang].length} {t("wordsCount")}
                    {c.custom && <span className="ml-2 rounded-full bg-brand/30 px-2 py-0.5 text-brand-soft">{t("mine")}</span>}
                  </span>
                </span>
                <span className={cn("grid size-8 shrink-0 place-items-center rounded-full border", on ? "border-brand bg-brand text-white" : "border-white/20")}>
                  {on && <Check className="size-4" aria-hidden />}
                </span>
              </button>

              {c.custom && (
                <div className="mt-3 flex items-center justify-end gap-2 border-t border-white/10 pt-3">
                  {deleting === c.id ? (
                    <>
                      <span className="mr-auto text-sm font-bold">{t("deleteCatConfirm")}</span>
                      <Button size="sm" variant="danger" onClick={() => { removeCustom(c.id); setDeleting(null) }}>{t("yes")}</Button>
                      <Button size="sm" variant="secondary" onClick={() => setDeleting(null)}>{t("no")}</Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="secondary" onClick={() => { setEditing(c); setFormOpen(true) }}>
                        <Pencil className="size-4" aria-hidden />{t("editCategory")}
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => setDeleting(c.id)}>
                        <Trash2 className="size-4" aria-hidden />{t("deleteCategory")}
                      </Button>
                    </>
                  )}
                </div>
              )}
            </motion.li>
          )
        })}
      </ul>

      <CategoryForm open={formOpen} editing={editing} onClose={() => setFormOpen(false)} />
    </div>
  )
}
