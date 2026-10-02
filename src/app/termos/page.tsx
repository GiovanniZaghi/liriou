import type { Metadata } from 'next'
import { LegalPage, type LegalSection } from '@/components/legal/legal-page'

export const metadata: Metadata = { title: 'Termos de Uso · Líriou' }

// TODO: o Figma traz só um resumo ("íntegra em termos.html"). Substituir pela íntegra revisada juridicamente.
const SECTIONS: LegalSection[] = [
  {
    title: 'O que é a lista VIP',
    body: 'Cadastro gratuito para receber em primeira mão o aviso da pré-venda dos scrunchies Líriou. Entrar na lista não gera compra nem obrigação de compra.',
  },
  {
    title: 'Benefícios',
    body: 'Aviso antecipado, preço especial no kit completo e brinde surpresa no pedido das primeiras cadastradas. As condições, prazos e quantidades são informados na abertura da pré-venda e podem ser limitados ao estoque.',
  },
  {
    title: 'Cadastro e comunicações',
    body: 'Dados verdadeiros, um cadastro por pessoa, a partir de 18 anos. Ao se cadastrar, você aceita receber avisos da pré-venda por WhatsApp e e-mail e pode sair da lista a qualquer momento.',
  },
  {
    title: 'Compra, alterações e encerramento',
    body: 'Compra em página própria, com preço, frete, prazo e política de troca informados no momento do pedido. A Líriou pode alterar ou encerrar a lista VIP, atualizando estes termos nesta página.',
  },
]

export default function TermosPage() {
  return <LegalPage title="Termos de Uso" sections={SECTIONS} />
}
