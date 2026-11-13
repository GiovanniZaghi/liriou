import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export const CHECKOUT_STEPS = ['Identificação', 'Entrega', 'Revisão', 'Pagamento'] as const

interface CheckoutStepsProps {
  /** 0 = Identificação … 3 = Pagamento */
  current: number
  /** Etapas anteriores clicáveis para voltar e editar */
  onSelect?: (index: number) => void
}

export function CheckoutSteps({ current, onSelect }: CheckoutStepsProps) {
  return (
    <nav aria-label="Etapas da compra" className="mb-8">
      <ol className="flex items-center">
        {CHECKOUT_STEPS.map((label, i) => {
          const done = i < current
          const active = i === current
          const clickable = done && onSelect
          const content = (
            <>
              <span
                className={cn(
                  'flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors',
                  done && 'border-salvia bg-salvia text-white',
                  active && 'border-grafite bg-grafite text-white',
                  !done && !active && 'border-borda bg-white text-cinza',
                )}
              >
                {done ? <Check className="size-4" aria-hidden /> : i + 1}
              </span>
              <span className={cn('hidden text-xs font-medium sm:inline', active ? 'text-grafite' : 'text-cinza')}>{label}</span>
            </>
          )
          return (
            <li key={label} className="flex flex-1 items-center gap-2 last:flex-none" aria-current={active ? 'step' : undefined}>
              {clickable ? (
                <button type="button" onClick={() => onSelect(i)} className="flex items-center gap-2 hover:opacity-80">
                  {content}
                </button>
              ) : (
                <span className="flex items-center gap-2">{content}</span>
              )}
              {i < CHECKOUT_STEPS.length - 1 && (
                <span className={cn('mx-2 h-px flex-1', done ? 'bg-salvia' : 'bg-borda')} aria-hidden />
              )}
            </li>
          )
        })}
      </ol>
      <p className="mt-3 text-xs text-cinza sm:hidden">
        Etapa {current + 1} de {CHECKOUT_STEPS.length}: <strong className="font-semibold text-grafite">{CHECKOUT_STEPS[current]}</strong>
      </p>
    </nav>
  )
}
