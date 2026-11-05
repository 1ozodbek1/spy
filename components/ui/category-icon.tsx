import {
  Apple, Briefcase, Building2, Bus, Camera, Clapperboard, CloudSun, Coffee, Cpu, Gamepad2, Gem,
  GraduationCap, Globe, Hammer, Home, Landmark, MapPin, Music, Palette, PartyPopper, PawPrint,
  Plane, Rocket, Shirt, ShoppingBag, Siren, Sparkles, Stethoscope, Trees, Trophy, Utensils,
  type LucideIcon,
} from "lucide-react"

const icons: Record<string, LucideIcon> = {
  Apple, Briefcase, Building2, Bus, Camera, Clapperboard, CloudSun, Coffee, Cpu, Gamepad2, Gem,
  GraduationCap, Globe, Hammer, Home, Landmark, MapPin, Music, Palette, PartyPopper, PawPrint,
  Plane, Rocket, Shirt, ShoppingBag, Siren, Sparkles, Stethoscope, Trees, Trophy, Utensils,
}

export function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = icons[name] ?? Sparkles
  return <Icon className={className} aria-hidden />
}
