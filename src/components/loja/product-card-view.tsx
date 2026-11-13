import { Check } from 'lucide-react'
import type { CatalogProduct, KitDetails } from '@/lib/api/types'
import { formatBRL } from '@/lib/format'
import { cn } from '@/lib/utils'

export type ProductCardData = Pick<
  CatalogProduct,
  'name' | 'price' | 'colorName' | 'badge' | 'image' | 'hoverImage' | 'inStock'
>

interface ProductCardViewProps {
  product: ProductCardData
  installments: number
  onOpen?: () => void
  onAdd?: () => void
  className?: string
  style?: React.CSSProperties
  'data-reveal'?: boolean
}

/**
 * Visual do card da vitrine, sem dependência da sacola.
 * Usado pela loja (ProductCard) e pela pré-visualização do estoque no dashboard.
 */
export function ProductCardView({ product, installments, onOpen, onAdd, className, ...rest }: ProductCardViewProps) {
  return (
    <article
      {...rest}
      className={cn(
        'group flex flex-col justify-between rounded-3xl border border-borda bg-white p-4 shadow-sm transition-shadow hover:shadow-xl',
        className,
      )}
    >
      <button type="button" onClick={onOpen} className="text-left" aria-label={`Ver detalhes: ${product.name}`}>
        <div className="relative h-80 w-full overflow-hidden rounded-2xl bg-algodao">
          {(product.badge || !product.inStock) && (
            <span className="absolute top-3 left-3 z-10 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-grafite uppercase shadow-sm backdrop-blur-md">
              {product.inStock ? product.badge : 'Esgotado'}
            </span>
          )}
          {product.image && (
            <img
              src={product.image}
              alt=""
              className="absolute inset-0 size-full object-cover transition-opacity duration-500 group-hover:opacity-0"
            />
          )}
          {product.hoverImage && (
            <img
              src={product.hoverImage}
              alt=""
              className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-medium text-grafite transition-colors group-hover:text-salvia">{product.name}</h3>
          {product.colorName && <p className="mt-1 text-xs text-cinza">{product.colorName}</p>}
        </div>
      </button>

      <div className="mt-6 flex items-center justify-between gap-3">
        <div>
          <span className="font-serif text-lg font-medium">{formatBRL(product.price)}</span>
          <p className="text-[10px] text-cinza">
            ou {installments}x de {formatBRL(product.price / installments)}
          </p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          disabled={!product.inStock}
          className="rounded-full bg-algodao px-4 py-2.5 text-xs font-medium text-grafite transition-all hover:bg-salvia hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-algodao disabled:hover:text-grafite"
        >
          {product.inStock ? 'Adicionar' : 'Esgotado'}
        </button>
      </div>
    </article>
  )
}

/** Cores de destaque das etiquetas dos kits, alternadas na ordem da vitrine */
export const KIT_TAG_TONES = ['bg-petala', 'bg-folha/15']

interface KitCardViewProps {
  name: string
  price: number
  kit: KitDetails
  tone?: string
  /** Botão de compra (a loja passa o da sacola; a pré-visualização, um estático) */
  action: React.ReactNode
  style?: React.CSSProperties
  'data-reveal'?: boolean
}

/** Visual do card da seção "Rituais Completos" (kits). */
export function KitCardView({ name, price, kit, tone = KIT_TAG_TONES[0], action, ...rest }: KitCardViewProps) {
  return (
    <article {...rest} className="flex flex-col justify-between rounded-3xl border border-borda bg-white p-8 shadow-sm">
      <div>
        {kit.tag && (
          <span className={`${tone} rounded-full px-3 py-1 text-[10px] font-semibold text-grafite uppercase`}>{kit.tag}</span>
        )}
        <h3 className="mt-4 font-serif text-2xl text-grafite">{name}</h3>
        {kit.contents && <p className="mt-2 text-xs text-cinza">{kit.contents}</p>}
        {kit.perks.length > 0 && (
          <ul className="mt-6 space-y-2 text-xs text-grafite">
            {kit.perks.map((perk) => (
              <li key={perk} className="flex items-center gap-2">
                <Check className="size-3.5 text-salvia" aria-hidden /> {perk}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mt-8 flex items-center justify-between gap-4 border-t border-borda pt-6">
        <div>
          <span className="font-serif text-xl font-medium">{formatBRL(price)}</span>
          {kit.note && <p className="text-[10px] text-cinza">{kit.note}</p>}
        </div>
        {action}
      </div>
    </article>
  )
}
