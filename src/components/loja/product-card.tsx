'use client'

import { formatBRL } from '@/lib/format'
import { INSTALLMENTS, type Product } from '@/lib/catalog'
import { useStore } from './store-provider'

export function ProductCard({ product, index }: { product: Product; index: number }) {
  const { openDialog, addToCart } = useStore()
  const openProduct = () => openDialog({ type: 'product', productId: product.id })

  return (
    <article
      data-reveal
      style={{ '--i': index } as React.CSSProperties}
      className="group flex flex-col justify-between rounded-3xl border border-borda bg-white p-4 shadow-sm transition-shadow hover:shadow-xl"
    >
      <button type="button" onClick={openProduct} className="text-left" aria-label={`Ver detalhes: ${product.name}`}>
        <div className="relative h-80 w-full overflow-hidden rounded-2xl bg-algodao">
          <span className="absolute top-3 left-3 z-10 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-grafite uppercase shadow-sm backdrop-blur-md">
            {product.badge}
          </span>
          <img
            src={product.image}
            alt=""
            className="absolute inset-0 size-full object-cover transition-opacity duration-500 group-hover:opacity-0"
          />
          <img
            src={product.hoverImage}
            alt=""
            className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-medium text-grafite transition-colors group-hover:text-salvia">{product.name}</h3>
          <p className="mt-1 text-xs text-cinza">{product.colorName}</p>
        </div>
      </button>

      <div className="mt-6 flex items-center justify-between gap-3">
        <div>
          <span className="font-serif text-lg font-medium">{formatBRL(product.price)}</span>
          <p className="text-[10px] text-cinza">
            ou {INSTALLMENTS}x de {formatBRL(product.price / INSTALLMENTS)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => addToCart(product.id, { openCart: true })}
          className="rounded-full bg-algodao px-4 py-2.5 text-xs font-medium text-grafite transition-all hover:bg-salvia hover:text-white"
        >
          Adicionar
        </button>
      </div>
    </article>
  )
}
