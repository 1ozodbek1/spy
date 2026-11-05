"use client"

import { motion } from "framer-motion"
import { useI18n } from "@/lib/use-i18n"

const steps = [
  ["how1", "how1d"],
  ["how2", "how2d"],
  ["how3", "how3d"],
] as const

export function HowItWorks() {
  const { t } = useI18n()
  return (
    <section id="how" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:px-6">
      <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-5xl">{t("howTitle")}</h2>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {steps.map(([title, desc], i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-[28px] border p-7 backdrop-blur ${
              i === 2 ? "border-danger/40 bg-danger/8" : "border-white/10 bg-white/5"
            }`}
          >
            <div className={`font-display text-5xl font-extrabold ${i === 2 ? "text-danger" : "text-brand-soft"}`}>
              0{i + 1}
            </div>
            <h3 className="mt-5 font-display text-2xl font-bold">{t(title)}</h3>
            <p className="mt-2 leading-relaxed text-muted">{t(desc)}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
