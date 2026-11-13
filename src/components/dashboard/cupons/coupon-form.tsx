'use client'

import { Trash2 } from 'lucide-react'
import { useActionState, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { deleteCouponAction, saveCouponAction, type CouponFormState } from '@/app/actions/coupons'
import type { AdminCoupon, DiscountType } from '@/lib/api/types'
import { isoToLocalInput } from '@/lib/coupons'
import { formatBRL } from '@/lib/format'
import { formatPriceInput, parsePrice } from '@/lib/products'
import { cn } from '@/lib/utils'
import { dashBtn } from '../page-header'

/** Erros da API (nome do campo da API) → campo do formulário */
const FIELD_ALIASES: Record<string, string> = { minSubtotalCents: 'minSubtotal' }

export function CouponForm({ coupon }: { coupon?: AdminCoupon }) {
  const [state, action, pending] = useActionState<CouponFormState, FormData>(saveCouponAction, {})
  const [deleting, startDelete] = useTransition()
  const [v, setV] = useState({
    code: coupon?.code ?? '',
    description: coupon?.description ?? '',
    type: (coupon?.type ?? 'percent') as DiscountType,
    value: coupon ? (coupon.type === 'fixed' ? formatPriceInput(coupon.value) : String(coupon.value)) : '10',
    minSubtotal: coupon && coupon.minSubtotal > 0 ? formatPriceInput(coupon.minSubtotal) : '',
    startsAt: isoToLocalInput(coupon?.startsAt ?? null),
    endsAt: isoToLocalInput(coupon?.endsAt ?? null),
    maxUses: coupon?.maxUses ? String(coupon.maxUses) : '',
    isActive: coupon?.isActive ?? true,
  })
  const set = <K extends keyof typeof v>(k: K, value: (typeof v)[K]) => setV((p) => ({ ...p, [k]: value }))
  const err = (name: string) =>
    Object.entries(state.fields ?? {}).find(([k]) => (FIELD_ALIASES[k] ?? k) === name)?.[1]

  const numericValue = v.type === 'percent' ? Number.parseInt(v.value, 10) || 0 : parsePrice(v.value) || 0
  const label = v.type === 'percent' ? `${numericValue}% OFF` : `${formatBRL(numericValue)} OFF`
  const min = parsePrice(v.minSubtotal) || 0
  const fmtDate = (s: string) => (s ? new Date(`${s}:00-03:00`).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Sao_Paulo' }) : null)
  const rules = [
    `${v.type === 'percent' ? `${numericValue}%` : formatBRL(numericValue)} de desconto em todo o site`,
    min > 0 ? `em compras a partir de ${formatBRL(min)}` : 'sem valor mínimo',
    v.startsAt ? `a partir de ${fmtDate(v.startsAt)}` : null,
    v.endsAt ? `até ${fmtDate(v.endsAt)}` : 'sem data de fim',
    v.maxUses ? `limitado a ${v.maxUses} ${Number(v.maxUses) === 1 ? 'uso' : 'usos'}` : 'usos ilimitados',
  ].filter(Boolean)

  function remove() {
    if (!coupon || !confirm(`Excluir o cupom ${coupon.code}?`)) return
    startDelete(async () => {
      const r = await deleteCouponAction(coupon.id)
      if (r && !r.ok) toast.error(r.error ?? 'Não foi possível excluir.')
    })
  }

  return (
    <form action={action} className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      {coupon && <input type="hidden" name="couponId" value={coupon.id} />}

      <div className="space-y-5">
        {state.error && (
          <p role="alert" className="rounded-2xl bg-rubor/10 px-4 py-3 text-[14px] text-rubor">{state.error}</p>
        )}

        <Card title="Cupom">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Código" name="code" value={v.code} error={err('code')} required maxLength={30}
              hint="O que a cliente digita na sacola" placeholder="BEMVINDA15"
              onChange={(x) => set('code', x.toUpperCase().replace(/[^A-Z0-9_-]/g, ''))} className="font-mono uppercase" />
            <Input label="Descrição interna" name="description" value={v.description} error={err('description')} maxLength={200}
              placeholder="Ex.: campanha Instagram novembro" onChange={(x) => set('description', x)} />
          </div>
        </Card>

        <Card title="Desconto" description="Vale para todos os produtos do site.">
          <fieldset className="grid grid-cols-2 gap-2">
            <legend className="sr-only">Tipo de desconto</legend>
            {([['percent', 'Percentual (%)'], ['fixed', 'Valor fixo (R$)']] as const).map(([value, text]) => (
              <label key={value} className={cn('flex cursor-pointer items-center gap-2 rounded-xl border-[1.5px] bg-white px-4 py-3 text-[14px] font-medium',
                v.type === value ? 'border-noite-900' : 'border-linho')}>
                <input type="radio" name="type" value={value} checked={v.type === value} className="accent-noite-900"
                  onChange={() => setV((p) => ({ ...p, type: value, value: value === 'percent' ? '10' : '20,00' }))} />
                {text}
              </label>
            ))}
          </fieldset>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label={v.type === 'percent' ? 'Desconto (%)' : 'Desconto (R$)'} name="value" value={v.value} error={err('value')}
              required inputMode={v.type === 'percent' ? 'numeric' : 'decimal'} placeholder={v.type === 'percent' ? '10' : '20,00'}
              onChange={(x) => set('value', v.type === 'percent' ? x.replace(/\D/g, '').slice(0, 3) : x.replace(/[^\d.,]/g, ''))} />
            <Input label="Pedido mínimo (R$)" name="minSubtotal" value={v.minSubtotal} error={err('minSubtotal')} inputMode="decimal"
              placeholder="Sem mínimo" hint="Subtotal dos produtos" onChange={(x) => set('minSubtotal', x.replace(/[^\d.,]/g, ''))} />
          </div>
        </Card>

        <Card title="Validade e limite" description="Horário de São Paulo. Deixe em branco para não limitar.">
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Começa em" name="startsAt" type="datetime-local" value={v.startsAt} error={err('startsAt')}
              onChange={(x) => set('startsAt', x)} />
            <Input label="Termina em" name="endsAt" type="datetime-local" value={v.endsAt} error={err('endsAt')}
              onChange={(x) => set('endsAt', x)} />
            <Input label="Limite de usos" name="maxUses" type="number" min={1} value={v.maxUses} error={err('maxUses')}
              placeholder="Ilimitado" hint={coupon ? `Já usado ${coupon.usedCount}×` : 'Total de pedidos'} onChange={(x) => set('maxUses', x)} />
          </div>
        </Card>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-6">
        <section className="rounded-[20px] border border-linho bg-white p-5">
          <label className="flex cursor-pointer items-center justify-between gap-4">
            <span>
              <span className="block text-[15px] font-semibold text-noite-900">Cupom ativo</span>
              <span className="mt-0.5 block text-[13px] text-musgo">{v.isActive ? 'Pode ser usado na loja.' : 'Desligado: a loja recusa.'}</span>
            </span>
            <input type="checkbox" name="isActive" checked={v.isActive} onChange={(e) => set('isActive', e.target.checked)} className="peer sr-only" />
            <span className={cn('relative h-7 w-12 shrink-0 rounded-full transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-noite-900', v.isActive ? 'bg-folha' : 'bg-linho')}>
              <span className={cn('absolute top-1 left-1 size-5 rounded-full bg-white shadow transition-transform', v.isActive && 'translate-x-5')} />
            </span>
          </label>
        </section>

        <section aria-label="Como a cliente vê" className="rounded-[20px] border border-linho bg-white p-5">
          <h2 className="mb-3 text-[15px] font-semibold text-noite-900">Como aparece na sacola</h2>
          <div className="rounded-xl border border-folha/30 bg-folha/10 px-4 py-2.5 text-[12px] text-noite-900">
            Cupom <strong className="font-mono font-semibold">{v.code || 'CODIGO'}</strong> · {label}
          </div>
          <ul className="mt-4 space-y-1 text-[13px] text-musgo">
            {rules.map((r) => <li key={r}>• {r}</li>)}
          </ul>
        </section>

        <button type="submit" disabled={pending} className={`${dashBtn.primary} w-full`}>
          {pending ? 'Salvando…' : coupon ? 'Salvar alterações' : 'Criar cupom'}
        </button>
        {coupon && (
          coupon.usedCount > 0 ? (
            <p className="text-center text-[12px] text-musgo">Usado em {coupon.usedCount} pedido(s): para encerrar, desative-o.</p>
          ) : (
            <button type="button" onClick={remove} disabled={deleting} className={`${dashBtn.danger} w-full`}>
              <Trash2 className="size-4" aria-hidden /> {deleting ? 'Excluindo…' : 'Excluir cupom'}
            </button>
          )
        )}
      </aside>
    </form>
  )
}

function Card({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 rounded-[20px] border border-linho bg-white p-5 sm:p-6">
      <header>
        <h2 className="text-[16px] font-semibold text-noite-900">{title}</h2>
        {description && <p className="mt-0.5 text-[13px] text-musgo">{description}</p>}
      </header>
      {children}
    </section>
  )
}

type InputProps = Omit<React.ComponentProps<'input'>, 'onChange' | 'value'> & {
  label: string
  value: string
  hint?: string
  error?: string
  onChange: (value: string) => void
}

function Input({ label, hint, error, onChange, className, ...props }: InputProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-[13px] font-medium">{label}</span>
      <input {...props} onChange={(e) => onChange(e.target.value)} aria-invalid={Boolean(error)}
        className={cn('h-11 w-full rounded-xl border-[1.5px] bg-white px-3 text-[15px] text-tinta outline-none focus:border-noite-900',
          error ? 'border-rubor' : 'border-linho', className)} />
      {error ? <span className="mt-1 block text-[12px] text-rubor">{error}</span> : hint && <span className="mt-1 block text-[12px] text-musgo">{hint}</span>}
    </label>
  )
}
