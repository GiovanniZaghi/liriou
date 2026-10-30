'use client'

import { Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getProduct, products, type Reel } from '@/lib/catalog'
import { formatBRL } from '@/lib/format'
import { PRE_SALE_PATH } from '@/lib/site'
import { CartDrawer } from './cart-drawer'
import { CreatorModal } from './creator-modal'
import { CloseButton, Dialog } from './dialog'
import { ProductModal } from './product-modal'
import { useStore } from './store-provider'

const WELCOME_STORAGE_KEY = 'liriou:welcome-seen'

/** Renderiza o modal aberto no momento (um por vez) e agenda o pop-up de boas-vindas. */
export function StoreDialogs() {
  const { dialog, offerDialog } = useStore()

  // Pop-up da lista VIP: 2s após a primeira visita da sessão
  useEffect(() => {
    try {
      if (sessionStorage.getItem(WELCOME_STORAGE_KEY)) return
      sessionStorage.setItem(WELCOME_STORAGE_KEY, '1')
    } catch {}
    const t = setTimeout(() => offerDialog({ type: 'welcome' }), 2000)
    return () => clearTimeout(t)
  }, [])

  if (!dialog) return null
  switch (dialog.type) {
    case 'cart':
      return <CartDrawer />
    case 'creator':
      return <CreatorModal />
    case 'search':
      return <SearchModal />
    case 'welcome':
      return <WelcomePopup />
    case 'reel':
      return <ReelModal reel={dialog.reel} />
    case 'product': {
      const product = getProduct(dialog.productId)
      return product ? <ProductModal key={product.id} product={product} /> : null
    }
  }
}

function WelcomePopup() {
  const { closeDialog } = useStore()
  return (
    <Dialog label="Ganhe 10% OFF" onClose={closeDialog} panelClassName="max-w-md p-8 text-center">
      <CloseButton onClick={closeDialog} />
      <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-rosa-50 text-grafite">
        <Sparkles className="size-5" aria-hidden />
      </div>
      <span className="eyebrow text-salvia">Exclusivo Líriou</span>
      <h2 className="mt-1 font-serif text-2xl text-grafite">Ganhe 10% OFF na sua primeira compra</h2>
      <p className="mt-2 mb-6 text-xs leading-relaxed text-cinza">
        Cadastre-se na nossa Lista VIP para garantir benefícios exclusivos de pré-lançamento.
      </p>
      <Link
        href={PRE_SALE_PATH}
        onClick={closeDialog}
        className="block w-full rounded-xl bg-salvia py-3.5 text-center text-xs font-medium text-white shadow-md transition-all hover:bg-salvia-900"
      >
        Entrar para a Lista VIP
      </Link>
      <button type="button" onClick={closeDialog} className="mt-4 text-[11px] text-cinza underline hover:text-grafite">
        Continuar navegando na loja
      </button>
    </Dialog>
  )
}

function ReelModal({ reel }: { reel: Reel }) {
  const { closeDialog } = useStore()
  return (
    <Dialog label={reel.title} onClose={closeDialog} panelClassName="max-w-md overflow-hidden bg-black text-white">
      <CloseButton onClick={closeDialog} className="z-20 bg-white/20 text-white hover:bg-white/40" />
      {/* TODO: trocar a capa pelo <video> do reel */}
      <div className="relative flex h-[550px] items-center justify-center bg-grafite">
        <img src={reel.video} alt="" className="size-full object-cover" />
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/90 to-transparent p-6 text-left">
          <span className="rounded-full bg-salvia px-3 py-1 text-xs font-medium">Líriou Reels</span>
          <h2 className="mt-2 font-serif text-2xl">{reel.title}</h2>
          <p className="mt-1 text-xs text-white/70">Demonstração real do ritual com cetim de alta gramatura.</p>
        </div>
      </div>
    </Dialog>
  )
}

function SearchModal() {
  const { closeDialog, openDialog } = useStore()
  const [query, setQuery] = useState('')
  const q = query.trim().toLocaleLowerCase('pt-BR')
  const results = q
    ? products.filter((p) => `${p.name} ${p.colorName}`.toLocaleLowerCase('pt-BR').includes(q))
    : []

  return (
    <Dialog label="Pesquisar produtos" variant="fullscreen" onClose={closeDialog} panelClassName="p-6 sm:p-12">
      <div className="mx-auto max-w-2xl">
        <div className="relative mb-8 flex items-center justify-between">
          <h2 className="font-serif text-xl">O que você está procurando?</h2>
          <CloseButton onClick={closeDialog} className="static" />
        </div>
        <input
          type="search"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Digite o produto, cor ou ritual..."
          aria-label="Buscar"
          className="w-full rounded-2xl border border-borda bg-areia px-6 py-4 text-lg focus:border-salvia focus:outline-none"
        />
        <div className="mt-6 space-y-3" aria-live="polite">
          {q && results.length === 0 && <p className="text-xs text-cinza">Nenhum produto encontrado.</p>}
          {results.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => openDialog({ type: 'product', productId: p.id })}
              className="flex w-full items-center justify-between rounded-2xl bg-algodao p-4 text-left transition-colors hover:bg-borda"
            >
              <span className="text-sm font-medium">{p.name}</span>
              <span className="text-xs font-semibold text-salvia">{formatBRL(p.price)}</span>
            </button>
          ))}
        </div>
      </div>
    </Dialog>
  )
}
