import { index, jsonb, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core'

export const leads = pgTable(
  'leads',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    /** Sempre minúsculo: um cadastro por e-mail */
    email: text('email').notNull(),
    /** Só dígitos, com DDD (ex.: 11912345678) */
    whatsapp: text('whatsapp').notNull(),
    /** Resposta opcional "pesadelo ao acordar" (valores de PAIN_OPTIONS) */
    pain: text('pain'),
    consentAt: timestamp('consent_at', { withTimezone: true }).notNull(),
    utm: jsonb('utm').$type<Record<string, string>>(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex('leads_email_key').on(t.email), index('leads_created_at_idx').on(t.createdAt)],
)

export type Lead = typeof leads.$inferSelect
export type NewLead = typeof leads.$inferInsert
