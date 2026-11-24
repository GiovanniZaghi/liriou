import { Feather, HeartHandshake, SunMoon } from 'lucide-react'

export function Manifesto() {
  return (
    <section id="manifesto" className="mx-auto max-w-4xl scroll-mt-20 space-y-8 px-4 py-24 text-center sm:px-6 lg:px-8">
      <span data-reveal className="eyebrow block text-rubor">
        Nossa história
      </span>
      <h2 data-reveal style={{ '--i': 1 } as React.CSSProperties} className="font-serif text-2xl leading-snug text-grafite sm:text-4xl">
        A Lirio.u nasceu de uma necessidade real da Mari: ter peças práticas, bonitas e macias para cuidar do cabelo
        sem depender de elástico comum.
      </h2>
      <div className="mx-auto h-1 w-16 rounded-full bg-petala" />
      <p className="mx-auto max-w-2xl text-sm leading-relaxed font-light text-cinza sm:text-base">
        Entre a correria do dia a dia, a vontade de manter os fios bem cuidados e o olhar de quem entende de moda e
        modelagem, surgiu a ideia de criar scrunchies de cetim que funcionam de verdade: confortáveis no cabelo, bonitas
        no pulso e feitas para acompanhar a sua rotina com carinho.
      </p>
    </section>
  )
}

const TRUST = [
  { icon: HeartHandshake, title: 'Cuidando do seu cabelo com carinho', text: 'Leveza e afeto nos pequenos gestos do dia' },
  { icon: Feather, title: 'Sem marcar, sem apertar', text: 'Conforto real no cabelo e praticidade' },
  { icon: SunMoon, title: 'Feita para o dia a dia', text: 'Do corre da rotina ao descanso de verdade' },
]

export function TrustBar() {
  return (
    <section aria-label="Diferenciais" className="border-y border-borda bg-algodao py-8">
      <ul className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
        {TRUST.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex items-center justify-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-petala text-noite-900">
              <Icon className="size-4" aria-hidden />
            </div>
            <div>
              <h3 className="text-sm font-medium">{title}</h3>
              <p className="text-xs text-cinza">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
