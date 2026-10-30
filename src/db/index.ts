import 'server-only'

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

type Db = ReturnType<typeof createDb>

function createDb() {
  // DATABASE_URL_DATABASE_URL: nome criado pela integração Neon da Vercel com o prefixo "DATABASE_URL"
  const raw = process.env.DATABASE_URL || process.env.DATABASE_URL_DATABASE_URL
  if (!raw) {
    // Só os nomes (nunca valores), para diagnosticar prefixos da integração
    const seen = Object.keys(process.env).filter((k) => /DATABASE|POSTGRES|^PG/.test(k))
    throw new Error(
      `DATABASE_URL não configurada (veja .env.example). Variáveis de banco disponíveis: ${seen.join(', ') || 'nenhuma'}`,
    )
  }

  const url = new URL(raw)
  // Parâmetro do libpq que o postgres-js repassaria ao servidor como configuração desconhecida
  url.searchParams.delete('channel_binding')
  // Pooler (PgBouncer, ex.: Neon "-pooler"): sem prepared statements
  const pooled = url.hostname.includes('-pooler') || url.searchParams.get('pgbouncer') === 'true'
  url.searchParams.delete('pgbouncer')

  const client = postgres(url.toString(), {
    max: Number(process.env.DATABASE_POOL_MAX) || 10,
    prepare: !pooled,
  })
  return drizzle(client, { schema })
}

// Criado no primeiro uso (não na importação), para o build não exigir DATABASE_URL.
// Em dev, reaproveitado entre reloads do servidor.
const globalForDb = globalThis as unknown as { db?: Db }

export function getDb(): Db {
  globalForDb.db ??= createDb()
  return globalForDb.db
}
