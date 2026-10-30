import { Play, Star } from 'lucide-react'
import { reels, testimonials } from '@/lib/catalog'
import { SectionTitle } from './section-title'
import { sectionPad } from './styles'
import { DialogTrigger } from './triggers'

export function Reels() {
  return (
    <section id="ritual" aria-labelledby="ritual-titulo" className={`scroll-mt-20 overflow-hidden ${sectionPad}`}>
      <div className="mx-auto max-w-7xl">
        <div data-reveal className="mb-12 flex flex-col justify-between md:flex-row md:items-end">
          <div>
            <span className="eyebrow text-salvia">Experiência Real</span>
            <h2 id="ritual-titulo" className="mt-2 font-serif text-3xl text-grafite sm:text-4xl">
              O Ritual em Movimento
            </h2>
          </div>
          <p className="mt-2 max-w-md text-sm text-cinza md:mt-0">
            Assista aos vídeos reais das nossas embaixadoras e entenda como aplicar o cetim na sua rotina noturna.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reels.map((reel, i) => (
            <DialogTrigger
              key={reel.title}
              dialog={{ type: 'reel', reel }}
              data-reveal
              style={{ '--i': i } as React.CSSProperties}
              aria-label={`Assistir: ${reel.title}`}
              className="group relative h-[400px] overflow-hidden rounded-3xl bg-black/90 text-left shadow-lg"
            >
              <img
                src={reel.cover}
                alt=""
                className="size-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex flex-col justify-between bg-linear-to-t from-black/80 via-transparent to-transparent p-6 text-white">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-md">@liriou.u</span>
                  <span className="rounded-full bg-white/30 p-2.5 backdrop-blur-md">
                    <Play className="size-3 fill-current" aria-hidden />
                  </span>
                </div>
                <div>
                  <p className="font-serif text-lg">{reel.caption}</p>
                  <p className="mt-1 text-xs text-white/70">Toque para ver o vídeo</p>
                </div>
              </div>
            </DialogTrigger>
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
            <div className="flex gap-1 text-salvia" role="img" aria-label="5 de 5 estrelas">
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
