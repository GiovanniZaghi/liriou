'use client'

import { Check } from 'lucide-react'
import { useState } from 'react'
import { formatBRL } from '@/lib/format'
import type { Product } from '@/lib/catalog'
import { cn } from '@/lib/utils'
import { CloseButton, Dialog } from './dialog'
import { useStore } from './store-provider'
import { btnPrimary } from './styles'

export function ProductModal({ product }: { product: Product }) {
  const { closeDialog, addToCart } = useStore()
  const images = [product.image, ...product.gallery]
  const [active, setActive] = useState(images[0])

  return (
    <Dialog label={product.name} onClose={closeDialog} panelClassName="max-w-4xl overflow-hidden">
      <CloseButton onClick={closeDialog} />
      <div className="grid grid-cols-1 items-start gap-8 p-6 sm:p-10 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="h-[400px] w-full overflow-hidden rounded-2xl border border-borda bg-algodao sm:h-[480px]">
            <img src={active} alt={product.name} className="size-full object-cover" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {images.map((img, i) => (
              <button
                key={img}
                type="button"
                onClick={() => setActive(img)}
                aria-label={`Ver imagem ${i + 1}`}
                aria-pressed={active === img}
                className={cn(
                  'h-24 overflow-hidden rounded-xl border bg-algodao transition-opacity hover:opacity-80',
                  active === img ? 'border-salvia' : 'border-borda',
                )}
              >
                <img src={img} alt="" className="size-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <span className="eyebrow text-salvia">{product.badge}</span>
            <h2 className="mt-1 font-serif text-3xl text-grafite">{product.name}</h2>
            <p className="mt-2 font-serif text-2xl text-salvia">{formatBRL(product.price)}</p>
          </div>
          <p className="text-xs leading-relaxed text-cinza">{product.description}</p>
          <div className="space-y-3 border-t border-borda pt-4">
            <p className="text-xs font-semibold tracking-wider text-grafite uppercase">
              Curadoria: <span className="font-normal text-cinza normal-case">{product.colorName}</span>
            </p>
            <div className="size-8 rounded-full border-2 border-grafite shadow-sm" style={{ backgroundColor: product.colorHex }} />
          </div>
          <ul className="space-y-2 border-t border-borda pt-4 text-xs text-cinza">
            <li className="flex items-center gap-2">
              <Check className="size-3.5 text-salvia" aria-hidden /> Cetim de alta gramatura anti-frizz
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-3.5 text-salvia" aria-hidden /> Embalagem presenteável exclusiva Líriou
            </li>
          </ul>
          <button type="button" onClick={() => addToCart(product.id, { openCart: true })} className={`${btnPrimary} w-full`}>
            Adicionar à Sacola
          </button>
        </div>
      </div>
    </Dialog>
  )
}
