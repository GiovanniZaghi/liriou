import { Star } from 'lucide-react'
import { reels, testimonials } from '@/lib/content'
import { SectionTitle } from './section-title'
import { sectionPad } from './styles'
import { ReelCard } from './reel-card'

export function Reels() {
  return (
    <section id="ritual" aria-labelledby="ritual-titulo" className={`scroll-mt-20 overflow-hidden ${sectionPad}`}>
      <div className="mx-auto max-w-7xl">
        <div data-reveal className="mb-12 flex flex-col justify-between md:flex-row md:items-end">
          <div>
            <span className="eyebrow text-rubor">Experiência Real</span>
            <h2 id="ritual-titulo" className="mt-2 font-serif text-3xl text-grafite sm:text-4xl">
              Detalhes que você sente
            </h2>
          </div>
          <p className="mt-2 max-w-md text-sm text-cinza md:mt-0">
            Confira o movimento do tecido, as combinações de cor e a praticidade das peças fora do catálogo.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reels.map((reel, i) => (
            <ReelCard key={reel.video} reel={reel} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

export function Testimonials() {
  return (
    <section aria-labelledby="depoimentos-titulo" className={`mx-auto max-w-7xl border-t border-borda ${sectionPad}`}>
      <SectionTitle id="depoimentos-titulo" eyebrow="Palavra das Embaixadoras" title="Quem usa, não troca" />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <figure
            key={t.author}
            data-reveal
            style={{ '--i': i } as React.CSSProperties}
            className="space-y-4 rounded-3xl border border-borda bg-algodao p-8"
          >
            <div className="flex gap-1 text-rubor" role="img" aria-label="5 de 5 estrelas">
              {Array.from({ length: 5 }, (_, s) => (
                <Star key={s} className="size-3 fill-current" aria-hidden />
              ))}
            </div>
            <blockquote className="text-xs leading-relaxed font-light text-grafite italic">“{t.quote}”</blockquote>
            <figcaption className="text-xs font-semibold text-cinza">— {t.author}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
