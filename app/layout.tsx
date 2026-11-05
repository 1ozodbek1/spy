import type { Metadata, Viewport } from "next"
import { Manrope, Space_Mono, Syne } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { Background } from "@/components/layout/background"
import { SiteHeader } from "@/components/layout/site-header"
import { MobileNav } from "@/components/layout/mobile-nav"
import { SiteFooter } from "@/components/layout/site-footer"

const syne = Syne({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-syne" })
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-space-mono" })
const manrope = Manrope({ subsets: ["latin", "cyrillic"], variable: "--font-manrope" })

export const metadata: Metadata = {
  title: "SPY · Ayg‘oqchi o‘yini",
  description: "Do‘stlar bilan bitta telefonda o‘ynaladigan ayg‘oqchi o‘yini.",
}

export const viewport: Viewport = {
  themeColor: "#0b0a12",
  viewportFit: "cover",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className={`${syne.variable} ${spaceMono.variable} ${manrope.variable}`}>
      <body>
        <Providers>
          <Background />
          <SiteHeader />
          <main className="min-h-dvh pb-8 pt-24">{children}</main>
          <SiteFooter />
          <MobileNav />
        </Providers>
      </body>
    </html>
  )
}
