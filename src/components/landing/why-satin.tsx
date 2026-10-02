import { SectionHeading } from '@/components/ui/section-heading'

const ITEMS = [
  {
    title: 'Menos frizz',
    text: 'A superfície lisa do cetim ajuda a reduzir o atrito com os fios enquanto você vira de lado à noite.',
  },
  { title: 'Menos marca de elástico', text: 'Prende com folga, sem apertar o fio. Você acorda, solta e sai.' },
  { title: 'Mais gentil com os fios', text: 'Sem metal e sem costura áspera para enroscar e puxar.' },
]

/** Bloco "Por que cetim?" (cartão claro). */
export function WhySatin() {
  return (
    <section aria-labelledby="cetim-titulo" className="pt-[72px] lg:pt-[120px]">
      <div className="rounded-(--radius-card) bg-leite px-5 py-14 lg:px-16 lg:py-24" data-reveal>
        <SectionHeading id="cetim-titulo" tone="light" eyebrow="O ritual da noite" title="Por que" accent="cetim?" />
        <ol className="pt-4 lg:grid lg:grid-cols-3 lg:gap-10 lg:pt-7">
          {ITEMS.map((item, i) => (
            <li
              key={item.title}
              data-reveal
              style={{ '--i': i } as React.CSSProperties}
              className="flex gap-3 border-t border-linho py-5 lg:flex-col lg:gap-2 lg:pt-7 lg:pb-0"
            >
              <span aria-hidden className="w-11 shrink-0 font-serif text-[32px] leading-none tracking-[-0.01em] text-rubor italic lg:w-auto lg:text-[48px]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="flex flex-col gap-1 lg:gap-2">
                <span className="text-[17px] leading-[1.35] font-medium text-noite-900 lg:text-[19px]">{item.title}</span>
                <span className="text-[14px] leading-[1.5] text-musgo lg:text-[16px] lg:leading-[1.55]">{item.text}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
