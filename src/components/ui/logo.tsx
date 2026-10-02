import { cn } from '@/lib/utils'

/* Posições das camadas extraídas dos componentes Logo/Primária (38:375) e Logo/Símbolo (38:380). */

export function LogoPrimary({ className, animated = false }: { className?: string; animated?: boolean }) {
  return (
    <div
      role="img"
      aria-label="Líriou Scrunchies"
      className={cn('relative aspect-[281.208/149.434] w-[281px]', animated && 'logo-in', className)}
    >
      <div className="absolute inset-[3.94%_82.45%_42.73%_1.85%]">
        <div className="absolute inset-[-0.64%_-1.15%_-0.57%_-1.03%]">
          <img alt="" className="block size-full max-w-none" src="/figma/logo-folhas.svg" />
        </div>
      </div>
      <div className="absolute inset-[43.39%_16.54%_23.59%_16.87%]">
        <img alt="" className="absolute inset-0 block size-full max-w-none" src="/figma/logo-wordmark.svg" />
      </div>
      <div className="absolute inset-[84.76%_24.98%_5.14%_24.98%]">
        <div className="absolute inset-[-1.88%_-0.2%]">
          <img alt="" className="block size-full max-w-none" src="/figma/logo-scrunchies.svg" />
        </div>
      </div>
    </div>
  )
}

/** Wordmark + folhas, sem SCRUNCHIES (rodapé, favicon, selo). */
export function LogoSymbol({ className }: { className?: string }) {
  return (
    <div role="img" aria-label="Líriou" className={cn('relative h-[45.453px] w-[103.109px]', className)}>
      <div className="absolute inset-[4.75%_82.45%_30.96%_1.85%]">
        <div className="absolute inset-[-0.64%_-1.15%_-0.57%_-1.03%]">
          <img alt="" className="block size-full max-w-none" src="/figma/simbolo-folhas.svg" />
        </div>
      </div>
      <div className="absolute inset-[52.31%_16.54%_7.89%_16.87%]">
        <img alt="" className="absolute inset-0 block size-full max-w-none" src="/figma/simbolo-wordmark.svg" />
      </div>
    </div>
  )
}
