import Link from 'next/link'
import { LogoSymbol } from '@/components/ui/logo'
import { MotionToggleLink } from './motion-toggle-link'

export function SiteFooter() {
  return (
    <footer className="pt-14">
      <div className="flex flex-col items-center gap-2 border-t border-petala/18 pt-6 text-center text-[12px] leading-[1.5] text-leite/56">
        <LogoSymbol />
        <p className="max-w-[340px] lg:max-w-none">
          Usamos suas informações para a pré-venda e a comunicação da Líriou, conforme a LGPD. Não vendemos nem
          repassamos seus dados.
        </p>
        <nav aria-label="Links legais" className="flex flex-wrap justify-center gap-x-5 gap-y-1">
          <Link href="/termos" className="underline hover:text-petala">
            Termos de Uso
          </Link>
          <Link href="/privacidade" className="underline hover:text-petala">
            Aviso de Privacidade
          </Link>
          <MotionToggleLink />
        </nav>
        <p>© 2026 Líriou Scrunchies. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}
