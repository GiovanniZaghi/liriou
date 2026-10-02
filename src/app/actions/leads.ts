'use server'

import { db } from '@/db'
import { leads } from '@/db/schema'
import { validateLead, type LeadInput, type LeadErrors } from '@/lib/lead'

export type JoinVipResult = { ok: true } | { ok: false; errors?: LeadErrors; message?: string }

export async function joinVipListAction(
  input: LeadInput,
  utm?: Record<string, string>,
): Promise<JoinVipResult> {
  const errors = validateLead(input)
  if (Object.keys(errors).length) return { ok: false, errors }

  try {
    await db
      .insert(leads)
      .values({
        name: input.name.trim(),
        email: input.email.trim().toLowerCase(),
        whatsapp: input.whatsapp.replace(/\D/g, ''),
        pain: input.pain || null,
        consentAt: new Date(),
        utm: sanitizeUtm(utm),
      })
      // Já cadastrada: mantém o 1º cadastro; para a pessoa, o resultado é o mesmo
      .onConflictDoNothing({ target: leads.email })
    return { ok: true }
  } catch (err) {
    console.error('[leads] falha ao salvar', err)
    return { ok: false, message: 'Não foi possível enviar agora. Tente de novo em instantes.' }
  }
}

/** Aceita só chaves utm_* com valores curtos (vêm da URL, logo são entrada do usuário). */
function sanitizeUtm(utm?: Record<string, string>) {
  if (!utm) return null
  const clean = Object.fromEntries(
    Object.entries(utm)
      .filter(([k, v]) => /^utm_[a-z_]{1,20}$/.test(k) && typeof v === 'string')
      .slice(0, 10)
      .map(([k, v]) => [k, v.slice(0, 200)]),
  )
  return Object.keys(clean).length ? clean : null
}
