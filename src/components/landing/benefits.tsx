import { SectionHeading } from '@/components/ui/section-heading'

const BENEFITS = [
  { icon: 'icone-tag', title: 'Preço especial', text: 'no kit completo de cetim' },
  { icon: 'icone-entrega', title: 'Recebimento antecipado', text: 'antes de todo mundo' },
  { icon: 'icone-presente', title: 'Brinde surpresa', text: 'no pedido das primeiras cadastradas' },
]

/** Bloco "O que a lista VIP garante" · componente Benefício VIP (45:18). */
export function Benefits() {
  return (
    <section aria-labelledby="beneficios-titulo" className="pt-[72px] lg:pt-[120px]">
      <SectionHeading id="beneficios-titulo" eyebrow="Só para a lista" title="O que a lista VIP" accent="garante" />
      <ul className="grid gap-3 pt-7 lg:grid-cols-3 lg:gap-4 lg:pt-10">
        {BENEFITS.map((b, i) => (
          <li
            key={b.title}
            data-reveal
            style={{ '--i': i } as React.CSSProperties}
            className="group flex items-center gap-3.5 rounded-[20px] border border-petala/18 bg-petala/6 p-4 transition-[background-color,translate] duration-(--t-base) ease-cetim hover:-translate-y-0.5 hover:bg-petala/12 lg:p-7"
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-petala transition-transform duration-(--t-base) ease-petala group-hover:scale-108 group-hover:-rotate-10">
              <img alt="" src={`/figma/${b.icon}.svg`} className="size-6" />
            </span>
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="text-[15px] leading-[1.35] font-medium text-leite">{b.title}</span>
              <span className="text-[14px] leading-[1.5] text-leite/56">{b.text}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
