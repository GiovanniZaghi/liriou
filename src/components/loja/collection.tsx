import { Check } from 'lucide-react'
import { formatBRL } from '@/lib/format'
import { getProduct, kits, products } from '@/lib/catalog'
import { ProductCard } from './product-card'
import { SectionTitle } from './section-title'
import { btnSmall, sectionPad } from './styles'
import { AddToCartButton } from './triggers'

export function Collection() {
  return (
    <section id="colecao" aria-labelledby="colecao-titulo" className={`mx-auto max-w-7xl scroll-mt-20 ${sectionPad}`}>
      <SectionTitle
        id="colecao-titulo"
        eyebrow="Vitrine Exclusiva"
        title="Essenciais para o seu ritual"
        description="Desenvolvidas com rigor estético, acabamento impecável em alfaiataria e alta gramatura."
      />
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  )
}

export function Kits() {
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
          {kits.map((kit, i) => {
            const product = getProduct(kit.productId)
            if (!product) return null
            return (
              <article
                key={kit.productId}
                data-reveal
                style={{ '--i': i } as React.CSSProperties}
                className="flex flex-col justify-between rounded-3xl border border-borda bg-white p-8 shadow-sm"
              >
                <div>
                  <span className={`${kit.tagClassName} rounded-full px-3 py-1 text-[10px] font-semibold text-grafite uppercase`}>
                    {kit.tag}
                  </span>
                  <h3 className="mt-4 font-serif text-2xl text-grafite">{kit.title}</h3>
                  <p className="mt-2 text-xs text-cinza">{kit.contents}</p>
                  <ul className="mt-6 space-y-2 text-xs text-grafite">
                    {kit.perks.map((perk) => (
                      <li key={perk} className="flex items-center gap-2">
                        <Check className="size-3.5 text-salvia" aria-hidden /> {perk}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-8 flex items-center justify-between gap-4 border-t border-borda pt-6">
                  <div>
                    <span className="font-serif text-xl font-medium">{formatBRL(product.price)}</span>
                    <p className="text-[10px] text-cinza">{kit.note}</p>
                  </div>
                  <AddToCartButton productId={product.id} className={btnSmall}>
                    Garantir Kit
                  </AddToCartButton>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
