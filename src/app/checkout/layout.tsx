import { ArrowLeft, Lock } from 'lucide-react'
import type { Metadata, Viewport } from 'next'
import Link from 'next/link'
import { CheckoutDialogs } from '@/components/checkout/checkout-dialogs'
import { StoreProvider } from '@/components/loja/store-provider'
import { Wordmark } from '@/components/loja/wordmark'
import { getCatalog, getStoreSettings } from '@/lib/api/catalog'
import { lojaClassName } from '@/lib/loja-fonts'

export const metadata: Metadata = {
  title: 'Finalizar compra · Líriou',
  robots: { index: false, follow: false },
}

export const viewport: Viewport = { themeColor: '#fbf9f7' }

/** Checkout: casca enxuta (sem menu da loja) para a cliente focar em concluir a compra. */
export default async function CheckoutLayout({ children }: { children: React.ReactNode }) {
  const [products, settings] = await Promise.all([getCatalog(), getStoreSettings()])

  return (
    <div className={`${lojaClassName} flex min-h-svh flex-col bg-areia`}>
      <StoreProvider products={products} settings={settings}>
        <header className="border-b border-borda bg-white">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
            <Link href="/#colecao" className="flex items-center gap-1.5 text-xs font-medium text-cinza hover:text-grafite">
              <ArrowLeft className="size-4" aria-hidden /> <span className="hidden sm:inline">Voltar à loja</span>
            </Link>
            <Wordmark />
            <span className="flex items-center gap-1.5 text-xs font-medium text-salvia">
              <Lock className="size-3.5" aria-hidden /> <span className="hidden sm:inline">Compra segura</span>
            </span>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <CheckoutDialogs />
      </StoreProvider>
    </div>
  )
}
