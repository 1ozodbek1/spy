import { Faq } from "@/components/home/faq"
import { Features } from "@/components/home/features"
import { Hero } from "@/components/home/hero"
import { HowItWorks } from "@/components/home/how-it-works"
import { Marquee } from "@/components/home/marquee"

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <HowItWorks />
      <Features />
      <Faq />
    </>
  )
}
