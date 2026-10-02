import type { Metadata } from 'next'
import { LegalPage, type LegalSection } from '@/components/legal/legal-page'
import { site } from '@/lib/site'

export const metadata: Metadata = { title: 'Aviso de Privacidade · Líriou' }

// TODO: o Figma traz só um resumo ("íntegra em privacidade.html"). Substituir pela íntegra revisada juridicamente.
const SECTIONS: LegalSection[] = [
  {
    title: 'Dados coletados',
    body: 'Nome, e-mail, WhatsApp, a resposta opcional sobre o seu cabelo e a data e hora do seu consentimento.',
  },
  {
    title: 'Finalidades e bases legais',
    body: 'Avisos da pré-venda e comunicação da Líriou, com base no seu consentimento (art. 7º, I, da LGPD). A resposta opcional nos ajuda a entender o que mais incomoda quem usa scrunchies.',
  },
  {
    title: 'Compartilhamento e proteção',
    body: 'Não vendemos dados. Ferramentas de envio de mensagens e de hospedagem tratam os dados apenas em nosso nome, com medidas de segurança adequadas.',
  },
  {
    title: 'Seus direitos',
    body: (
      <>
        Acesso, correção, exclusão e revogação do consentimento a qualquer momento, pelo e-mail{' '}
        <a href={`mailto:${site.contactEmail}`} className="text-petala underline underline-offset-2">
          {site.contactEmail}
        </a>
        .
      </>
    ),
  },
]

export default function PrivacidadePage() {
  return <LegalPage title="Aviso de Privacidade" sections={SECTIONS} />
}
