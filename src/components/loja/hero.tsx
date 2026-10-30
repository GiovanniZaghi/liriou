import { Feather, WandSparkles } from 'lucide-react'
import { btnOutline, btnPrimary } from './styles'
import { DialogTrigger } from './triggers'

export function StoreHero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[85vh] scroll-mt-20 items-center justify-center overflow-hidden bg-linear-to-b from-algodao to-areia px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="z-10 space-y-6 text-center lg:text-left">
          <span className="inline-block rounded-full bg-rosa-50 px-4 py-1.5 text-xs font-medium tracking-widest text-grafite uppercase">
            O seu ritual de alta performance noturna 🤎
          </span>
          <h1 className="font-serif text-4xl leading-tight text-grafite sm:text-5xl lg:text-6xl">
            Menos pressa, mais cetim<span className="text-salvia">.</span>
          </h1>
          <p className="mx-auto max-w-lg text-base leading-relaxed font-light text-cinza sm:text-lg lg:mx-0">
            Acessórios em cetim de alta gramatura com acabamento de alfaiataria que blindam os fios contra o atrito e
            elevam a sua rotina com a estética do luxo silencioso.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row lg:justify-start">
            <a href="#colecao" className={`${btnPrimary} w-full sm:w-auto`}>
              Explorar Vitrine
            </a>
            <DialogTrigger dialog={{ type: 'creator' }} className={`${btnOutline} w-full sm:w-auto`}>
              <WandSparkles className="size-4 text-rosa" aria-hidden /> Quero ser Creator
            </DialogTrigger>
          </div>
        </div>

        <div className="relative flex justify-center">
          <div className="card-in relative h-[450px] w-full max-w-md overflow-hidden rounded-3xl bg-algodao shadow-2xl sm:h-[520px]">
            <img
              src="https://placehold.co/600x800/E8E2DD/2C2A29?text=Lirio.u+High+Ticket"
              alt="Scrunchies de cetim Líriou"
              className="size-full object-cover"
            />
            <div className="absolute right-6 bottom-6 left-6 flex items-center justify-between gap-3 rounded-2xl border border-white/40 bg-white/90 p-4 shadow-lg backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-rosa-50 text-grafite">
                  <Feather className="size-4" aria-hidden />
                </div>
                <div>
                  <p className="text-xs font-medium tracking-wider text-cinza uppercase">Tecnologia</p>
                  <p className="text-sm font-semibold text-grafite">Zero Frizz Garantido</p>
                </div>
              </div>
              <span className="rounded-full bg-salvia px-3 py-1 text-xs font-medium whitespace-nowrap text-white">
                Alta Gramatura
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
