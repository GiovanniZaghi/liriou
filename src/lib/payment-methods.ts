import type { PaymentMethod, StoreSettings } from './api/types'

export interface PaymentMethodOption {
  id: PaymentMethod
  label: string
}

/** Métodos na ordem exibida no checkout (os ids são os mesmos da API). */
export const PAYMENT_METHODS: PaymentMethodOption[] = [
  { id: 'pix', label: 'Pix' },
  { id: 'credit_card', label: 'Cartão de crédito' },
  { id: 'boleto', label: 'Boleto bancário' },
]

/** Prévia do total no Pix à vista (mesma regra de StoreSettings.pixPriceCents na API, que é quem cobra). */
export function pixPrice(total: number, settings: StoreSettings): number {
  const cents = Math.round(total * 100)
  return Math.round((cents * (100 - settings.pixDiscountPercent)) / 100) / 100
}

/** Motivo de recusa do cartão (status_detail do Mercado Pago) → texto para a cliente */
const REJECTION_MESSAGES: Record<string, string> = {
  rejected_by_issuer: 'O banco emissor recusou o pagamento. Tente outro cartão ou pague com Pix.',
  insufficient_amount: 'O cartão não tem limite suficiente. Tente outro cartão ou pague com Pix.',
  amount_limit_exceeded: 'O valor ultrapassa o limite do cartão. Tente outro cartão ou pague com Pix.',
  bad_filled_card_data: 'Algum dado do cartão está incorreto. Confira número, validade e código de segurança.',
  invalid_card_token: 'Os dados do cartão expiraram. Preencha de novo, por favor.',
  required_call_for_authorize: 'Seu banco pede autorização para esta compra. Ligue para ele e tente de novo.',
  card_disabled: 'Este cartão está desabilitado. Ative-o com seu banco ou use outro.',
  high_risk: 'O pagamento foi recusado por segurança. Tente outro cartão ou pague com Pix.',
  max_attempts_exceeded: 'Você atingiu o limite de tentativas. Use outro cartão ou pague com Pix.',
  invalid_installments: 'Este parcelamento não está disponível para o seu cartão.',
  processing_error: 'Não conseguimos processar o pagamento. Tente de novo em instantes.',
}

export const rejectionMessage = (detail: string) =>
  REJECTION_MESSAGES[detail] ?? 'O pagamento não foi aprovado. Tente outro cartão ou pague com Pix.'
