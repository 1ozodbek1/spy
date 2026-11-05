import { cn } from "@/lib/utils"

const R = 88
const C = 2 * Math.PI * R

export function TimerRing({ left, total, label }: { left: number; total: number; label: string }) {
  const urgent = left <= 10
  const mm = String(Math.floor(left / 60)).padStart(2, "0")
  const ss = String(left % 60).padStart(2, "0")
  return (
    <div className="relative mx-auto grid size-56 place-items-center" role="timer" aria-label={label}>
      <svg viewBox="0 0 200 200" className="absolute inset-0 -rotate-90" aria-hidden>
        <circle cx="100" cy="100" r={R} fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="10" />
        <circle
          cx="100" cy="100" r={R} fill="none" strokeWidth="10" strokeLinecap="round"
          stroke={urgent ? "#fb7185" : "#a78bfa"}
          strokeDasharray={C}
          strokeDashoffset={C * (1 - Math.max(0, left) / Math.max(1, total))}
          style={{ transition: "stroke-dashoffset .3s linear" }}
        />
      </svg>
      <div className="text-center">
        <div className={cn("font-display text-6xl font-extrabold tabular-nums", urgent && "text-danger")}>{mm}:{ss}</div>
        <div className="font-mono text-xs uppercase tracking-wider text-muted">{label}</div>
      </div>
    </div>
  )
}
