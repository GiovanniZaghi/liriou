import Link from 'next/link'

/** Ordem do mosaico: linha de cima (marrom, verde) e de baixo (terracota, azul). */
const TILES = [
  { src: '/moodboard/marrom.webp', alt: 'Scrunchie de cetim marrom com rosas, café e esmalte nude' },
  { src: '/moodboard/verde.webp', alt: 'Scrunchie de cetim verde-oliva com maçãs verdes e alfaiataria' },
  { src: '/moodboard/terracota.webp', alt: 'Scrunchie de cetim terracota em clima de pôr do sol' },
  { src: '/moodboard/azul.webp', alt: 'Scrunchie de cetim azul-claro com hortênsias e céu' },
]

/**
 * Mosaico de cores (2 × 2, de ponta a ponta, sem espaço entre as fotos).
 * As artes são em pé; o recorte fica no centro, onde está a scrunchie.
 */
export function Moodboard() {
  return (
    <section aria-label="Cores da coleção" className="grid grid-cols-2">
      {TILES.map((t) => (
        <Link key={t.src} href="/vitrine" className="group relative block aspect-[3/4] overflow-hidden md:aspect-[4/3]">
          <img
            src={t.src}
            alt={t.alt}
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>
      ))}
    </section>
  )
}
