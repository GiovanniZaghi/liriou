import { Gem, HeartHandshake, Moon } from 'lucide-react'

export function Manifesto() {
  return (
    <section id="manifesto" className="mx-auto max-w-4xl scroll-mt-20 space-y-8 px-4 py-24 text-center sm:px-6 lg:px-8">
      <span data-reveal className="eyebrow block text-salvia">
        O Nosso Manifesto
      </span>
      <h2 data-reveal style={{ '--i': 1 } as React.CSSProperties} className="font-serif text-3xl leading-snug text-grafite sm:text-5xl">
        “Acreditamos que o verdadeiro luxo não precisa fazer barulho. Ele se sente no toque, na suavidade do tecido e
        no cuidado intencional de cada detalhe.”
      </h2>
      <div className="mx-auto h-0.5 w-16 bg-salvia" />
      <p className="mx-auto max-w-2xl text-sm leading-relaxed font-light text-cinza sm:text-base">
        A Líriou nasceu para transformar gestos simples do dia a dia, como prender o cabelo ou preparar a rotina para
        dormir, em rituais de alta performance e beleza atemporal.
      </p>
    </section>
  )
}

const TRUST = [
  { icon: HeartHandshake, title: 'Cuidando de Você', text: 'Acolhimento e afeto no autocuidado' },
  { icon: Moon, title: 'Alta Performance Noturna', text: 'Acorde com o cabelo intacto' },
  { icon: Gem, title: 'Cetim Premium', text: 'O verdadeiro padrão anti-frizz' },
]

export function TrustBar() {
  return (
    <section aria-label="Diferenciais" className="border-y border-borda bg-algodao py-8">
      <ul className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
        {TRUST.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex items-center justify-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-white text-salvia shadow-sm">
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
