// Conteúdo editorial da loja (não é catálogo: produtos, preços, frete e cupons vêm da API).

export const CREATOR_KITS = [
  { value: 'kit-salvia-clean', label: 'Kit Sálvia Clean', detail: 'Scrunchie + Touca' },
  { value: 'kit-chiclete-rose', label: 'Kit Chiclete Rose', detail: 'Dupla de Scrunchies' },
  { value: 'kit-trio-completo', label: 'Kit Trio Completo', detail: 'Caixa especial presente' },
] as const

/** Vídeos em public/videos. Legenda é opcional (aparece no card e no vídeo aberto). */
export const reels: { title: string; caption?: string; video: string }[] = [
  { title: 'Vídeo Líriou 1', video: '/videos/reel-1.mp4' },
  { title: 'Vídeo Líriou 2', video: '/videos/reel-2.mp4' },
  { title: 'Vídeo Líriou 3', video: '/videos/reel-3.mp4' },
]

export type Reel = (typeof reels)[number]

export const testimonials = [
  {
    quote:
      'A qualidade do cetim é surreal. Meu cabelo acorda sem um único fio de frizz e a scrunchie no pulso é meu acessório favorito do dia.',
    author: 'Beatriz M., São Paulo',
  },
  {
    quote:
      'Comprei o Kit Noite Perfeita e a touca dupla face mudou completamente minha rotina de skincare. O acabamento em alfaiataria é impecável.',
    author: 'Camila R., Poá',
  },
  {
    quote:
      'A embalagem é uma experiência à parte. Parece que recebemos um presente de uma marca internacional de luxo. Sou fã número um!',
    author: 'Sofia L., Campinas',
  },
]
