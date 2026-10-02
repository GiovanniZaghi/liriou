import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  /** Parte final do título, em itálico */
  accent: string
  tone?: 'dark' | 'light'
  id?: string
  className?: string
}

/** Sobretítulo + título serifado com final em itálico, usado em todos os blocos. */
export function SectionHeading({ eyebrow, title, accent, tone = 'dark', id, className }: SectionHeadingProps) {
  const onDark = tone === 'dark'
  return (
    <div className={cn('flex flex-col items-center gap-3 text-center', className)}>
      {eyebrow && <p className={cn('eyebrow', onDark ? 'text-petala' : 'text-rubor')}>{eyebrow}</p>}
      <h2
        id={id}
        className={cn(
          'font-serif text-[40px] leading-none tracking-[-0.01em] lg:text-[56px] lg:tracking-[-0.015em]',
          onDark ? 'text-leite' : 'text-noite-900',
        )}
      >
        {title} <em className={cn('italic', onDark ? 'text-petala' : 'text-rubor')}>{accent}</em>
      </h2>
    </div>
  )
}
