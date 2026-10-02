import { Fragment } from 'react'
import { LogoPrimary } from '@/components/ui/logo'
import { VipForm } from './vip-form/vip-form'

/** Título palavra a palavra: cada palavra sobe dentro de uma máscara. */
function SplitWords({ text, offset = 0 }: { text: string; offset?: number }) {
  const words = text.split(' ')
  return words.map((word, i) => (
    <Fragment key={i}>
      <span className="word-mask">
        <span className="word-up" style={{ '--wi': offset + i } as React.CSSProperties}>
          {word}
        </span>
      </span>
      {i < words.length - 1 && ' '}
    </Fragment>
  ))
}

export function Hero() {
  return (
    <section
      aria-labelledby="hero-titulo"
      className="flex flex-col items-center lg:grid lg:min-h-[min(calc(100svh-120px),820px)] lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16 lg:py-10"
    >
      <div className="flex flex-col items-center text-center lg:items-start lg:gap-5 lg:text-left">
        <div className="lg:pb-4">
          <LogoPrimary animated className="w-[292.9px] lg:w-[281.2px]" />
        </div>

        <div className="flex flex-col items-center gap-3 pt-[22px] lg:items-start lg:gap-3.5 lg:pt-0">
          <p className="eyebrow text-petala" data-reveal style={{ '--d': '.2s' } as React.CSSProperties}>
            Lista VIP da pré-venda
          </p>
          <h1
            id="hero-titulo"
            className="font-serif text-[52px] leading-none tracking-[-0.015em] lg:text-[clamp(4rem,6.4vw,6.2rem)] lg:leading-[0.96] lg:tracking-[-0.02em]"
          >
            <span className="block text-leite">
              <SplitWords text="Você dorme." />
            </span>
            <em className="block text-petala italic">
              <SplitWords text="O cetim cuida." offset={2} />
            </em>
          </h1>
        </div>

        <p
          data-reveal
          style={{ '--d': '.95s' } as React.CSSProperties}
          className="max-w-[350px] pt-4 text-[16px] leading-[1.55] text-leite/78 lg:max-w-[520px] lg:pt-0 lg:text-[18px]"
        >
          Scrunchies de cetim de alta gramatura que seguram o cabelo sem apertar e com menos marca. Entre para a lista
          VIP e garanta o kit completo antes de todo mundo.
        </p>
        {/* Selo de prova social: exibir só com número real de cadastros, a partir de 50 */}
      </div>

      <div className="w-full pt-7 lg:pt-0">
        <VipForm />
      </div>
    </section>
  )
}
