import { PAIN_OPTIONS } from './lead'
import { maskPhone } from './masks'

const TZ = 'America/Sao_Paulo'

const dateTime = new Intl.DateTimeFormat('pt-BR', {
  timeZone: TZ,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const number = new Intl.NumberFormat('pt-BR')
const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export const formatDateTime = (d: Date) => dateTime.format(d)
export const formatNumber = (n: number) => number.format(n)
export const formatBRL = (n: number) => brl.format(n)
export const formatPhone = (digits: string) => maskPhone(digits)

/** '2026-09-30' → '30/09' */
export const formatDayShort = (isoDay: string) => `${isoDay.slice(8, 10)}/${isoDay.slice(5, 7)}`

export function painLabel(value: string | null) {
  if (!value) return 'Não respondeu'
  return PAIN_OPTIONS.find((o) => o.value === value)?.label ?? value
}

/** "07/03" ou, com idade, "07/03/1995 (31 anos)". Recebe AAAA-MM-DD. */
export function formatBirthday(iso: string, withAge = false) {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number)
  const dm = `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}`
  if (!withAge) return dm
  const now = new Date()
  const age = now.getFullYear() - y - (now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d) ? 1 : 0)
  return `${dm}/${y} (${age} anos)`
}
