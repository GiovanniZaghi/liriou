import { AmbientBackground } from '@/components/landing/ambient-background'
import { AnnouncementRibbon } from '@/components/landing/announcement-ribbon'
import { Benefits } from '@/components/landing/benefits'
import { ClosingCta } from '@/components/landing/closing-cta'
import { Faq } from '@/components/landing/faq'
import { Hero } from '@/components/landing/hero'
import { SiteFooter } from '@/components/landing/site-footer'
import { Steps } from '@/components/landing/steps'
import { StickyCta } from '@/components/landing/sticky-cta'
import { WhySatin } from '@/components/landing/why-satin'
import { RevealObserver } from '@/components/ui/reveal-observer'

export default function LandingPage() {
  return (
    <div className="relative min-h-svh overflow-x-clip">
      <AmbientBackground />
      <AnnouncementRibbon />

      <main className="relative mx-auto w-full max-w-[1280px] px-5 pt-7 pb-24 lg:px-10 lg:pt-14">
        <Hero />
        <Benefits />
        <WhySatin />
        <Steps />
        <Faq />
        <ClosingCta />
        <SiteFooter />
      </main>

      <StickyCta />
      <RevealObserver />
    </div>
  )
}
