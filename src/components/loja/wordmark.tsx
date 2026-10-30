import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Wordmark({ className }: { className?: string }) {
  return (
    <Link href="/#home" aria-label="Líriou, página inicial" className={cn('font-serif text-2xl font-medium tracking-wide', className)}>
      líriou<span className="text-salvia">.</span>
      <span className="ml-1 font-sans text-xs tracking-normal text-cinza">u</span>
    </Link>
  )
}
