'use client'

import { Loader2, Pencil, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { cartApi } from '@/lib/api/cart'
import { ApiError } from '@/lib/api/http'
import { ordersApi } from '@/lib/api/orders'
import type { CheckoutAddress, CheckoutCustomer } from '@/lib/api/types'
import {
  clearDraft,
  EMPTY_ADDRESS,
  EMPTY_CUSTOMER,
  lookupCep,
  readDraft,
  saveDraft,
  UFS,
  validateAddress,
  validateCustomer,
  type Errors,
} from '@/lib/checkout'
import { formatBRL } from '@/lib/format'
import { maskCep, maskCpf, maskPhone } from '@/lib/masks'
import { cn } from '@/lib/utils'
import { useStore } from '../loja/store-provider'
import { btnPrimary } from '../loja/styles'
import { CheckoutField } from './checkout-field'
import { CheckoutSteps } from './checkout-steps'
import { OrderSummary } from './order-summary'

type Step = 0 | 1 | 2

export function CheckoutFlow() {
  const router = useRouter()
  const store = useStore()
  const { cart, cartReady, settings } = store

  const [step, setStep] = useState<Step>(0)
  const [customer, setCustomer] = useState<CheckoutCustomer>(EMPTY_CUSTOMER)
  const [address, setAddress] = useState<CheckoutAddress>(EMPTY_ADDRESS)
  const [customerErrors, setCustomerErrors] = useState<Errors>({})
  const [addressErrors, setAddressErrors] = useState<Errors>({})
  const [shippingError, setShippingError] = useState<string>()
  const [lookingUpCep, setLookingUpCep] = useState(false)
  const [placing, setPlacing] = useState(false)
  const [saving, setSaving] = useState(false)
  const draftLoaded = useRef(false)
  const topRef = useRef<HTMLDivElement>(null)

  // Rascunho: recupera o que foi digitado antes e salva a cada mudança
  useEffect(() => {
    const draft = readDraft()
    if (draft) {
      setCustomer(draft.customer)
      setAddress(draft.address)
    }
    draftLoaded.current = true
  }, [])
  useEffect(() => {
    if (draftLoaded.current) saveDraft({ customer, address })
  }, [customer, address])

  function goTo(next: Step) {
    setStep(next)
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (!cartReady) {
    return (
      <div className="flex justify-center py-32 text-cinza">
        <Loader2 className="size-6 animate-spin" aria-label="Carregando sua sacola" />
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <ShoppingBag className="mx-auto mb-4 size-10 text-cinza/50" aria-hidden />
        <h1 className="font-serif text-2xl text-grafite">Sua sacola está vazia</h1>
        <p className="mt-2 text-sm text-cinza">Escolha seus favoritos na vitrine para finalizar a compra.</p>
        <Link href="/#colecao" className={`${btnPrimary} mt-6`}>
          Ir para a vitrine
        </Link>
      </div>
    )
  }

  const unavailable = cart.items.filter((i) => !i.available)
  const setC = (k: keyof CheckoutCustomer, v: string) => {
    setCustomer((p) => ({ ...p, [k]: v }))
    if (customerErrors[k]) setCustomerErrors((e) => ({ ...e, [k]: '' }))
  }
  const setA = (k: keyof CheckoutAddress, v: string) => {
    setAddress((p) => ({ ...p, [k]: v }))
    if (addressErrors[k]) setAddressErrors((e) => ({ ...e, [k]: '' }))
  }

  async function submitIdentification(e: React.FormEvent) {
    e.preventDefault()
    const errors = validateCustomer(customer)
    setCustomerErrors(errors)
    if (Object.keys(errors).length) return focusFirst(errors)

    setSaving(true)
    const ok = await saveStep(() => cartApi.saveCheckoutCustomer(cart!.id, customer), setCustomerErrors)
    setSaving(false)
    if (!ok) return
    // Quem recebe começa como a própria compradora
    if (!address.recipient) setAddress((a) => ({ ...a, recipient: customer.name.trim() }))
    goTo(1)
  }

  /** Registra a etapa concluída na API (acompanhamento no dashboard). */
  async function saveStep(call: () => Promise<unknown>, setFieldErrors: (e: Errors) => void) {
    try {
      await call()
      return true
    } catch (err) {
      if (err instanceof ApiError && err.fields) {
        setFieldErrors(err.fields)
        focusFirst(err.fields)
        return false
      }
      if (err instanceof ApiError && err.code === 'CART_NOT_FOUND') {
        store.clearCart()
        toast.error('Sua sacola expirou. Adicione os produtos novamente.')
        return false
      }
      toast.error(err instanceof ApiError ? err.message : 'Não foi possível continuar. Tente de novo.')
      return false
    }
  }

  async function handleCep(value: string) {
    const masked = maskCep(value)
    setA('cep', masked)
    if (masked.replace(/\D/g, '').length !== 8) return
    setLookingUpCep(true)
    const found = await lookupCep(masked)
    setLookingUpCep(false)
    if (!found) {
      toast.error('Não encontramos esse CEP. Preencha o endereço manualmente.')
      return
    }
    setAddress((a) => ({ ...a, ...found }))
    setAddressErrors({})
    document.getElementById('co-number')?.focus()
  }

  async function submitDelivery(e: React.FormEvent) {
    e.preventDefault()
    const errors = validateAddress(address)
    setAddressErrors(errors)
    const shippingId = cart?.shippingOptionId
    setShippingError(shippingId ? undefined : 'Escolha uma opção de envio')
    if (Object.keys(errors).length) return focusFirst(errors)
    if (!shippingId) return

    setSaving(true)
    const ok = await saveStep(() => cartApi.saveCheckoutDelivery(cart!.id, address, shippingId), (fields) => {
      const { shippingOptionId, ...rest } = fields
      if (shippingOptionId) setShippingError(shippingOptionId)
      setAddressErrors(rest)
    })
    setSaving(false)
    if (ok) goTo(2)
  }

  async function placeOrder() {
    if (!cart?.shippingOptionId) return goTo(1)
    if (unavailable.length) return toast.error('Ajuste os itens sem estoque suficiente antes de continuar.')
    setPlacing(true)
    try {
      const order = await ordersApi.place({
        cartId: cart.id,
        customer,
        address,
        shippingOptionId: cart.shippingOptionId,
      })
      // A sacola virou pedido: limpa sacola e rascunho deste navegador
      store.clearCart()
      clearDraft()
      router.replace(`/checkout/pagamento/${order.id}`)
    } catch (err) {
      setPlacing(false)
      handlePlaceError(err)
    }
  }

  function handlePlaceError(err: unknown) {
    if (!(err instanceof ApiError)) return toast.error('Não foi possível criar o pedido. Tente de novo.')
    if (err.fields) {
      const c: Errors = {}
      const a: Errors = {}
      for (const [key, msg] of Object.entries(err.fields)) {
        const [scope, field] = key.split('.')
        if (scope === 'customer') c[field] = msg
        else if (scope === 'address') a[field] = msg
        else if (key === 'shippingOptionId') setShippingError(msg)
      }
      setCustomerErrors(c)
      setAddressErrors(a)
      goTo(Object.keys(c).length ? 0 : 1)
      return toast.error('Confira os dados destacados.')
    }
    if (err.code === 'CART_NOT_FOUND' || err.code === 'EMPTY_CART') {
      store.clearCart()
      return toast.error('Sua sacola expirou. Adicione os produtos novamente.')
    }
    toast.error(err.message)
  }

  return (
    <div ref={topRef} className="mx-auto max-w-6xl scroll-mt-4 px-4 py-10 sm:px-6">
      <CheckoutSteps current={step} onSelect={(i) => goTo(i as Step)} />

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div>
          {step === 0 && (
            <form onSubmit={submitIdentification} noValidate className="rounded-3xl border border-borda bg-white p-6 shadow-sm sm:p-8">
              <StepTitle title="Identificação" subtitle="Usamos estes dados para emitir a nota e falar com você sobre o pedido." />
              <div className="grid gap-4 sm:grid-cols-2">
                <CheckoutField className="sm:col-span-2" label="Nome completo" name="name" autoComplete="name" required
                  value={customer.name} error={customerErrors.name} onChange={(v) => setC('name', v)} />
                <CheckoutField label="E-mail" name="email" type="email" autoComplete="email" required
                  value={customer.email} error={customerErrors.email} onChange={(v) => setC('email', v)}
                  hint="Enviamos a confirmação para cá" />
                <CheckoutField label="WhatsApp / Telefone" name="phone" type="tel" autoComplete="tel-national" required
                  inputMode="tel" placeholder="(11) 91234-5678"
                  value={customer.phone} error={customerErrors.phone} onChange={(v) => setC('phone', maskPhone(v))} />
                <CheckoutField label="CPF" name="cpf" inputMode="numeric" required placeholder="000.000.000-00"
                  value={customer.cpf} error={customerErrors.cpf} onChange={(v) => setC('cpf', maskCpf(v))}
                  hint="Necessário para a nota fiscal" />
              </div>
              <StepActions primary="Continuar para entrega" loading={saving} />
            </form>
          )}

          {step === 1 && (
            <form onSubmit={submitDelivery} noValidate className="rounded-3xl border border-borda bg-white p-6 shadow-sm sm:p-8">
              <StepTitle title="Entrega" subtitle="Para onde enviamos o seu ritual?" />
              <div className="grid gap-4 sm:grid-cols-6">
                <div className="relative sm:col-span-2">
                  <CheckoutField label="CEP" name="cep" inputMode="numeric" autoComplete="postal-code" required
                    placeholder="00000-000" value={address.cep} error={addressErrors.cep} onChange={handleCep} />
                  {lookingUpCep && <Loader2 className="absolute top-9 right-3 size-4 animate-spin text-cinza" aria-label="Buscando CEP" />}
                </div>
                <div className="flex items-end pb-3 text-[11px] sm:col-span-4">
                  <a href="https://buscacepinter.correios.com.br/" target="_blank" rel="noopener noreferrer" className="text-cinza underline hover:text-grafite">
                    Não sei meu CEP
                  </a>
                </div>
                <CheckoutField className="sm:col-span-4" label="Rua / Avenida" name="street" autoComplete="address-line1" required
                  value={address.street} error={addressErrors.street} onChange={(v) => setA('street', v)} />
                <CheckoutField className="sm:col-span-2" label="Número" name="number" required
                  value={address.number} error={addressErrors.number} onChange={(v) => setA('number', v)} />
                <CheckoutField className="sm:col-span-3" label="Complemento" name="complement" autoComplete="address-line2"
                  placeholder="Apto, bloco (opcional)" value={address.complement} onChange={(v) => setA('complement', v)} />
                <CheckoutField className="sm:col-span-3" label="Bairro" name="district" required
                  value={address.district} error={addressErrors.district} onChange={(v) => setA('district', v)} />
                <CheckoutField className="sm:col-span-4" label="Cidade" name="city" autoComplete="address-level2" required
                  value={address.city} error={addressErrors.city} onChange={(v) => setA('city', v)} />
                <div className="sm:col-span-2">
                  <label htmlFor="co-state" className="mb-1 block text-xs font-semibold tracking-wider text-grafite uppercase">UF</label>
                  <select id="co-state" name="state" autoComplete="address-level1" value={address.state}
                    onChange={(e) => setA('state', e.target.value)} aria-invalid={Boolean(addressErrors.state)}
                    className={cn('w-full rounded-xl border bg-white px-4 py-3 text-sm focus:outline-none',
                      addressErrors.state ? 'border-rubor' : 'border-borda focus:border-salvia')}>
                    <option value="">--</option>
                    {UFS.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
                  </select>
                  {addressErrors.state && <p role="alert" className="mt-1 text-[11px] text-rubor">{addressErrors.state}</p>}
                </div>
                <CheckoutField className="sm:col-span-6" label="Quem vai receber" name="recipient" required
                  value={address.recipient} error={addressErrors.recipient} onChange={(v) => setA('recipient', v)} />
              </div>

              <fieldset className="mt-8">
                <legend className="mb-3 text-xs font-semibold tracking-wider text-grafite uppercase">Forma de envio</legend>
                {cart.totals.freeShipping && (
                  <p className="mb-3 rounded-xl bg-folha/10 px-4 py-2.5 text-xs font-medium text-folha">
                    Você ganhou envio grátis! Escolha como prefere receber.
                  </p>
                )}
                <div className="space-y-2">
                  {settings.shippingOptions.map((opt) => (
                    <label key={opt.id}
                      className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-borda bg-areia p-4 text-sm hover:border-salvia has-checked:border-salvia has-checked:bg-white">
                      <span className="flex items-center gap-3">
                        <input type="radio" name="shipping" checked={cart.shippingOptionId === opt.id}
                          onChange={() => { setShippingError(undefined); store.setShippingId(opt.id) }} className="accent-salvia" />
                        {opt.label}
                      </span>
                      <span className="font-semibold whitespace-nowrap">{cart.totals.freeShipping ? 'Grátis' : formatBRL(opt.price)}</span>
                    </label>
                  ))}
                </div>
                {shippingError && <p role="alert" className="mt-2 text-[11px] text-rubor">{shippingError}</p>}
              </fieldset>

              <StepActions primary="Revisar pedido" onBack={() => goTo(0)} loading={saving} />
            </form>
          )}

          {step === 2 && (
            <section className="rounded-3xl border border-borda bg-white p-6 shadow-sm sm:p-8">
              <StepTitle title="Revisão" subtitle="Confira tudo antes de seguir para o pagamento." />

              <ReviewBlock title="Identificação" onEdit={() => goTo(0)}>
                <p className="font-medium text-grafite">{customer.name}</p>
                <p>{customer.email} · {customer.phone}</p>
                <p>CPF {customer.cpf}</p>
              </ReviewBlock>

              <ReviewBlock title="Entrega" onEdit={() => goTo(1)}>
                <p className="font-medium text-grafite">{address.recipient}</p>
                <p>
                  {address.street}, {address.number}
                  {address.complement && ` — ${address.complement}`}
                </p>
                <p>{address.district} · {address.city}/{address.state.toUpperCase()} · CEP {address.cep}</p>
                <p className="mt-1 text-grafite">
                  {settings.shippingOptions.find((o) => o.id === cart.shippingOptionId)?.label}
                  {' · '}
                  {cart.totals.shipping === 0 ? 'Grátis' : formatBRL(cart.totals.shipping ?? 0)}
                </p>
              </ReviewBlock>

              <ReviewBlock title={`Itens (${cart.itemCount})`} onEdit={() => store.openDialog({ type: 'cart' })} editLabel="Editar sacola">
                <ul className="space-y-1">
                  {cart.items.map((i) => (
                    <li key={i.productId} className={cn('flex justify-between gap-4', !i.available && 'text-rubor')}>
                      <span>{i.quantity}× {i.name}{!i.available && ' — sem estoque suficiente'}</span>
                      <span className="whitespace-nowrap">{formatBRL(i.lineTotal)}</span>
                    </li>
                  ))}
                </ul>
              </ReviewBlock>

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button type="button" onClick={() => goTo(1)} className="text-xs text-cinza underline hover:text-grafite">
                  Voltar
                </button>
                <button type="button" onClick={placeOrder} disabled={placing || unavailable.length > 0 || store.pending}
                  className={cn(btnPrimary, 'disabled:cursor-not-allowed disabled:opacity-60')}>
                  {placing ? <><Loader2 className="size-4 animate-spin" aria-hidden /> Criando pedido…</> : 'Continuar para pagamento'}
                </button>
              </div>
              <p className="mt-4 text-[11px] text-cinza sm:text-right">
                Ao continuar, você concorda com os{' '}
                <Link href="/termos" target="_blank" className="underline">termos de uso</Link> e a{' '}
                <Link href="/privacidade" target="_blank" className="underline">política de privacidade</Link>.
              </p>
            </section>
          )}
        </div>

        <OrderSummary
          items={cart.items.map((i) => ({
            key: i.productId,
            name: i.name,
            image: i.image,
            quantity: i.quantity,
            lineTotal: i.lineTotal,
            warning: i.available ? undefined : 'Sem estoque suficiente',
          }))}
          subtotal={cart.totals.subtotal}
          discount={cart.totals.discount}
          couponCode={cart.coupon?.code}
          couponNotice={cart.coupon?.notice}
          shipping={cart.totals.shipping}
          total={cart.totals.total}
          installments={settings.installments}
          footer={
            <button type="button" onClick={() => store.openDialog({ type: 'cart' })} className="mt-4 text-xs text-cinza underline hover:text-grafite">
              Editar sacola ou aplicar cupom
            </button>
          }
        />
      </div>
    </div>
  )
}

function focusFirst(errors: Errors) {
  const first = Object.keys(errors)[0]
  document.getElementById(`co-${first}`)?.focus()
}

function StepTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="mb-6">
      <h1 className="font-serif text-2xl text-grafite">{title}</h1>
      <p className="mt-1 text-xs text-cinza">{subtitle}</p>
    </header>
  )
}

function StepActions({ primary, onBack, loading }: { primary: string; onBack?: () => void; loading?: boolean }) {
  return (
    <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
      {onBack ? (
        <button type="button" onClick={onBack} className="text-xs text-cinza underline hover:text-grafite">
          Voltar
        </button>
      ) : (
        <span />
      )}
      <button type="submit" disabled={loading} className={cn(btnPrimary, 'disabled:cursor-wait disabled:opacity-70')}>
        {loading ? <><Loader2 className="size-4 animate-spin" aria-hidden /> Salvando…</> : primary}
      </button>
    </div>
  )
}

function ReviewBlock({ title, onEdit, editLabel = 'Alterar', children }: { title: string; onEdit: () => void; editLabel?: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-borda py-5 text-xs leading-relaxed text-cinza first-of-type:border-t-0 first-of-type:pt-0">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-xs font-semibold tracking-wider text-grafite uppercase">{title}</h2>
        <button type="button" onClick={onEdit} className="flex items-center gap-1 text-[11px] font-medium text-salvia hover:text-salvia-900">
          <Pencil className="size-3" aria-hidden /> {editLabel}
        </button>
      </div>
      {children}
    </div>
  )
}
