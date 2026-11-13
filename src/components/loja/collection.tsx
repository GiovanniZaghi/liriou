import type { CatalogProduct } from '@/lib/api/types'
import { KIT_TAG_TONES, KitCardView } from './product-card-view'
import { ProductCard } from './product-card'
import { SectionTitle } from './section-title'
import { btnSmall, sectionPad } from './styles'
import { AddToCartButton } from './triggers'

export function Collection({ products }: { products: CatalogProduct[] }) {
  return (
    <section id="colecao" aria-labelledby="colecao-titulo" className={`mx-auto max-w-7xl scroll-mt-20 ${sectionPad}`}>
      <SectionTitle
        id="colecao-titulo"
        eyebrow="Vitrine Exclusiva"
        title="Essenciais para o seu ritual"
        description="Desenvolvidas com rigor estético, acabamento impecável em alfaiataria e alta gramatura."
      />
      {products.length === 0 ? (
        <p className="rounded-3xl border border-borda bg-white p-10 text-center text-sm text-cinza">
          Nossa vitrine está sendo preparada. Volte em instantes 🤎
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </section>
  )
}

export function Kits({ products }: { products: CatalogProduct[] }) {
  const kits = products.filter((p): p is CatalogProduct & { kit: NonNullable<CatalogProduct['kit']> } => p.kit !== null)
  if (kits.length === 0) return null

  return (
    <section id="kits" aria-labelledby="kits-titulo" className={`scroll-mt-20 border-y border-borda bg-algodao ${sectionPad}`}>
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          id="kits-titulo"
          eyebrow="Combos Exclusivos"
          title="Rituais Completos"
          description="Leve a experiência completa da Líriou com condições especiais de pré-lançamento."
        />
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
          {kits.map((product, i) => (
            <KitCardView
              key={product.id}
              data-reveal
              style={{ '--i': i } as React.CSSProperties}
              name={product.name}
              price={product.price}
              kit={product.kit}
              tone={KIT_TAG_TONES[i % KIT_TAG_TONES.length]}
              action={
                product.inStock ? (
                  <AddToCartButton productId={product.id} className={btnSmall}>
                    Garantir Kit
                  </AddToCartButton>
                ) : (
                  <span className="text-xs font-medium text-cinza">Esgotado</span>
                )
              }
            />
          ))}
        </div>
      </div>
    </section>
  )
}
