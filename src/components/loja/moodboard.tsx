import Link from 'next/link'

/** Ordem do mosaico: linha de cima (marrom, verde) e de baixo (terracota, azul). */
const TILES = [
  { src: '/moodboard/marrom.webp', alt: 'Scrunchie de cetim marrom com rosas, café e esmalte nude' },
  { src: '/moodboard/verde.webp', alt: 'Scrunchie de cetim verde-oliva com maçãs verdes e alfaiataria' },
  { src: '/moodboard/terracota.webp', alt: 'Scrunchie de cetim terracota em clima de pôr do sol' },
  { src: '/moodboard/azul.webp', alt: 'Scrunchie de cetim azul-claro com hortênsias e céu' },
]

/**
 * Mosaico de cores: 4 artes lado a lado no computador (2 × 2 no celular), dentro da largura do site,
 * com cantos arredondados. As artes são em pé; o recorte fica no centro, onde está a scrunchie.
 */
export function Moodboard() {
  return (
    <section aria-label="Cores da coleção" className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {TILES.map((t, i) => (
          <Link
            key={t.src}
            href="/vitrine"
            data-reveal
            style={{ '--i': i } as React.CSSProperties}
            className="group relative block aspect-[4/5] overflow-hidden rounded-3xl shadow-sm transition-shadow hover:shadow-xl"
          >
            <img
              src={t.src}
              alt={t.alt}
              loading="lazy"
              decoding="async"
              className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </Link>
        ))}
      </div>
    </section>
  )
}
