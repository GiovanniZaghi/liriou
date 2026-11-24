import Link from 'next/link'

const btn =
  'inline-flex w-full items-center justify-center rounded-full px-8 py-3.5 text-sm font-semibold shadow-lg transition-all hover:-translate-y-0.5 sm:w-auto'

/**
 * Banner de abertura (arte da campanha "A sua marca favorita está de volta").
 * O texto e o logo já estão na imagem; os botões ficam sobre ela no desktop e logo abaixo no celular,
 * onde a arte fica pequena demais para receber os botões por cima.
 */
export function StoreHero() {
  return (
    <section id="home" className="relative scroll-mt-20 bg-[#bdbdbd]">
      <h1 className="sr-only">Líriou Scrunchies: a sua marca favorita está de volta. Menos pressa, mais cetim.</h1>

      <picture>
        <source srcSet="/hero/banner-liriou.webp" type="image/webp" />
        <img
          src="/hero/banner-liriou.jpg"
          alt="Scrunchies de cetim Líriou em várias cores no pulso e prendendo um rabo de cavalo"
          width={1600}
          height={800}
          fetchPriority="high"
          className="mx-auto aspect-[2/1] max-h-[85vh] w-full object-cover"
        />
      </picture>

      <div className="flex flex-col items-center justify-center gap-3 px-4 pt-2 pb-8 sm:absolute sm:inset-x-0 sm:bottom-[6%] sm:flex-row sm:gap-4 sm:p-0">
        <Link href="/vitrine" className={`${btn} bg-noite-900 text-leite hover:bg-noite-900/90`}>
          Conheça a coleção
        </Link>
        <a href="#manifesto" className={`${btn} bg-leite/95 text-noite-900 hover:bg-petala`}>
          Nossa história
        </a>
      </div>
    </section>
  )
}
