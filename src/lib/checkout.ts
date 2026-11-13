import type { CheckoutAddress, CheckoutCustomer } from './api/types'

/** Validações do checkout no navegador (as mesmas regras a API confere de novo). */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
export const UFS = 'AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO'.split(' ')
const digits = (v: string) => v.replace(/\D/g, '')

export function isValidCpf(value: string) {
  const cpf = digits(value)
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false
  const check = (len: number) => {
    let sum = 0
    for (let i = 0; i < len; i++) sum += Number(cpf[i]) * (len + 1 - i)
    const rest = (sum * 10) % 11
    return rest === 10 ? 0 : rest
  }
  return check(9) === Number(cpf[9]) && check(10) === Number(cpf[10])
}

export type Errors = Record<string, string>

export function validateCustomer(c: CheckoutCustomer): Errors {
  const e: Errors = {}
  const name = c.name.trim()
  if (name.split(/\s+/).length < 2 || name.length < 5) e.name = 'Informe nome e sobrenome'
  if (!EMAIL_RE.test(c.email.trim())) e.email = 'Informe um e-mail válido'
  if (!isValidCpf(c.cpf)) e.cpf = 'CPF inválido'
  const phone = digits(c.phone)
  if (phone.length < 10 || phone.length > 11) e.phone = 'Informe um telefone com DDD'
  return e
}

export function validateAddress(a: CheckoutAddress): Errors {
  const e: Errors = {}
  if (digits(a.cep).length !== 8) e.cep = 'CEP inválido'
  if (!a.street.trim()) e.street = 'Informe a rua'
  if (!a.number.trim()) e.number = 'Informe o número (ou "s/n")'
  if (!a.district.trim()) e.district = 'Informe o bairro'
  if (!a.city.trim()) e.city = 'Informe a cidade'
  if (!UFS.includes(a.state.trim().toUpperCase())) e.state = 'UF inválida'
  if (a.recipient.trim().length < 3) e.recipient = 'Informe quem vai receber'
  return e
}

/** Endereço pelo CEP (ViaCEP). Falhou ou não achou → null, e a pessoa preenche à mão. */
export async function lookupCep(cep: string): Promise<Partial<CheckoutAddress> | null> {
  const d = digits(cep)
  if (d.length !== 8) return null
  try {
    const res = await fetch(`https://viacep.com.br/ws/${d}/json/`, { signal: AbortSignal.timeout(5000) })
    const data = await res.json()
    if (!res.ok || data.erro) return null
    return { street: data.logradouro ?? '', district: data.bairro ?? '', city: data.localidade ?? '', state: data.uf ?? '' }
  } catch {
    return null
  }
}

export const EMPTY_CUSTOMER: CheckoutCustomer = { name: '', email: '', cpf: '', phone: '' }
export const EMPTY_ADDRESS: CheckoutAddress = {
  cep: '',
  street: '',
  number: '',
  complement: '',
  district: '',
  city: '',
  state: '',
  recipient: '',
}

/** Rascunho do checkout neste navegador: sair do site no meio não perde o que foi digitado. */
const DRAFT_KEY = 'liriou:checkout'

export function readDraft(): { customer: CheckoutCustomer; address: CheckoutAddress } | null {
  try {
    const d = JSON.parse(localStorage.getItem(DRAFT_KEY) ?? 'null')
    return d ? { customer: { ...EMPTY_CUSTOMER, ...d.customer }, address: { ...EMPTY_ADDRESS, ...d.address } } : null
  } catch {
    return null
  }
}

export function saveDraft(draft: { customer: CheckoutCustomer; address: CheckoutAddress }) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
  } catch {}
}

export function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY)
  } catch {}
}
