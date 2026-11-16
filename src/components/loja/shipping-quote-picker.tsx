'use client'

import { Loader2, Truck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cartApi } from '@/lib/api/cart'
import { ApiError } from '@/lib/api/http'
import type { ShippingQuoteOption } from '@/lib/api/types'
import { formatBRL } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useStore } from './store-provider'

const days = (n: number) => (n <= 0 ? 'Prazo informado no envio' : n === 1 ? 'Chega em 1 dia útil' : `Chega em até ${n} dias úteis`)

interface ShippingQuotePickerProps {
  /** CEP com ou sem máscara; só cota com 8 dígitos */
  cep: string
  /** Avisado quando a cliente escolhe uma opção (ex.: limpar erro do formulário) */
  onSelect?: () => void
  size?: 'sm' | 'md'
}

/** Cota o frete na Frenet para o CEP e grava a opção escolhida na sacola. */
export function ShippingQuotePicker({ cep, onSelect, size = 'md' }: ShippingQuotePickerProps) {
  const store = useStore()
  const cartId = store.cart?.id
  const subtotal = store.cart?.totals.subtotal ?? 0
  const selected = store.cart?.shipping
  const digits = cep.replace(/\D/g, '')

  const [options, setOptions] = useState<ShippingQuoteOption[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [choosing, setChoosing] = useState<string | null>(null)

  // Recota quando o CEP ou os itens mudam (mudar itens invalida o frete na API)
  useEffect(() => {
    if (!cartId || digits.length !== 8 || subtotal <= 0) {
      setOptions(null)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    cartApi
      .quoteShipping(cartId, digits)
      .then((r) => {
        if (cancelled) return
        setOptions(r.options)
        if (!r.options.length) setError('Nenhuma transportadora atende este CEP no momento.')
      })
      .catch((err) => {
        if (cancelled) return
        setOptions(null)
        setError(err instanceof ApiError ? (Object.values(err.fields ?? {})[0] ?? err.message) : 'Não foi possível calcular o frete.')
      })
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [cartId, digits, subtotal])

  async function choose(option: ShippingQuoteOption) {
    setChoosing(option.serviceCode)
    const reason = await store.selectShipping(digits, option.serviceCode)
    setChoosing(null)
    if (reason) setError(reason)
    else {
      setError(null)
      onSelect?.()
    }
  }

  const text = size === 'sm' ? 'text-xs' : 'text-sm'

  if (digits.length !== 8) return null

  return (
    <div className="space-y-2" aria-busy={loading}>
      {loading && (
        <p className={cn('flex items-center gap-2 text-cinza', text)}>
          <Loader2 className="size-4 animate-spin" aria-hidden /> Calculando frete…
        </p>
      )}

      {!loading && options && options.length > 0 && (
        <fieldset className="space-y-2">
          <legend className="sr-only">Opções de envio</legend>
          {options.map((opt) => {
            const checked = selected?.serviceCode === opt.serviceCode && selected.cep === digits
            return (
              <label
                key={opt.serviceCode}
                className={cn(
                  'flex cursor-pointer items-center justify-between gap-3 rounded-xl border bg-white p-3 transition-colors hover:border-salvia',
                  checked ? 'border-salvia ring-1 ring-salvia' : 'border-borda',
                  text,
                )}
              >
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shipping"
                    checked={checked}
                    disabled={choosing !== null}
                    onChange={() => choose(opt)}
                    className="accent-salvia"
                  />
                  <span>
                    <span className="block font-medium text-grafite">{opt.label}</span>
                    <span className="block text-[11px] text-cinza">{days(opt.deliveryDays)}</span>
                  </span>
                </span>
                <span className="flex items-center gap-2 font-semibold whitespace-nowrap text-grafite">
                  {choosing === opt.serviceCode && <Loader2 className="size-3.5 animate-spin" aria-hidden />}
                  {opt.price === 0 ? (
                    <span className="text-folha">
                      Grátis {opt.originalPrice > 0 && <s className="ml-1 font-normal text-cinza">{formatBRL(opt.originalPrice)}</s>}
                    </span>
                  ) : (
                    formatBRL(opt.price)
                  )}
                </span>
              </label>
            )
          })}
        </fieldset>
      )}

      {error && (
        <p role="alert" className="flex items-center gap-2 text-[11px] text-rubor">
          <Truck className="size-3.5 shrink-0" aria-hidden /> {error}
        </p>
      )}
    </div>
  )
}
