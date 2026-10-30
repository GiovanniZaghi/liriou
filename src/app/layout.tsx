import type { Metadata } from 'next'
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
  title: 'Líriou · Scrunchies de cetim',
  description: 'Acessórios em cetim de alta gramatura que protegem os fios do atrito.',
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
