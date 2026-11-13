import Link from 'next/link'

interface PageHeaderProps {
  title: string
  description?: string
  /** Trilha até a tela atual, ex.: [{ href: '/dashboard/estoque', label: 'Estoque' }] */
  breadcrumb?: { href: string; label: string }[]
  actions?: React.ReactNode
}

export function PageHeader({ title, description, breadcrumb, actions }: PageHeaderProps) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {breadcrumb && (
          <nav aria-label="Trilha" className="mb-1.5 text-[13px] text-musgo">
            {breadcrumb.map((b) => (
              <span key={b.href}>
                <Link href={b.href} className="hover:text-noite-900 hover:underline">
                  {b.label}
                </Link>
                <span className="px-1.5" aria-hidden>
                  /
                </span>
              </span>
            ))}
          </nav>
        )}
        <h1 className="font-serif text-[36px] leading-none text-noite-900">{title}</h1>
        {description && <p className="mt-1.5 text-[14px] text-musgo">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  )
}

export const pageShell = 'mx-auto w-full max-w-[1280px] px-5 pt-8 pb-20 lg:px-10'

/** Botões do painel (paleta do dashboard) */
export const dashBtn = {
  primary:
    'inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-noite-900 px-5 text-[14px] font-semibold text-leite hover:bg-noite-800 disabled:cursor-wait disabled:opacity-70',
  outline:
    'inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full border-[1.5px] border-noite-900 px-5 text-[14px] font-semibold text-noite-900 hover:bg-noite-900 hover:text-leite',
  ghost:
    'inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-full px-3 text-[13px] font-medium text-tinta hover:bg-linho',
  danger:
    'inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full border-[1.5px] border-rubor/40 px-5 text-[14px] font-semibold text-rubor hover:bg-rubor hover:text-leite',
}

export const dashControl =
  'h-11 rounded-full border-[1.5px] border-linho bg-white px-4 text-[14px] text-tinta outline-none focus:border-noite-900'
