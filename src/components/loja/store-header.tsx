'use client'

import { Menu, Search, ShoppingBag, Sparkles, WandSparkles, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { formatBRL } from '@/lib/format'
import { FREE_SHIPPING_THRESHOLD } from '@/lib/catalog'
import { PRE_SALE_PATH } from '@/lib/site'
import { WhatsAppIcon } from './brand-icons'
import { useStore } from './store-provider'
import { Wordmark } from './wordmark'

const NAV = [
  { href: '/#home', label: 'Início' },
  { href: '/#manifesto', label: 'Manifesto' },
  { href: '/#colecao', label: 'Vitrine' },
  { href: '/#kits', label: 'Kits High-Ticket' },
  { href: '/#ritual', label: 'O Ritual' },
]

export function StoreHeader() {
  const { openDialog, count } = useStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <div className="flex items-center justify-between gap-4 overflow-hidden bg-grafite px-4 py-2.5 text-xs font-medium tracking-wider text-white">
        <div className="hidden sm:block sm:flex-1" />
        <p className="flex flex-1 items-center justify-center gap-2 text-center">
          <Sparkles className="size-3.5 shrink-0 text-rosa" aria-hidden />
          <span>
            Evento Especial 31/10 | Envio grátis em SP acima de {formatBRL(FREE_SHIPPING_THRESHOLD).replace(',00', '')}
          </span>
        </p>
        <div className="hidden flex-1 justify-end sm:flex">
          <button
            type="button"
            onClick={() => openDialog({ type: 'creator' })}
            className="flex items-center gap-1.5 font-semibold text-rosa hover:underline"
          >
            <WandSparkles className="size-3.5" aria-hidden /> Seja uma Creator Líriou
          </button>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-borda bg-areia/90 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            className="p-2 text-grafite md:hidden"
          >
            {menuOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>

          <div className="flex-1 text-center md:flex-none md:text-left">
            <Wordmark />
          </div>

          <nav aria-label="Principal" className="hidden items-center gap-8 text-sm font-medium tracking-wide md:flex">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="text-grafite transition-colors hover:text-salvia">
                {item.label}
              </Link>
            ))}
            <Link
              href={PRE_SALE_PATH}
              className="flex items-center gap-1.5 font-semibold text-salvia transition-colors hover:text-salvia-900"
            >
              <WhatsAppIcon className="size-4" /> Lista VIP
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => openDialog({ type: 'search' })}
              aria-label="Pesquisar"
              className="rounded-full p-2 text-grafite transition-colors hover:bg-algodao"
            >
              <Search className="size-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => openDialog({ type: 'cart' })}
              aria-label={`Sacola, ${count} ${count === 1 ? 'item' : 'itens'}`}
              className="relative flex items-center gap-2 rounded-full bg-algodao p-3 text-grafite shadow-sm transition-all hover:bg-salvia hover:text-white"
            >
              <ShoppingBag className="size-4" aria-hidden />
              <span className="hidden text-xs font-semibold sm:inline">Sacola</span>
              {count > 0 && (
                <span
                  key={count}
                  className="pop absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-salvia text-[10px] font-bold text-white shadow-md"
                >
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div
            id="menu-mobile"
            className="absolute top-20 left-0 w-full border-b border-borda bg-areia px-6 py-6 shadow-xl md:hidden"
          >
            <nav aria-label="Principal (mobile)" className="flex flex-col gap-4 text-base font-medium">
              {NAV.map((item) => (
                <Link key={item.href} href={item.href} onClick={closeMenu} className="text-grafite">
                  {item.label}
                </Link>
              ))}
              <Link href={PRE_SALE_PATH} onClick={closeMenu} className="flex items-center gap-2 font-semibold text-salvia">
                <WhatsAppIcon className="size-4" /> Lista VIP
              </Link>
              <button
                type="button"
                onClick={() => {
                  closeMenu()
                  openDialog({ type: 'creator' })
                }}
                className="flex items-center gap-2 border-t border-borda pt-4 text-left text-sm font-semibold text-salvia-900"
              >
                <WandSparkles className="size-4 text-rosa" aria-hidden /> Seja uma Creator Líriou
              </button>
            </nav>
          </div>
        )}
      </header>
    </>
  )
}
