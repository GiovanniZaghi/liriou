import type { OrderStatus, PaymentMethod, PaymentStatus } from './api/types'

/** Rótulo e cor de cada status do pedido. */
export const ORDER_STATUS: Record<OrderStatus, { label: string; tone: string }> = {
  aguardando_pagamento: { label: 'Aguardando pagamento', tone: 'bg-[#fde9c8] text-[#8a5a00]' },
  pago: { label: 'Pago', tone: 'bg-folha/12 text-folha' },
  cancelado: { label: 'Cancelado', tone: 'bg-linho text-musgo' },
}

export const ORDER_STATUS_OPTIONS = (Object.keys(ORDER_STATUS) as OrderStatus[]).map((value) => ({
  value,
  label: ORDER_STATUS[value].label,
}))

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  pix: 'Pix',
  credit_card: 'Cartão',
  boleto: 'Boleto',
}

export const PAYMENT_STATUS: Record<PaymentStatus, { label: string; tone: string }> = {
  pending: { label: 'Pendente', tone: 'text-[#8a5a00]' },
  approved: { label: 'Aprovado', tone: 'text-folha' },
  rejected: { label: 'Recusado', tone: 'text-rubor' },
  cancelled: { label: 'Cancelado', tone: 'text-musgo' },
  refunded: { label: 'Estornado', tone: 'text-musgo' },
}

/** Status de envio da Frenet (código ou nome, conforme a origem) */
const SHIPMENT_STATUS_LABEL: Record<string, string> = {
  '1': 'Criado',
  Criado: 'Criado',
  '2': 'Aguardando pagamento',
  PendentePagamento: 'Aguardando pagamento',
  '3': 'Falha no pagamento',
  FalhaPagamento: 'Falha no pagamento',
  '4': 'Etiqueta paga',
  SucessoPagamento: 'Etiqueta paga',
  '5': 'Postado',
  Postado: 'Postado',
  '7': 'Cancelado',
  Cancelado: 'Cancelado',
  '18': 'No ponto de postagem',
}

export const shipmentStatusLabel = (status: string) => SHIPMENT_STATUS_LABEL[status] ?? status
