import { cn } from '@/lib/utils'

/*
 * "Linha do lírio": 6 traços do Figma. As posições são relativas ao próprio grupo
 * (mesma geometria no fundo desktop/mobile e no bloco CTA final); `inner` compensa
 * a espessura do traço que vaza da caixa.
 */
const STROKES = [
  { box: 'left-[38.21%] top-0 w-[61.79%] h-[76.73%]', inner: 'inset-[-0.72%_-1.87%]' },
  { box: 'left-[32.53%] top-[1.13%] w-[63.89%] h-[87.23%]', inner: 'inset-[-0.35%_-1%]' },
  { box: 'left-[37.6%] top-[4.54%] w-[58.31%] h-[80.72%]', inner: 'inset-[-0.32%_-0.92%]' },
  { box: 'left-0 top-[74.09%] w-[96.92%] h-[17.38%]', inner: 'inset-[-2.46%_-0.93%]' },
  { box: 'left-0 top-[76.84%] w-[96.42%] h-[23.16%]', inner: 'inset-[-2.11%_-1.06%]' },
  { box: 'left-[24.1%] top-[76%] w-[72.32%] h-[20.05%]', inner: 'inset-[-1.28%_-0.74%]' },
]

interface LilyLinesProps {
  /** `lirio` = traço pétala (fundo escuro) · `cta` = traço folha (bloco rosa) */
  variant: 'lirio' | 'cta'
  className?: string
}

export function LilyLines({ variant, className }: LilyLinesProps) {
  return (
    <div aria-hidden className={cn('pointer-events-none absolute', className)}>
      {STROKES.map((s, i) => (
        <div key={i} className={cn('absolute', s.box)}>
          <div className={cn('lily-stroke absolute', s.inner)} style={{ '--si': i } as React.CSSProperties}>
            <img alt="" className="block size-full max-w-none" src={`/figma/${variant}-traco-${i}.svg`} />
          </div>
        </div>
      ))}
    </div>
  )
}
