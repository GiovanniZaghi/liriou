'use client'

import { ExternalLink, LogOut, Menu, Package, TicketPercent, UserRound, Users, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { logoutAction } from '@/app/actions/auth'
import { LogoSymbol } from '@/components/ui/logo'
import { cn } from '@/lib/utils'

/** Menu do painel, agrupado por seção (padrão ERP). Novas telas entram aqui. */
const NAV_SECTIONS = [
  {
    title: 'Dashboard',
    items: [
      { href: '/dashboard/pre-venda', label: 'Pré-venda', icon: Users },
      { href: '/dashboard/clientes', label: 'Clientes', icon: UserRound },
      { href: '/dashboard/estoque', label: 'Estoque', icon: Package },
      { href: '/dashboard/cupons', label: 'Cupons', icon: TicketPercent },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Fecha a gaveta (celular) ao navegar
  useEffect(() => setOpen(false), [pathname])

  return (
    <>
      {/* Barra superior: só no celular/tablet */}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between bg-noite-900 px-4 lg:hidden">
        <LogoSymbol className="origin-left scale-75" />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Abrir menu"
          aria-expanded={open}
          aria-controls="painel-menu"
          className="grid size-10 place-items-center rounded-full text-leite hover:bg-white/10"
        >
          <Menu className="size-5" aria-hidden />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 bg-noite-950/60 lg:hidden" onClick={() => setOpen(false)} aria-hidden />
      )}

      <aside
        id="painel-menu"
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[248px] flex-col bg-noite-900 text-leite transition-transform duration-(--t-base) ease-cetim',
          'lg:sticky lg:top-0 lg:h-svh lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Link href="/dashboard" aria-label="Início do painel">
            <LogoSymbol className="origin-left scale-90" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
            className="grid size-9 place-items-center rounded-full text-leite/70 hover:bg-white/10 lg:hidden"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>

        <nav aria-label="Painel" className="flex-1 overflow-y-auto px-3 pt-4">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="mb-6">
              <p className="mb-2 px-3 text-[11px] font-semibold tracking-[0.12em] text-leite/50 uppercase">
                {section.title}
              </p>
              <ul className="space-y-1">
                {section.items.map(({ href, label, icon: Icon }) => {
                  const active = pathname === href || pathname.startsWith(`${href}/`)
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'flex h-11 items-center gap-3 rounded-xl px-3 text-[14px] font-medium transition-colors',
                          active ? 'bg-petala text-noite-900' : 'text-leite/80 hover:bg-white/8 hover:text-leite',
                        )}
                      >
                        <Icon className="size-4.5 shrink-0" aria-hidden />
                        {label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="space-y-1 border-t border-white/10 p-3">
          <Link
            href="/"
            target="_blank"
            className="flex h-10 items-center gap-3 rounded-xl px-3 text-[14px] text-leite/70 hover:bg-white/8 hover:text-leite"
          >
            <ExternalLink className="size-4" aria-hidden /> Ver loja
          </Link>
          <button
            type="button"
            onClick={async () => {
              await logoutAction()
              window.location.replace('/dashboard/login')
            }}
            className="flex h-10 w-full cursor-pointer items-center gap-3 rounded-xl px-3 text-left text-[14px] text-leite/70 hover:bg-white/8 hover:text-petala"
          >
            <LogOut className="size-4" aria-hidden /> Sair
          </button>
        </div>
      </aside>
    </>
  )
}
