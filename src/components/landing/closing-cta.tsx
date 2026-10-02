import { CtaLink } from './cta-link'
import { LilyLines } from './lily-lines'

/** Bloco CTA final (rosa): âncora #cadastro com rolagem suave. */
export function ClosingCta() {
  return (
    <section aria-labelledby="cta-titulo" className="pt-20 lg:pt-[120px]">
      <div
        data-reveal
        className="relative overflow-hidden rounded-(--radius-card) bg-[linear-gradient(139deg,#ffd9e4_7.14%,#ffcfdd_39.29%,#f6bccd_78.57%)] px-6 pt-14 pb-[60px] lg:bg-[linear-gradient(161.6deg,#ffd9e4_7.14%,#ffcfdd_39.29%,#f6bccd_78.57%)] lg:px-[88px] lg:py-[104px]"
      >
        <LilyLines
          variant="cta"
          className="right-[-60px] bottom-[-119px] h-[218px] w-[164px] opacity-30 lg:right-[3.33%] lg:bottom-[-11.28%] lg:h-[79%] lg:w-[24.5%] lg:opacity-50"
        />

        <div className="relative">
          <p className="eyebrow text-rubor">Lista VIP da pré-venda</p>
          <h2
            id="cta-titulo"
            className="pt-3 pb-4 font-serif text-[44px] leading-[0.98] tracking-[-0.01em] text-noite-900 lg:text-[76px] lg:tracking-[-0.015em]"
          >
            <span className="block">A noite é longa.</span>
            <em className="block text-folha italic">Seu cabelo agradece.</em>
          </h2>
          <p className="max-w-[300px] pb-7 text-[16px] leading-[1.55] text-tinta/78 lg:max-w-[420px]">
            Leva 30 segundos, não custa nada e você recebe a pré-venda antes de todo mundo.
          </p>
          <CtaLink source="closing" variant="primary">
            Entrar na lista VIP
          </CtaLink>
        </div>
      </div>
    </section>
  )
}
