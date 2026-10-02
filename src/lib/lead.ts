/** Regras de validação da lista VIP — compartilhadas entre cliente e Server Action. */

export const PAIN_OPTIONS = [
  // TODO: opções a validar com a cliente (anotação do Figma)
  { value: 'frizz', label: 'Frizz' },
  { value: 'marca-elastico', label: 'Marca de elástico' },
  { value: 'nos', label: 'Nós e fios embaraçados' },
  { value: 'quebra', label: 'Fios quebrados' },
  { value: 'volume', label: 'Cabelo amassado ou sem forma' },
] as const

export type PainOption = (typeof PAIN_OPTIONS)[number]['value']

export interface LeadInput {
  name: string
  email: string
  whatsapp: string
  pain: PainOption | ''
  consent: boolean
}

export interface LeadPayload extends Omit<LeadInput, 'consent'> {
  consent_at: string
  utm?: Record<string, string>
}

export type RequiredField = 'name' | 'email' | 'whatsapp' | 'consent'
export type LeadErrors = Partial<Record<RequiredField, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validateField(field: RequiredField, input: LeadInput): string | undefined {
  switch (field) {
    case 'name': {
      const v = input.name.trim()
      return v.split(/\s+/).length >= 2 && v.length >= 5 ? undefined : 'Informe nome e sobrenome'
    }
    case 'email':
      return EMAIL_RE.test(input.email.trim()) ? undefined : 'Informe um e-mail válido'
    case 'whatsapp': {
      const d = input.whatsapp.replace(/\D/g, '')
      return d.length === 11 && d[2] === '9' ? undefined : 'Informe um celular com DDD'
    }
    case 'consent':
      return input.consent ? undefined : 'Marque para continuar'
  }
}

export const REQUIRED_FIELDS: RequiredField[] = ['name', 'email', 'whatsapp', 'consent']

export function validateLead(input: LeadInput): LeadErrors {
  const errors: LeadErrors = {}
  for (const f of REQUIRED_FIELDS) {
    const e = validateField(f, input)
    if (e) errors[f] = e
  }
  return errors
}
