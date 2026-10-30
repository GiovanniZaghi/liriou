// Catálogo provisório da loja: depois sai do banco e passa a ser gerido pelo dashboard.

export interface Product {
  id: string
  name: string
  price: number
  colorName: string
  colorHex: string
  badge: string
  image: string
  hoverImage: string
  gallery: string[]
  description: string
}

export interface Kit {
  productId: string
  tag: string
  tagClassName: string
  title: string
  contents: string
  perks: string[]
  note: string
}

export interface ShippingOption {
  id: string
  label: string
  price: number
}

export const FREE_SHIPPING_THRESHOLD = 150
export const INSTALLMENTS = 3

export const COUPONS: Record<string, number> = {
  LIRIOU10: 0.1,
}

export const SHIPPING_OPTIONS: ShippingOption[] = [
  { id: 'motoboy', label: 'Motoboy Expresso (São Paulo e região)', price: 25 },
  { id: 'correios', label: 'Correios / Envio padrão', price: 18 },
]

export const CREATOR_KITS = [
  { value: 'kit-salvia-clean', label: 'Kit Sálvia Clean', detail: 'Scrunchie + Touca' },
  { value: 'kit-chiclete-rose', label: 'Kit Chiclete Rose', detail: 'Dupla de Scrunchies' },
  { value: 'kit-trio-completo', label: 'Kit Trio Completo', detail: 'Caixa especial presente' },
] as const

const ph = (size: string, bg: string, fg: string, text: string) =>
  `https://placehold.co/${size}/${bg}/${fg}?text=${encodeURIComponent(text).replace(/%20/g, '+')}`

export const products: Product[] = [
  {
    id: 'scrunchie-classica-salvia',
    name: 'Scrunchie Clássica Alta Gramatura',
    price: 49.9,
    colorName: 'Verde Sálvia',
    colorHex: '#6A7B6C',
    badge: 'Best Seller',
    image: ph('500x600', '6A7B6C', 'FFFFFF', 'Lirio.u Salvia'),
    hoverImage: ph('500x600', '546356', 'FFFFFF', 'Uso Real Salvia'),
    gallery: [ph('600x600', '6A7B6C', 'FFFFFF', 'Salvia Detalhe'), ph('600x600', 'F4EFEB', '2C2A29', 'Uso Real')],
    description:
      'Desenvolvida com cetim de alta gramatura e etiqueta de alfaiataria. Garante zero frizz e elegância em qualquer produção, com acabamento impecável.',
  },
  {
    id: 'scrunchie-chiclete-rose',
    name: 'Scrunchie Chiclete Rose',
    price: 49.9,
    colorName: 'Rosa Chiclete',
    colorHex: '#F2D3D8',
    badge: 'Exclusivo',
    image: ph('500x600', 'F2D3D8', '2C2A29', 'Lirio.u Pink'),
    hoverImage: ph('500x600', 'FAF0F2', '2C2A29', 'Uso Real Pink'),
    gallery: [ph('600x600', 'F2D3D8', '2C2A29', 'Pink Detalhe'), ph('600x600', 'F4EFEB', '2C2A29', 'Uso Real')],
    description:
      'O toque de cor perfeito para a estética "clean girl". Zero atrito: não marca e cuida dos fios no uso diário ou noturno.',
  },
  {
    id: 'kit-noite-perfeita',
    name: 'Kit Noite Perfeita (Touca + Scrunchie)',
    price: 119.9,
    colorName: 'Sálvia & Off-White',
    colorHex: '#6A7B6C',
    badge: 'Essencial Noturno',
    image: ph('500x600', '6A7B6C', 'FFFFFF', 'Kit Noite Perfeita'),
    hoverImage: ph('500x600', 'F4EFEB', '2C2A29', 'Touca Uso'),
    gallery: [ph('600x600', '6A7B6C', 'FFFFFF', 'Touca Detalhe'), ph('600x600', 'F4EFEB', '2C2A29', 'Touca Uso')],
    description:
      'O ápice do ritual de alta performance noturna. Proteção total contra o frizz e a quebra capilar enquanto você descansa.',
  },
  {
    id: 'kit-trio-ritual',
    name: 'Kit Trio Ritual High-Ticket',
    price: 129.9,
    colorName: 'Trio Variado Exclusivo',
    colorHex: '#D8D2CD',
    badge: 'High Ticket',
    image: ph('500x600', 'E8E2DD', '2C2A29', 'Kit Trio Lirio.u'),
    hoverImage: ph('500x600', 'D8D2CD', '2C2A29', 'Caixa Exclusiva'),
    gallery: [ph('600x600', 'E8E2DD', '2C2A29', 'Kit Detalhe'), ph('600x600', 'F4EFEB', '2C2A29', 'Caixa Exclusiva')],
    description:
      'O kit completo com as cores essenciais da temporada, na nossa caixa especial de presente. O presente perfeito para quem você mais ama.',
  },
]

export const kits: Kit[] = [
  {
    productId: 'kit-noite-perfeita',
    tag: 'Mais desejado',
    tagClassName: 'bg-rosa-50',
    title: 'Kit Noite Perfeita',
    contents: 'Contém: 1 Touca Dupla Face em Cetim + 1 Scrunchie Clássica.',
    perks: ['Proteção total contra quebra capilar', 'Embalagem presenteável exclusiva'],
    note: 'Economize R$ 10,00',
  },
  {
    productId: 'kit-trio-ritual',
    tag: 'Colecionador',
    tagClassName: 'bg-salvia/20',
    title: 'Kit Trio Ritual High-Ticket',
    contents: 'Contém: 3 Scrunchies Clássicas de alta gramatura em cores selecionadas.',
    perks: ['Versatilidade para o cabelo e o pulso', 'Caixa especial de colecionador'],
    note: 'Edição limitada',
  },
]

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

export const getProduct = (id: string) => products.find((p) => p.id === id)
