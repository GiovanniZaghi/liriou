export const site = {
  name: 'Líriou Scrunchies',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  // TODO: confirmar e-mail oficial de contato/encarregado (LGPD) com a cliente
  contactEmail: 'contato@liriou.com.br',
  legalUpdatedAt: '28 de setembro de 2026',
} as const

export const shareMessage =
  'Entrei na lista VIP da Líriou: scrunchies de cetim com preço especial e brinde na pré-venda. Entra também:'

/** Chave do localStorage para a preferência "Pausar animações". */
export const MOTION_STORAGE_KEY = 'liriou:motion'
