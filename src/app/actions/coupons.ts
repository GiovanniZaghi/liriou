'use server'

import { revalidatePath } from 'next/cache'
import { redirect, unstable_rethrow } from 'next/navigation'
import { createCoupon, deleteCoupon, updateCoupon } from '@/lib/api/admin'
import { ApiError } from '@/lib/api/http'
import type { CouponPayload, DiscountType } from '@/lib/api/types'
import { localInputToIso } from '@/lib/coupons'
import { parsePrice } from '@/lib/products'

export type CouponFormState = { error?: string; fields?: Record<string, string> }
export type CouponActionResult = { ok: boolean; error?: string }

const text = (fd: FormData, key: string) => String(fd.get(key) ?? '').trim()

function parseCouponForm(fd: FormData): CouponPayload {
  const type = text(fd, 'type') as DiscountType
  const maxUses = Number.parseInt(text(fd, 'maxUses'), 10)
  return {
    code: text(fd, 'code').toUpperCase(),
    description: text(fd, 'description') || null,
    type,
    value: type === 'percent' ? Number.parseInt(text(fd, 'value'), 10) || 0 : parsePrice(text(fd, 'value')),
    minSubtotal: parsePrice(text(fd, 'minSubtotal')) || 0,
    startsAt: localInputToIso(text(fd, 'startsAt')),
    endsAt: localInputToIso(text(fd, 'endsAt')),
    maxUses: Number.isFinite(maxUses) && maxUses > 0 ? maxUses : null,
    isActive: fd.get('isActive') === 'on',
  }
}

function toFormError(err: unknown): CouponFormState {
  unstable_rethrow(err)
  if (err instanceof ApiError) {
    if (err.code === 'COUPON_CODE_TAKEN') return { error: err.message, fields: { code: err.message } }
    return { error: err.message, fields: err.fields }
  }
  console.error('[cupons]', err)
  return { error: 'Não foi possível salvar agora. Tente de novo.' }
}

/** Cria ou edita (id em campo oculto — sem .bind, veja o histórico do projeto). */
export async function saveCouponAction(_prev: CouponFormState, fd: FormData): Promise<CouponFormState> {
  const id = text(fd, 'couponId') || null
  const payload = parseCouponForm(fd)
  try {
    if (id) await updateCoupon(id, payload)
    else await createCoupon(payload)
  } catch (err) {
    return toFormError(err)
  }
  revalidatePath('/dashboard/cupons', 'layout')
  redirect(`/dashboard/cupons?${id ? 'salvo' : 'criado'}=${encodeURIComponent(payload.code)}`)
}

export async function setCouponActiveAction(id: string, isActive: boolean): Promise<CouponActionResult> {
  try {
    await updateCoupon(id, { isActive })
    revalidatePath('/dashboard/cupons', 'layout')
    return { ok: true }
  } catch (err) {
    unstable_rethrow(err)
    return { ok: false, error: err instanceof ApiError ? err.message : 'Não foi possível atualizar o cupom.' }
  }
}

export async function deleteCouponAction(id: string): Promise<CouponActionResult> {
  try {
    await deleteCoupon(id)
  } catch (err) {
    unstable_rethrow(err)
    return { ok: false, error: err instanceof ApiError ? err.message : 'Não foi possível excluir.' }
  }
  revalidatePath('/dashboard/cupons', 'layout')
  redirect('/dashboard/cupons?excluido=1')
}
