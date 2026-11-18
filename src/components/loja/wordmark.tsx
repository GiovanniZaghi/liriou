import Link from 'next/link'
import { LogoSymbol } from '@/components/ui/logo'
import { cn } from '@/lib/utils'

/** Logo da loja (versão para fundo claro), levando à página inicial. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <Link href="/#home" aria-label="Líriou, página inicial" className={cn('inline-block', className)}>
      <LogoSymbol tone="dark" className="origin-left scale-125 max-md:origin-center" />
    </Link>
  )
}
