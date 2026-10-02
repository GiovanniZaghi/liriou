import Link from 'next/link'
import { LogoSymbol } from '@/components/ui/logo'
import { LogoutButton } from './logout-button'

export function DashboardHeader() {
  return (
    <header className="bg-noite-900">
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between gap-4 px-5 lg:px-10">
        <div className="flex items-center gap-4">
          <LogoSymbol className="origin-left scale-90" />
          <span className="hidden h-5 w-px bg-petala/25 sm:block" />
          <span className="hidden text-[14px] font-medium text-leite/78 sm:block">Lista VIP · Cadastros</span>
        </div>
        <div className="flex items-center gap-5 text-[14px]">
          <Link href="/" target="_blank" className="text-leite/78 hover:text-petala">
            Ver site
          </Link>
          <LogoutButton />
        </div>
      </div>
    </header>
  )
}
