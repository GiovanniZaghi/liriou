import { cn } from '@/lib/utils'

/** Selos das bandeiras/métodos na lista de pagamento (desenhados em SVG/CSS, sem depender de imagens externas). */

const badge = 'inline-flex h-7 w-10 shrink-0 items-center justify-center rounded-md'

export function VisaBadge() {
  return (
    <span className={cn(badge, 'bg-[#1A1F71]')} title="Visa">
      <span className="text-[11px] font-black tracking-tight text-white italic">VISA</span>
    </span>
  )
}

export function MastercardBadge() {
  return (
    <span className={cn(badge, 'bg-[#231F20]')} title="Mastercard">
      <svg viewBox="0 0 32 20" className="h-4" aria-hidden>
        <circle cx="12" cy="10" r="8" fill="#EB001B" />
        <circle cx="20" cy="10" r="8" fill="#F79E1B" />
        <path d="M16 3.07a8 8 0 0 1 0 13.86 8 8 0 0 1 0-13.86Z" fill="#FF5F00" />
      </svg>
    </span>
  )
}

export function EloBadge() {
  return (
    <span className={cn(badge, 'border border-borda bg-white')} title="Elo">
      <span className="text-[12px] font-black tracking-tight text-black">elo</span>
    </span>
  )
}

export function MoreBadge({ count }: { count: number }) {
  return (
    <span className="hidden h-7 min-w-7 shrink-0 sm:inline-flex items-center justify-center rounded-md border border-borda bg-white px-1 text-[10px] font-medium text-cinza" title={`Mais ${count} bandeiras`}>
      +{count}
    </span>
  )
}

export function CardBrands() {
  return (
    <span className="flex items-center gap-1.5" aria-label="Visa, Mastercard, Elo e outras bandeiras">
      <VisaBadge />
      <MastercardBadge />
      <EloBadge />
      <MoreBadge count={3} />
    </span>
  )
}

export function BoletoBadge() {
  return (
    <span className={cn(badge, 'w-10 flex-col gap-px border border-borda bg-white')} title="Boleto">
      <svg viewBox="0 0 24 9" className="h-2.5" aria-hidden>
        {[0, 2, 3, 5, 7, 8, 10, 12, 13, 15, 16, 18, 20, 21, 23].map((x, i) => (
          <rect key={x} x={x} y="0" width={i % 3 === 0 ? 1.4 : 0.8} height="9" fill="#111" />
        ))}
      </svg>
      <span className="text-[7px] leading-none font-medium text-black">Boleto</span>
    </span>
  )
}
