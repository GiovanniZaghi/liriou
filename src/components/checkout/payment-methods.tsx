'use client'

import { CheckCircle2, Copy, ExternalLink, Loader2, Lock } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { ApiError } from '@/lib/api/http'
import { paymentsApi } from '@/lib/api/payments'
import type { Order, Payment, PaymentMethod, StartPaymentInput, StoreSettings } from '@/lib/api/types'
import { formatBRL } from '@/lib/format'
import { PAYMENT_METHODS, pixPrice, rejectionMessage } from '@/lib/payment-methods'
import { cn } from '@/lib/utils'
import { CardPaymentBrick, type CardFormData } from './card-payment-brick'
import { BoletoBadge, CardBrands } from './payment-brands'

const POLL_MS = 5_000

interface PaymentMethodsProps {
  order: Order
  settings: StoreSettings
  /** Chamado quando o pagamento é aprovado */
  onPaid: (payment: Payment) => void
}

/** Escolha e execução do pagamento (Checkout Transparente do Mercado Pago). */
export function PaymentMethods({ order, settings, onPaid }: PaymentMethodsProps) {
  const [selected, setSelected] = useState<PaymentMethod>('pix')
  const [payment, setPayment] = useState<Payment | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  /** Remonta o formulário do cartão após uma recusa (o token é de uso único) */
  const [cardAttempt, setCardAttempt] = useState(0)
  const total = order.totals.total

  const receive = useCallback(
    (p: Payment | null) => {
      setPayment(p)
      if (!p) return
      if (p.status === 'approved') onPaid(p)
      else if (p.status === 'rejected') {
        setError(rejectionMessage(p.statusDetail))
        setCardAttempt((n) => n + 1)
      }
    },
    [onPaid],
  )

  // Retoma um Pix/boleto já gerado (ex.: a cliente recarregou a página)
  useEffect(() => {
    paymentsApi
      .latest(order.id)
      .then((p) => {
        if (p?.status === 'pending' && p.method !== 'credit_card') setSelected(p.method)
        if (p?.status === 'approved') onPaid(p)
        else setPayment(p)
      })
      .catch(() => null)
      .finally(() => setLoading(false))
  }, [order.id, onPaid])

  // Aguardando Pix: consulta a cada 5s até o banco confirmar
  const waitingPix = payment?.status === 'pending' && payment.method === 'pix'
  const refresh = useCallback(() => paymentsApi.latest(order.id).then(receive).catch(() => null), [order.id, receive])
  useEffect(() => {
    if (!waitingPix) return
    const timer = setInterval(refresh, POLL_MS)
    return () => clearInterval(timer)
  }, [waitingPix, refresh])

  async function start(input: StartPaymentInput) {
    setBusy(true)
    setError(null)
    try {
      receive(await paymentsApi.start(order.id, input))
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Não foi possível iniciar o pagamento.'
      if (input.method === 'credit_card') {
        setError(message)
        setCardAttempt((n) => n + 1)
      } else toast.error(message)
    } finally {
      setBusy(false)
    }
  }

  const payCard = (data: CardFormData) =>
    start({ method: 'credit_card', card: { token: data.token, brand: data.payment_method_id, installments: Number(data.installments) } })

  if (loading) {
    return (
      <div className="flex justify-center py-10 text-cinza">
        <Loader2 className="size-5 animate-spin" aria-label="Carregando formas de pagamento" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {settings.pixDiscountPercent > 0 && (
        <p className="flex items-center gap-3 rounded-2xl border border-folha/30 bg-folha/10 px-4 py-3 text-sm font-medium text-noite-900">
          <CheckCircle2 className="size-5 shrink-0 text-folha" aria-hidden />
          Desbloqueie {settings.pixDiscountPercent}% OFF a mais em pagamento via PIX
        </p>
      )}

      <fieldset className="overflow-hidden rounded-2xl border border-borda bg-white">
        <legend className="sr-only">Forma de pagamento</legend>
        {PAYMENT_METHODS.map((m, i) => {
          const active = m.id === selected
          const current = payment?.method === m.id && payment.status === 'pending' ? payment : null
          return (
            <div
              key={m.id}
              className={cn(
                'transition-colors',
                i > 0 && 'border-t border-borda',
                active && 'relative z-10 -m-px rounded-2xl border-2 border-noite-900 bg-areia',
              )}
            >
              <label className="flex cursor-pointer items-center gap-4 px-5 py-4">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={m.id}
                  checked={active}
                  onChange={() => {
                    setSelected(m.id)
                    setError(null)
                  }}
                  className="peer sr-only"
                />
                <span
                  aria-hidden
                  className={cn(
                    'flex size-5 shrink-0 items-center justify-center rounded-full border-[1.5px] peer-focus-visible:ring-2 peer-focus-visible:ring-rubor peer-focus-visible:ring-offset-2',
                    active ? 'border-noite-900' : 'border-borda bg-white',
                  )}
                >
                  {active && <span className="size-2.5 rounded-full bg-noite-900" />}
                </span>
                <span className="flex-1 text-[15px] font-medium text-grafite">{m.label}</span>
                {m.id === 'credit_card' && <CardBrands />}
                {m.id === 'boleto' && <BoletoBadge />}
              </label>

              {active && (
                <div className="space-y-4 px-5 pb-5 sm:pl-14">
                  {m.id === 'pix' &&
                    (current?.pix ? (
                      <PixInstructions payment={current} onCheck={refresh} />
                    ) : (
                      <>
                        <PixSummary total={total} settings={settings} />
                        <PayButton busy={busy} onClick={() => start({ method: 'pix' })}>
                          Pagar {formatBRL(pixPrice(total, settings))} com Pix
                        </PayButton>
                      </>
                    ))}

                  {m.id === 'credit_card' && (
                    <>
                      <p className="text-xs leading-relaxed text-cinza">
                        Em até <strong className="text-grafite">{settings.installments}x</strong>. Os dados do cartão são digitados
                        no ambiente seguro do Mercado Pago: nada fica salvo na Líriou.
                      </p>
                      {error && (
                        <p role="alert" className="rounded-xl border border-rubor/30 bg-rubor/5 px-4 py-3 text-xs text-rubor">
                          {error}
                        </p>
                      )}
                      <CardPaymentBrick
                        key={cardAttempt}
                        amount={total}
                        email={order.customer.email}
                        maxInstallments={settings.installments}
                        onSubmit={payCard}
                      />
                    </>
                  )}

                  {m.id === 'boleto' &&
                    (current?.boleto ? (
                      <BoletoInstructions payment={current} />
                    ) : (
                      <>
                        <p className="text-xs leading-relaxed text-cinza">
                          Vence em 3 dias úteis. A confirmação leva até 2 dias úteis depois do pagamento, e o envio sai em seguida.
                        </p>
                        <PayButton busy={busy} onClick={() => start({ method: 'boleto' })}>
                          Gerar boleto de {formatBRL(total)}
                        </PayButton>
                      </>
                    ))}
                </div>
              )}
            </div>
          )
        })}
      </fieldset>

      <p className="flex items-center justify-center gap-1.5 text-[11px] text-cinza">
        <Lock className="size-3" aria-hidden /> Pagamento processado em ambiente seguro pelo Mercado Pago
      </p>
    </div>
  )
}

function PayButton({ busy, onClick, children }: { busy: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-salvia py-4 font-medium text-white shadow-md transition-all hover:bg-salvia-900 disabled:opacity-70"
    >
      {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Lock className="size-4" aria-hidden />}
      {busy ? 'Gerando…' : children}
    </button>
  )
}

function PixSummary({ total, settings }: { total: number; settings: StoreSettings }) {
  return (
    <div className="text-xs leading-relaxed text-cinza">
      {settings.pixDiscountPercent > 0 && (
        <p className="mb-1 text-sm text-grafite">
          <span className="mr-2 text-cinza line-through">{formatBRL(total)}</span>
          <strong className="font-semibold text-folha">{formatBRL(pixPrice(total, settings))}</strong> à vista (
          {settings.pixDiscountPercent}% OFF)
        </p>
      )}
      <p>O QR Code e o código copia e cola aparecem a seguir. A aprovação é na hora.</p>
    </div>
  )
}

async function copy(text: string, what: string) {
  try {
    await navigator.clipboard.writeText(text)
    toast.success(`${what} copiado!`)
  } catch {
    toast.error('Não foi possível copiar. Selecione o código e copie manualmente.')
  }
}

const formatTime = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Sao_Paulo' })

function PixInstructions({ payment, onCheck }: { payment: Payment; onCheck: () => void }) {
  const pix = payment.pix!
  return (
    <div className="space-y-4 text-center sm:text-left">
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
        {pix.qrCodeBase64 && (
          <img
            src={`data:image/png;base64,${pix.qrCodeBase64}`}
            alt="QR Code do Pix"
            className="size-44 shrink-0 rounded-2xl border border-borda bg-white p-2"
          />
        )}
        <div className="space-y-2 text-xs leading-relaxed text-cinza">
          <p className="text-sm text-grafite">
            Pague <strong className="font-semibold text-folha">{formatBRL(payment.amount)}</strong> no app do seu banco
          </p>
          <p>Escaneie o QR Code ou use o Pix copia e cola. A confirmação aparece aqui sozinha.</p>
          {payment.expiresAt && <p>Válido até {formatTime(payment.expiresAt)}.</p>}
          <p className="flex items-center justify-center gap-2 font-medium text-noite-900 sm:justify-start" aria-live="polite">
            <Loader2 className="size-3.5 animate-spin" aria-hidden /> Aguardando pagamento…
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <input
          readOnly
          value={pix.qrCode}
          aria-label="Código Pix copia e cola"
          onFocus={(e) => e.currentTarget.select()}
          className="min-w-0 flex-1 truncate rounded-xl border border-borda bg-white px-3 py-3 font-mono text-[11px] text-grafite"
        />
        <button
          type="button"
          onClick={() => copy(pix.qrCode, 'Código Pix')}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-salvia px-4 text-xs font-medium text-white hover:bg-salvia-900"
        >
          <Copy className="size-3.5" aria-hidden /> Copiar
        </button>
      </div>
      <button type="button" onClick={onCheck} className="text-xs font-medium text-noite-900 underline underline-offset-2 hover:text-rubor">
        Já paguei, verificar agora
      </button>
    </div>
  )
}

function BoletoInstructions({ payment }: { payment: Payment }) {
  const boleto = payment.boleto!
  return (
    <div className="space-y-3 text-xs leading-relaxed text-cinza">
      <p className="text-sm text-grafite">
        Boleto de <strong className="font-semibold">{formatBRL(payment.amount)}</strong> gerado
        {payment.expiresAt && <> · vence em {formatTime(payment.expiresAt)}</>}
      </p>
      {boleto.digitableLine && (
        <div className="flex gap-2">
          <input
            readOnly
            value={boleto.digitableLine}
            aria-label="Linha digitável do boleto"
            onFocus={(e) => e.currentTarget.select()}
            className="min-w-0 flex-1 truncate rounded-xl border border-borda bg-white px-3 py-3 font-mono text-[11px] text-grafite"
          />
          <button
            type="button"
            onClick={() => copy(boleto.digitableLine!, 'Código de barras')}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-salvia px-4 text-xs font-medium text-white hover:bg-salvia-900"
          >
            <Copy className="size-3.5" aria-hidden /> Copiar
          </button>
        </div>
      )}
      <a
        href={boleto.ticketUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-salvia py-4 text-sm font-medium text-white shadow-md hover:bg-salvia-900"
      >
        <ExternalLink className="size-4" aria-hidden /> Abrir boleto
      </a>
      <p>Assim que o banco confirmar o pagamento (até 2 dias úteis), seu pedido segue para envio.</p>
    </div>
  )
}
