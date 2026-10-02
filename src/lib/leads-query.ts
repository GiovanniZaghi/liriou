import 'server-only'

import { and, count, desc, eq, gte, ilike, isNull, or, sql, type SQL } from 'drizzle-orm'
import { db } from '@/db'
import { leads, type Lead } from '@/db/schema'

export const PAGE_SIZE = 50
const TZ_NAME = 'America/Sao_Paulo'
// Literal (não parâmetro): o GROUP BY precisa da expressão idêntica à do SELECT
const TZ = sql.raw(`'${TZ_NAME}'`)

export interface LeadFilters {
  q?: string
  /** valor de PAIN_OPTIONS, ou 'none' para "não respondeu" */
  pain?: string
  page?: number
}

function whereFor({ q, pain }: LeadFilters): SQL | undefined {
  const conds: SQL[] = []
  if (q) {
    const term = `%${q.replace(/[%_\\]/g, '\\$&')}%`
    const digits = q.replace(/\D/g, '')
    conds.push(
      or(
        ilike(leads.name, term),
        ilike(leads.email, term),
        ...(digits.length >= 3 ? [ilike(leads.whatsapp, `%${digits}%`)] : []),
      )!,
    )
  }
  if (pain === 'none') conds.push(isNull(leads.pain))
  else if (pain) conds.push(eq(leads.pain, pain))
  return conds.length ? and(...conds) : undefined
}

export async function listLeads(filters: LeadFilters): Promise<{ rows: Lead[]; total: number }> {
  const where = whereFor(filters)
  const page = Math.max(1, filters.page ?? 1)
  const [rows, [{ total }]] = await Promise.all([
    db
      .select()
      .from(leads)
      .where(where)
      .orderBy(desc(leads.createdAt))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db.select({ total: count() }).from(leads).where(where),
  ])
  return { rows, total }
}

/** Todos os cadastros do filtro, para exportar CSV. */
export function listAllLeads(filters: LeadFilters) {
  return db.select().from(leads).where(whereFor(filters)).orderBy(desc(leads.createdAt))
}

export interface LeadStats {
  total: number
  today: number
  last7: number
  withPain: number
  /** Últimos 14 dias (fuso de São Paulo), do mais antigo ao mais recente */
  daily: { day: string; count: number }[]
  byPain: { pain: string | null; count: number }[]
}

export async function getLeadStats(): Promise<LeadStats> {
  const localDay = sql<string>`to_char(${leads.createdAt} at time zone ${TZ}, 'YYYY-MM-DD')`
  const since14 = sql`(date_trunc('day', now() at time zone ${TZ}) - interval '13 days') at time zone ${TZ}`
  const todayStart = sql`date_trunc('day', now() at time zone ${TZ}) at time zone ${TZ}`
  const since7 = sql`(date_trunc('day', now() at time zone ${TZ}) - interval '6 days') at time zone ${TZ}`

  const [[totals], dailyRows, byPain] = await Promise.all([
    db
      .select({
        total: count(),
        today: sql<number>`count(*) filter (where ${leads.createdAt} >= ${todayStart})`.mapWith(Number),
        last7: sql<number>`count(*) filter (where ${leads.createdAt} >= ${since7})`.mapWith(Number),
        withPain: sql<number>`count(${leads.pain})`.mapWith(Number),
      })
      .from(leads),
    db
      .select({ day: localDay, count: count() })
      .from(leads)
      .where(gte(leads.createdAt, since14))
      .groupBy(localDay),
    db
      .select({ pain: leads.pain, count: count() })
      .from(leads)
      .groupBy(leads.pain)
      .orderBy(desc(count())),
  ])

  // Preenche os dias sem cadastro com zero
  const counts = new Map(dailyRows.map((r) => [r.day, r.count]))
  const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: TZ_NAME }) // YYYY-MM-DD
  const daily = Array.from({ length: 14 }, (_, i) => {
    const day = fmt.format(new Date(Date.now() - (13 - i) * 86_400_000))
    return { day, count: counts.get(day) ?? 0 }
  })

  return { ...totals, daily, byPain }
}
