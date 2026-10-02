import Link from 'next/link'
import { LogoPrimary } from '@/components/ui/logo'
import { site } from '@/lib/site'

export interface LegalSection {
  title: string
  body: React.ReactNode
}

interface LegalPageProps {
  title: string
  sections: LegalSection[]
}

/** Layout das rotas legais (Desktop 03/04 · Mobile 07/08). */
export function LegalPage({ title, sections }: LegalPageProps) {
  return (
    <div className="ambient min-h-svh">
      <main className="mx-auto w-full max-w-[1440px] px-5 pt-7 pb-24 lg:px-60 lg:pt-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[17px] leading-[1.45] font-medium text-petala hover:underline lg:text-[19px]"
        >
          <span aria-hidden>←</span> Voltar para a lista VIP
        </Link>

        <LogoPrimary className="mt-7 w-[187.5px] lg:mt-8 lg:w-[234.3px]" />

        <h1 className="mt-7 font-serif text-[40px] leading-none tracking-[-0.01em] text-leite lg:mt-8 lg:text-[64px] lg:tracking-[-0.015em]">
          {title}
        </h1>

        <article className="mt-7 max-w-[960px] lg:mt-8">
          <p className="text-[12px] leading-[1.5] text-leite/56">Última atualização: {site.legalUpdatedAt}</p>
          {sections.map((s, i) => (
            <section key={s.title} className="mt-3.5">
              <h2 className="text-[17px] leading-[1.45] font-medium text-leite lg:text-[21px]">
                {i + 1}. {s.title}
              </h2>
              <div className="mt-3.5 text-[15px] leading-[1.65] text-leite/78 lg:text-[16px]">{s.body}</div>
            </section>
          ))}
        </article>
      </main>
    </div>
  )
}
