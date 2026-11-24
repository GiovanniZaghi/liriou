import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { CatalogProduct } from '@/lib/api/types'
import { KIT_TAG_TONES, KitCardView } from './product-card-view'
import { ProductCard } from './product-card'
import { SectionTitle } from './section-title'
import { btnOutline, btnSmall, sectionPad } from './styles'
import { AddToCartButton } from './triggers'

/** Destaques na home: os primeiros da ordem do dashboard. A coleção inteira fica em /vitrine. */
const HOME_HIGHLIGHTS = 8

export function Collection({ products }: { products: CatalogProduct[] }) {
  // Esgotados não ocupam vaga de destaque (se houver disponíveis suficientes)
  const highlights = [...products].sort((a, b) => Number(b.inStock) - Number(a.inStock)).slice(0, HOME_HIGHLIGHTS)

  return (
    <section id="colecao" aria-labelledby="colecao-titulo" className={`mx-auto max-w-7xl scroll-mt-20 ${sectionPad}`}>
      <SectionTitle
        id="colecao-titulo"
        eyebrow="Coleção Lirio.u"
        title="Feitas para cuidar com carinho"
        description="Modelagem pensada para o uso real, com toque macio e cores fáceis de combinar no cabelo ou no pulso."
      />
      {products.length === 0 ? (
        <p className="rounded-3xl border border-borda bg-white p-10 text-center text-sm text-cinza">
          Nossa vitrine está sendo preparada. Volte em instantes 🤎
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i % 4} />
            ))}
          </div>
          <div data-reveal className="mt-12 text-center">
            <Link href="/vitrine" className={btnOutline}>
              Ver toda a vitrine
              {products.length > highlights.length && <span className="text-cinza">({products.length} produtos)</span>}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </>
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
              compareAtPrice={product.compareAtPrice}
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
