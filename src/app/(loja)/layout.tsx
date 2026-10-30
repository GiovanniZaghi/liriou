import type { Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { StoreDialogs } from '@/components/loja/store-dialogs'
import { StoreFooter } from '@/components/loja/store-footer'
import { StoreHeader } from '@/components/loja/store-header'
import { StoreProvider } from '@/components/loja/store-provider'
import { RevealObserver } from '@/components/ui/reveal-observer'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: '#fbf9f7',
}

/** Casca da loja (e-commerce): paleta clara, fontes próprias, sacola e modais. */
export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`loja ${inter.variable} ${playfair.variable} flex min-h-svh flex-col bg-areia`}>
      <StoreProvider>
        <StoreHeader />
        <main className="flex-1">{children}</main>
        <StoreFooter />
        <StoreDialogs />
      </StoreProvider>
      <RevealObserver />
    </div>
  )
}
