import type { Metadata, Viewport } from 'next'
import { Instrument_Sans, Instrument_Serif } from 'next/font/google'
import { Toaster } from 'sonner'
import { MOTION_STORAGE_KEY, site } from '@/lib/site'
import './globals.css'

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument-sans',
  display: 'swap',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: 'Líriou · Lista VIP da pré-venda',
  description:
    'Scrunchies de cetim de alta gramatura que seguram o cabelo sem apertar e com menos marca. Entre para a lista VIP e garanta o kit completo antes de todo mundo.',
  openGraph: {
    title: 'Você dorme. O cetim cuida. · Líriou',
    description: 'Lista VIP da pré-venda: preço especial, recebimento antecipado e brinde para as primeiras.',
    locale: 'pt_BR',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#0b2e1f',
}

// Aplica "js" e a preferência de pausa antes da primeira pintura
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{if(localStorage.getItem('${MOTION_STORAGE_KEY}')==='paused')d.dataset.motion='paused'}catch(e){}})()`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${instrumentSans.variable} ${instrumentSerif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
