'use client'

import type { CatalogProduct } from '@/lib/api/types'
import { ProductCardView } from './product-card-view'
import { useStore } from './store-provider'

/** Card da vitrine ligado à sacola e ao modal de produto. */
export function ProductCard({ product, index }: { product: CatalogProduct; index: number }) {
  const { openDialog, addToCart, settings } = useStore()

  return (
    <ProductCardView
      data-reveal
      style={{ '--i': index } as React.CSSProperties}
      product={product}
      installments={settings.installments}
      onOpen={() => openDialog({ type: 'product', productId: product.id })}
      onAdd={() => addToCart(product.id, { openCart: true })}
    />
  )
}
