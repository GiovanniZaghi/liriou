import type { Metadata } from 'next'
import { Collection, Kits } from '@/components/loja/collection'
import { StoreHero } from '@/components/loja/hero'
import { Manifesto, TrustBar } from '@/components/loja/manifesto'
import { Reels, Testimonials } from '@/components/loja/reels'

export const metadata: Metadata = {
  title: 'Líriou | Alta performance em cetim & quiet luxury',
  description:
    'Scrunchies e toucas em cetim de alta gramatura com acabamento de alfaiataria. Zero frizz, menos atrito e a estética do luxo silencioso.',
  openGraph: {
    title: 'Menos pressa, mais cetim. · Líriou',
    description: 'Acessórios em cetim de alta gramatura que blindam os fios contra o atrito.',
    url: '/',
    locale: 'pt_BR',
    type: 'website',
  },
}

export default function StorePage() {
  return (
    <>
      <StoreHero />
      <Manifesto />
      <TrustBar />
      <Collection />
      <Kits />
      <Reels />
      <Testimonials />
    </>
  )
}
