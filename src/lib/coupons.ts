import type { AdminCoupon, CouponStatus } from './api/types'
import { formatBRL } from './format'

const TZ = 'America/Sao_Paulo'

export const COUPON_STATUS: Record<CouponStatus, { label: string; tone: string }> = {
  active: { label: 'Valendo', tone: 'bg-folha/12 text-folha' },
  scheduled: { label: 'Agendado', tone: 'bg-[#fde9c8] text-[#8a5a00]' },
  expired: { label: 'Expirado', tone: 'bg-linho text-musgo' },
  exhausted: { label: 'Esgotado', tone: 'bg-petala/60 text-rubor' },
  inactive: { label: 'Desativado', tone: 'bg-linho text-musgo' },
}

export const couponDiscountLabel = (c: Pick<AdminCoupon, 'type' | 'value'>) =>
  c.type === 'percent' ? `${c.value}% OFF` : `${formatBRL(c.value)} OFF`

/** ISO → valor de <input type="datetime-local"> no horário de São Paulo. */
export function isoToLocalInput(iso: string | null) {
  if (!iso) return ''
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: TZ,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(new Date(iso))
      .map((p) => [p.type, p.value]),
  )
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`
}

/** Valor de datetime-local (horário de São Paulo, UTC−3 sem horário de verão) → ISO. */
export function localInputToIso(value: string) {
  return value ? new Date(`${value}:00-03:00`).toISOString() : null
}
