'use client'

import { Minus, Plus, ShoppingBag, Trash, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { formatBRL } from '@/lib/format'
import { maskCep } from '@/lib/masks'
import { cn } from '@/lib/utils'
import { Dialog } from './dialog'
import { useStore } from './store-provider'

const fieldSm =
  'min-w-0 flex-1 rounded-xl border border-borda bg-areia px-4 py-2.5 text-xs focus:border-salvia focus:outline-none'

export function CartDrawer() {
  const store = useStore()
  const router = useRouter()
  const { cart, count, settings, pending } = store
  const items = cart?.items ?? []
  const totals = cart?.totals
  const subtotal = totals?.subtotal ?? 0

  const [couponInput, setCouponInput] = useState(cart?.coupon?.code ?? '')
  const [applyingCoupon, setApplyingCoupon] = useState(false)
  const [cep, setCep] = useState('')
  const [showShipping, setShowShipping] = useState(Boolean(cart?.shippingOptionId))

  const threshold = settings.freeShippingThreshold
  const freeShipping = totals?.freeShipping ?? false
  const progress = Math.min((subtotal / threshold) * 100, 100)
  const hasUnavailable = items.some((i) => !i.available)

  async function applyCoupon(e: React.FormEvent) {
    e.preventDefault()
    if (!couponInput.trim()) return
    setApplyingCoupon(true)
    const refused = await store.applyCoupon(couponInput)
    setApplyingCoupon(false)
    if (refused) toast.error(refused)
    else toast.success('Cupom aplicado! Desconto ativado na sua sacola.')
  }

  function calculateShipping(e: React.FormEvent) {
    e.preventDefault()
    if (cep.replace(/\D/g, '').length < 8) {
      toast.error('Digite um CEP válido.')
      return
    }
    setShowShipping(true)
  }

  function checkout() {
    if (items.length === 0) return toast.error('Sua sacola está vazia.')
    if (hasUnavailable) return toast.error('Ajuste os itens sem estoque suficiente antes de continuar.')
    store.closeDialog()
    router.push('/checkout')
  }

  return (
    <Dialog label="Sacola" variant="drawer" onClose={store.closeDialog}>
      <div className="flex items-center justify-between border-b border-borda bg-white p-6">
        <h2 className="font-serif text-xl font-medium">Sua Sacola ({count})</h2>
        <button type="button" onClick={store.closeDialog} aria-label="Fechar sacola" className="p-2 text-cinza hover:text-grafite">
          <X className="size-5" aria-hidden />
        </button>
      </div>

      <div className="border-b border-borda bg-algodao p-4 text-xs">
        <p className="mb-1.5 text-center font-medium text-grafite" aria-live="polite">
          {freeShipping
            ? 'Parabéns! Você ganhou envio grátis!'
            : `Faltam ${formatBRL(totals?.missingForFreeShipping ?? threshold)} para envio grátis!`}
        </p>
        <div className="h-2 w-full overflow-hidden rounded-full bg-borda">
          <div className="h-full bg-salvia transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className={cn('flex-1 divide-y divide-borda overflow-y-auto px-6 transition-opacity', pending && 'opacity-70')} aria-busy={pending}>
        {items.length === 0 ? (
          <div className="py-16 text-center text-cinza">
            <ShoppingBag className="mx-auto mb-3 size-8 opacity-40" aria-hidden />
            <p className="text-xs">{pending ? 'Atualizando sua sacola…' : 'Sua sacola está vazia.'}</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.productId} className="flex items-center justify-between gap-4 py-4">
              <div className="size-14 shrink-0 overflow-hidden rounded-xl border border-borda bg-algodao">
                <img src={item.image} alt="" className="size-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="text-xs font-medium text-grafite">{item.name}</h3>
                <p className="mt-0.5 text-xs font-semibold text-salvia">{formatBRL(item.unitPrice)}</p>
                {!item.available && <p className="mt-0.5 text-[10px] text-rubor">Estoque insuficiente para esta quantidade</p>}
                <div className="mt-2 flex items-center gap-3">
                  <QtyButton label={`Diminuir ${item.name}`} onClick={() => store.updateQty(item.productId, -1)}>
                    <Minus className="size-3" aria-hidden />
                  </QtyButton>
                  <span className="text-xs font-medium" aria-label={`Quantidade: ${item.quantity}`}>
                    {item.quantity}
                  </span>
                  <QtyButton label={`Aumentar ${item.name}`} onClick={() => store.updateQty(item.productId, 1)}>
                    <Plus className="size-3" aria-hidden />
                  </QtyButton>
                </div>
              </div>
              <button
                type="button"
                onClick={() => store.removeFromCart(item.productId)}
                aria-label={`Remover ${item.name}`}
                className="p-2 text-cinza hover:text-rubor"
              >
                <Trash className="size-3.5" aria-hidden />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="space-y-4 border-t border-borda bg-white p-6">
        {cart?.coupon ? (
          <div
            className={cn(
              'rounded-xl border px-4 py-2.5 text-xs',
              cart.coupon.applied ? 'border-folha/30 bg-folha/10' : 'border-rubor/30 bg-rubor/5',
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <span>
                Cupom <strong className="font-semibold">{cart.coupon.code}</strong> · {cart.coupon.label}
              </span>
              <button type="button" onClick={store.removeCoupon} className="text-cinza underline hover:text-rubor">
                Remover
              </button>
            </div>
            {cart.coupon.notice && (
              <p role="status" className="mt-1 text-[11px] text-rubor">
                {cart.coupon.notice}
              </p>
            )}
          </div>
        ) : (
          <form onSubmit={applyCoupon} className="flex gap-2">
            <input
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              placeholder="Cupom (ex: LIRIOU10)"
              aria-label="Cupom de desconto"
              className={cn(fieldSm, 'uppercase')}
            />
            <button
              type="submit"
              disabled={applyingCoupon}
              className="rounded-xl bg-grafite px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-salvia disabled:opacity-60"
            >
              {applyingCoupon ? 'Aplicando…' : 'Aplicar'}
            </button>
          </form>
        )}

        {settings.shippingOptions.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold tracking-wider text-grafite uppercase">Simular envio e entrega</p>
            <form onSubmit={calculateShipping} className="flex gap-2">
              <input
                value={cep}
                onChange={(e) => setCep(maskCep(e.target.value))}
                placeholder="00000-000"
                inputMode="numeric"
                autoComplete="postal-code"
                aria-label="CEP"
                className={fieldSm}
              />
              <button type="submit" className="rounded-xl bg-salvia px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-salvia-900">
                Calcular
              </button>
            </form>
            {showShipping && (
              <fieldset className="mt-2 space-y-2 text-xs">
                <legend className="sr-only">Opções de envio</legend>
                {settings.shippingOptions.map((opt) => (
                  <label
                    key={opt.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-borda bg-areia p-2.5 hover:border-salvia has-checked:border-salvia"
                  >
                    <span className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="shipping"
                        checked={cart?.shippingOptionId === opt.id}
                        onChange={() => store.setShippingId(opt.id)}
                        className="accent-salvia"
                      />
                      {opt.label}
                    </span>
                    <span className="font-semibold whitespace-nowrap">{freeShipping ? 'Grátis' : formatBRL(opt.price)}</span>
                  </label>
                ))}
              </fieldset>
            )}
          </div>
        )}
      </div>

      <div className="space-y-3 border-t border-borda bg-white p-6">
        <Row label="Subtotal" value={formatBRL(subtotal)} />
        <Row
          label="Envio"
          value={totals?.shipping == null ? 'A calcular' : totals.shipping === 0 ? 'Grátis' : formatBRL(totals.shipping)}
        />
        {(totals?.discount ?? 0) > 0 && (
          <Row label={`Desconto (${cart?.coupon?.code})`} value={`- ${formatBRL(totals!.discount)}`} className="text-salvia" />
        )}
        <div className="flex justify-between border-t border-borda pt-2 text-base font-semibold">
          <span>Total</span>
          <span className="font-serif text-xl">{formatBRL(totals?.total ?? 0)}</span>
        </div>
        <button
          type="button"
          onClick={checkout}
          disabled={pending}
          className="mt-2 w-full rounded-full bg-salvia py-4 text-center font-medium text-white shadow-md transition-all hover:bg-salvia-900 disabled:opacity-70"
        >
          Finalizar Pedido com Segurança
        </button>
      </div>
    </Dialog>
  )
}

function Row({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={cn('flex justify-between text-xs text-cinza', className)}>
      <span>{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}

function QtyButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex size-6 items-center justify-center rounded-full bg-algodao hover:bg-salvia hover:text-white"
    >
      {children}
    </button>
  )
}
