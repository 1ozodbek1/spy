import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-12 w-full min-w-0 rounded-2xl border border-white/10 bg-white/5 px-4 text-base text-white outline-none transition placeholder:text-white/30 focus:border-brand-soft focus:bg-white/8 aria-invalid:border-danger",
        className,
      )}
      {...props}
    />
  )
}

export { Input }
