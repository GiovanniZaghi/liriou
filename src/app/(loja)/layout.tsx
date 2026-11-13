import type { Viewport } from 'next'
import { StoreDialogs } from '@/components/loja/store-dialogs'
import { StoreFooter } from '@/components/loja/store-footer'
import { StoreHeader } from '@/components/loja/store-header'
import { StoreProvider } from '@/components/loja/store-provider'
import { RevealObserver } from '@/components/ui/reveal-observer'
import { getCatalog, getStoreSettings } from '@/lib/api/catalog'
import { lojaClassName } from '@/lib/loja-fonts'

export const viewport: Viewport = {
  themeColor: '#fbf9f7',
}

/** Casca da loja (e-commerce): paleta clara, fontes próprias, sacola e modais. */
export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const [products, settings] = await Promise.all([getCatalog(), getStoreSettings()])

  return (
    <div className={`${lojaClassName} flex min-h-svh flex-col bg-areia`}>
      <StoreProvider products={products} settings={settings}>
        <StoreHeader />
        <main className="flex-1">{children}</main>
        <StoreFooter />
        <StoreDialogs />
      </StoreProvider>
      <RevealObserver />
    </div>
  )
}
