import type { KitDetails } from '@/lib/api/types'
import { lojaClassName } from '@/lib/loja-fonts'
import { cn } from '@/lib/utils'
import { KitCardView, ProductCardView, type ProductCardData } from '@/components/loja/product-card-view'
import { btnSmall } from '@/components/loja/styles'

interface VitrinePreviewProps {
  card: ProductCardData
  kit: KitDetails | null
  installments: number
  visible: boolean
}

/** Pré-visualização fiel da loja: mesmos componentes, fontes e paleta da vitrine. */
export function VitrinePreview({ card, kit, installments, visible }: VitrinePreviewProps) {
  return (
    <section aria-label="Pré-visualização na vitrine" className="rounded-[20px] border border-linho bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-noite-900">Como aparece na loja</h2>
        <span
          className={cn(
            'rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
            visible ? 'bg-folha/12 text-folha' : 'bg-linho text-musgo',
          )}
        >
          {visible ? 'Na vitrine' : 'Oculto'}
        </span>
      </div>

      <div className={cn(lojaClassName, 'space-y-4 rounded-2xl bg-areia p-4 transition-opacity', !visible && 'opacity-50 grayscale')}>
        <div className="pointer-events-none">
          <ProductCardView product={card} installments={installments} />
        </div>
        {kit && (
          <div className="pointer-events-none">
            <p className="mb-2 text-[10px] font-semibold tracking-widest text-cinza uppercase">Seção “Rituais Completos”</p>
            <KitCardView
              name={card.name}
              price={card.price}
              kit={kit}
              action={<span className={btnSmall}>{card.inStock ? 'Garantir Kit' : 'Esgotado'}</span>}
            />
          </div>
        )}
      </div>
      {!card.image && <p className="mt-2 text-[12px] text-musgo">Informe a foto principal para ver a imagem.</p>}
    </section>
  )
}
