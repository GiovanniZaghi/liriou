import { Feather, WandSparkles } from 'lucide-react'
import { DialogTrigger } from './triggers'

/** Hero na cor-assinatura da marca (verde-noite + pétala), como no logo e no Instagram. */
export function StoreHero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[85vh] scroll-mt-20 items-center justify-center overflow-hidden bg-noite-900 px-4 py-16 text-leite sm:px-6 lg:px-8"
    >
      {/* Brilho suave de pétala e folha ao fundo */}
      <div aria-hidden className="pointer-events-none absolute -top-40 -right-32 size-[520px] rounded-full bg-rubor/35 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-48 -left-40 size-[560px] rounded-full bg-folha/25 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="z-10 space-y-6 text-center lg:text-left">
          <span className="inline-block rounded-full bg-petala px-4 py-1.5 text-xs font-semibold tracking-widest text-noite-900 uppercase">
            Cool girls dormem no cetim 🌸
          </span>
          <h1 className="font-serif text-5xl leading-[1.05] text-leite sm:text-6xl lg:text-7xl">
            Menos pressa, <em className="text-petala italic">mais cetim</em>
            <span className="text-folha-claro">.</span>
          </h1>
          <p className="mx-auto max-w-lg text-base leading-relaxed text-leite/80 sm:text-lg lg:mx-0">
            Scrunchies e toucas de cetim de alta gramatura para dormir e acordar bonita: sem frizz, sem marca de elástico,
            com acabamento de alfaiataria.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row lg:justify-start">
            <a
              href="#colecao"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-petala px-8 py-4 font-semibold text-noite-900 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#ffdbe5] sm:w-auto"
            >
              Explorar Vitrine
            </a>
            <DialogTrigger
              dialog={{ type: 'creator' }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-leite/30 px-8 py-4 font-medium text-leite transition-all hover:border-petala hover:text-petala sm:w-auto"
            >
              <WandSparkles className="size-4 text-petala" aria-hidden /> Quero ser Creator
            </DialogTrigger>
          </div>
        </div>

        <div className="relative flex justify-center">
          <div className="card-in relative h-[450px] w-full max-w-md rotate-1 overflow-hidden rounded-3xl bg-petala shadow-2xl ring-8 ring-petala/20 sm:h-[520px]">
            <img
              src="https://placehold.co/600x800/FFCFDD/0B2E1F?text=Lirio.u"
              alt="Scrunchies de cetim Líriou"
              className="size-full object-cover"
            />
            <div className="absolute right-6 bottom-6 left-6 flex items-center justify-between gap-3 rounded-2xl bg-leite/95 p-4 text-grafite shadow-lg backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-petala text-noite-900">
                  <Feather className="size-4" aria-hidden />
                </div>
                <div>
                  <p className="text-xs font-medium tracking-wider text-cinza uppercase">Tecnologia</p>
                  <p className="text-sm font-semibold">Zero Frizz Garantido</p>
                </div>
              </div>
              <span className="rounded-full bg-folha px-3 py-1 text-xs font-semibold whitespace-nowrap text-white">
                Alta Gramatura
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
