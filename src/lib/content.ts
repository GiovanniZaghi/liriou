// Conteúdo editorial da loja (não é catálogo: produtos, preços, frete e cupons vêm da API).

export const CREATOR_KITS = [
  { value: 'kit-salvia-clean', label: 'Kit Sálvia Clean', detail: 'Scrunchie + Touca' },
  { value: 'kit-chiclete-rose', label: 'Kit Chiclete Rose', detail: 'Dupla de Scrunchies' },
  { value: 'kit-trio-completo', label: 'Kit Trio Completo', detail: 'Caixa especial presente' },
] as const

const ph = (size: string, bg: string, fg: string, text: string) =>
  `https://placehold.co/${size}/${bg}/${fg}?text=${encodeURIComponent(text).replace(/%20/g, '+')}`

export const reels = [
  {
    title: 'Ritual noturno com Scrunchie Classic',
    caption: 'Como blindar os fios antes de dormir',
    cover: ph('600x800', '6A7B6C', 'FFFFFF', 'Ritual Noturno'),
    video: ph('600x900', '6A7B6C', 'FFFFFF', 'Reel 1'),
  },
  {
    title: 'Acordando sem frizz',
    caption: 'O resultado do cetim de alta gramatura',
    cover: ph('600x800', 'F2D3D8', '2C2A29', 'Acordando Sem Frizz'),
    video: ph('600x900', 'F2D3D8', '2C2A29', 'Reel 2'),
  },
  {
    title: '5 penteados com scrunchie',
    caption: '1 scrunchie, 5 penteados sofisticados',
    cover: ph('600x800', '2C2A29', 'FFFFFF', 'Penteados Liriou'),
    video: ph('600x900', '2C2A29', 'FFFFFF', 'Reel 3'),
  },
  {
    title: 'Unboxing exclusivo Líriou',
    caption: 'O unboxing do nosso kit de pré-venda',
    cover: ph('600x800', 'E8E2DD', '2C2A29', 'Unboxing Liriou'),
    video: ph('600x900', 'E8E2DD', '2C2A29', 'Reel 4'),
  },
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
