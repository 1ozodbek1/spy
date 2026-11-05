import { cn } from "@/lib/utils"

type Props = { checked: boolean; onChange: (v: boolean) => void; label: string }

export function Switch({ checked, onChange, label }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-8 w-14 shrink-0 rounded-full transition-colors",
        checked ? "bg-brand" : "bg-white/15",
      )}
    >
      <span
        className={cn(
          "absolute left-1 top-1 size-6 rounded-full bg-white shadow transition-transform",
          checked && "translate-x-6",
        )}
      />
    </button>
  )
}
