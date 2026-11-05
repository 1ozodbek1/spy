import { Home, Layers, Settings, Swords, UserRound, Wifi, type LucideIcon } from "lucide-react"
import type { StringKey } from "@/data/translations"

export type NavItem = { href: string; label: StringKey; icon: LucideIcon }

export const navItems: NavItem[] = [
  { href: "/", label: "navHome", icon: Home },
  { href: "/play", label: "navPlay", icon: Swords },
  { href: "/online", label: "navOnline", icon: Wifi },
  { href: "/categories", label: "navCategories", icon: Layers },
  { href: "/profile", label: "navProfile", icon: UserRound },
  { href: "/settings", label: "navSettings", icon: Settings },
]
