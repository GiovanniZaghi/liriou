import { SectionHeading } from '@/components/ui/section-heading'

const STEPS = [
  { title: 'Entre na lista', text: 'Nome, e-mail e WhatsApp. Sem custo e sem compromisso.' },
  { title: 'Receba o aviso', text: 'O link da pré-venda chega no seu WhatsApp antes da abertura pública.' },
  { title: 'Garanta o kit', text: 'Preço especial no kit completo e brinde no pedido das primeiras.' },
]

/** Bloco "Três passos até o seu kit" · componente Passo (45:23), reveal em cascata de 90ms. */
export function Steps() {
  return (
    <section aria-labelledby="passos-titulo" className="pt-[72px] lg:pt-[120px]">
      <SectionHeading id="passos-titulo" eyebrow="Como funciona" title="Três passos até o" accent="seu kit" />
      <ol className="flex flex-col gap-4 pt-7 lg:grid lg:grid-cols-3 lg:gap-10 lg:pt-10">
        {STEPS.map((step, i) => (
          <li key={step.title} data-reveal style={{ '--i': i } as React.CSSProperties} className="flex items-start gap-3.5">
            <span
              aria-hidden
              className="grid size-11 shrink-0 place-items-center rounded-full border border-petala font-serif text-[22px] leading-[1.05] tracking-[-0.005em] text-petala"
            >
              {i + 1}
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="text-[15px] leading-[1.35] font-medium text-leite">{step.title}</span>
              <span className="text-[14px] leading-[1.5] text-leite/56">{step.text}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
