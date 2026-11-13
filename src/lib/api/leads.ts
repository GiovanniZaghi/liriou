import type { LeadErrors, LeadInput } from '@/lib/lead'
import { ApiError, apiFetch } from './http'

export type JoinVipResult = { ok: true } | { ok: false; errors?: LeadErrors; message?: string }

/** Cadastro na lista VIP, direto do navegador (o rate limit da API vê o IP real da pessoa). */
export async function joinVipList(input: LeadInput, utm?: Record<string, string>): Promise<JoinVipResult> {
  try {
    await apiFetch('/leads', {
      method: 'POST',
      body: { ...input, pain: input.pain || null, utm },
    })
    return { ok: true }
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.status === 429) return { ok: false, message: 'Muitas tentativas. Aguarde um minuto e tente de novo.' }
      if (err.fields) return { ok: false, errors: err.fields as LeadErrors }
    }
    return { ok: false, message: 'Não foi possível enviar agora. Tente de novo em instantes.' }
  }
}
