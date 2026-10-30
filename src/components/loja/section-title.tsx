import { cn } from '@/lib/utils'

interface SectionTitleProps {
  id?: string
  eyebrow: string
  title: string
  description?: string
  className?: string
}

export function SectionTitle({ id, eyebrow, title, description, className }: SectionTitleProps) {
  return (
    <div data-reveal className={cn('mx-auto mb-16 max-w-2xl text-center', className)}>
      <span className="eyebrow text-salvia">{eyebrow}</span>
      <h2 id={id} className="mt-2 font-serif text-3xl text-grafite sm:text-4xl">
        {title}
      </h2>
      {description && <p className="mt-3 text-sm text-cinza">{description}</p>}
    </div>
  )
}
