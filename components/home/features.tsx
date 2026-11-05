"use client"

import { motion } from "framer-motion"
import { Languages, PencilRuler, Smartphone } from "lucide-react"
import { useI18n } from "@/lib/use-i18n"

const items = [
  { icon: Smartphone, title: "f1", desc: "f1d" },
  { icon: Languages, title: "f2", desc: "f2d" },
  { icon: PencilRuler, title: "f3", desc: "f3d" },
] as const

export function Features() {
  const { t } = useI18n()
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="rounded-[36px] border border-white/10 bg-surface/70 p-7 backdrop-blur-xl sm:p-12">
        <h2 className="max-w-xl font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
          {t("featTitle")}
        </h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {items.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="grid size-14 place-items-center rounded-full bg-brand/20 text-brand-soft">
                <Icon className="size-6" aria-hidden />
              </span>
              <h3 className="mt-5 text-lg font-bold">{t(title)}</h3>
              <p className="mt-2 leading-relaxed text-muted">{t(desc)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
