import type { Metadata, Viewport } from 'next'
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

export const metadata: Metadata = {
  title: 'Líriou · Lista VIP da pré-venda',
  description:
    'Scrunchies de cetim de alta gramatura que seguram o cabelo sem apertar e com menos marca. Entre para a lista VIP e garanta o kit completo antes de todo mundo.',
  alternates: { canonical: '/pre-venda' },
  openGraph: {
    title: 'Você dorme. O cetim cuida. · Líriou',
    description: 'Lista VIP da pré-venda: preço especial, recebimento antecipado e brinde para as primeiras.',
    url: '/pre-venda',
    locale: 'pt_BR',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#0b2e1f',
}

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
