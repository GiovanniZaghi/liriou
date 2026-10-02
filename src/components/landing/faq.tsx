import Link from 'next/link'
import type { ReactNode } from 'react'
import { SectionHeading } from '@/components/ui/section-heading'

// TODO: respostas não estão no Figma (só as perguntas) — validar texto com a cliente
const QUESTIONS: { q: string; a: ReactNode }[] = [
  {
    q: 'Quando abre a pré-venda?',
    a: 'A data sai primeiro para quem está na lista. Assim que a pré-venda abrir, o link chega no seu WhatsApp antes da abertura pública.',
  },
  {
    q: 'Entrar na lista tem algum custo?',
    a: 'Não. O cadastro é gratuito e não obriga a nenhuma compra. Você só compra se quiser, quando a pré-venda abrir.',
  },
  {
    q: 'Como funciona o brinde?',
    a: 'As primeiras cadastradas que fizerem o pedido na pré-venda recebem um brinde surpresa junto com o kit. A quantidade é limitada e as condições chegam com o link da pré-venda.',
  },
  {
    q: 'O que vocês fazem com meus dados?',
    a: (
      <>
        Usamos só para avisar sobre a pré-venda e falar da Líriou, conforme a LGPD. Não vendemos nem repassamos seus
        dados, e você pode sair da lista quando quiser. Detalhes no{' '}
        <Link href="/privacidade" className="text-petala underline underline-offset-2">
          Aviso de Privacidade
        </Link>
        .
      </>
    ),
  },
]

/** Perguntas frequentes · FAQ: item (44:70) — `<details name="faq">` nativo: abrir um fecha os outros. */
export function Faq() {
  return (
    <section aria-labelledby="faq-titulo" className="pt-[72px] lg:pt-[120px]">
      <SectionHeading id="faq-titulo" title="Perguntas" accent="frequentes" />
      <div className="mx-auto mt-3 max-w-[760px] border-t border-petala/18 pt-4 lg:pt-7" data-reveal>
        {QUESTIONS.map(({ q, a }) => (
          <details key={q} name="faq" className="faq border-b border-petala/18">
            <summary className="flex cursor-pointer items-center justify-between gap-4 px-0.5 py-5">
              <span className="text-[17px] leading-[1.35] font-medium text-leite">{q}</span>
              <span aria-hidden className="faq-chevron relative h-[7px] w-[14px] shrink-0">
                <span className="absolute inset-[-10.71%_-5.36%]">
                  <img alt="" className="block size-full max-w-none" src="/figma/chevron-faq.svg" />
                </span>
              </span>
            </summary>
            <p className="max-w-[640px] px-0.5 pb-5 text-[15px] leading-[1.55] text-leite/78">{a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
