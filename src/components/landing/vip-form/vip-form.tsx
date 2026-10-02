'use client'

import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { joinVipListAction } from '@/app/actions/leads'
import { track } from '@/lib/analytics'
import {
  PAIN_OPTIONS,
  REQUIRED_FIELDS,
  validateField,
  validateLead,
  type LeadErrors,
  type LeadInput,
  type RequiredField,
} from '@/lib/lead'
import { maskPhone } from '@/lib/masks'
import { Button } from '@/components/ui/button'
import { ConsentCheckbox } from '@/components/ui/consent-checkbox'
import { Field } from '@/components/ui/field'
import { SelectField } from '@/components/ui/select-field'
import { SuccessCard } from './success-card'

const MIN_LOADING_MS = 900

const EMPTY: LeadInput = { name: '', email: '', whatsapp: '', pain: '', consent: false }

type Status = 'idle' | 'submitting' | 'success'

export function VipForm() {
  const [values, setValues] = useState<LeadInput>(EMPTY)
  const [errors, setErrors] = useState<LeadErrors>({})
  // Validação só no blur ou depois do 1º envio com erro
  const [touched, setTouched] = useState<Partial<Record<RequiredField, boolean>>>({})
  const [submitAttempts, setSubmitAttempts] = useState(0)
  const [status, setStatus] = useState<Status>('idle')
  const started = useRef(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const validCount = REQUIRED_FIELDS.filter((f) => !validateField(f, values)).length
  const complete = validCount === REQUIRED_FIELDS.length

  function markStarted() {
    if (started.current) return
    started.current = true
    track('lead_form_start')
  }

  function update<K extends keyof LeadInput>(key: K, value: LeadInput[K]) {
    markStarted()
    const next = { ...values, [key]: value }
    setValues(next)
    if (key !== 'pain' && (touched[key as RequiredField] || submitAttempts > 0)) {
      setErrors((prev) => ({ ...prev, [key]: validateField(key as RequiredField, next) }))
    }
  }

  function blur(field: RequiredField) {
    setTouched((prev) => ({ ...prev, [field]: true }))
    // Não acusa erro em campo que a pessoa só atravessou sem digitar
    if (field !== 'consent' && !values[field] && submitAttempts === 0) return
    setErrors((prev) => ({ ...prev, [field]: validateField(field, values) }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const found = validateLead(values)
    setErrors(found)

    if (Object.keys(found).length) {
      setSubmitAttempts((n) => n + 1)
      track('lead_form_error', { fields: Object.keys(found) })
      const first = Object.keys(found)[0]
      cardRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }

    setStatus('submitting')
    const [result] = await Promise.all([
      joinVipListAction(values, readUtm()).catch(() => ({ ok: false as const })),
      new Promise((r) => setTimeout(r, MIN_LOADING_MS)),
    ])

    if (result.ok) {
      track('generate_lead', { pain: values.pain || undefined })
      setStatus('success')
      return
    }

    setStatus('idle')
    if ('errors' in result && result.errors) setErrors(result.errors)
    track('lead_form_submit_error')
    toast.error(('message' in result && result.message) || 'Não foi possível enviar agora. Tente de novo em instantes.')
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }

  const fieldError = (f: RequiredField) => errors[f]
  const fieldValid = (f: RequiredField) => !validateField(f, values) && Boolean(touched[f] || submitAttempts)

  return (
    <div
      ref={cardRef}
      id="cadastro"
      onPointerMove={handlePointerMove}
      className="card-in group/card relative w-full scroll-mt-6 overflow-hidden rounded-(--radius-card) bg-leite px-5 pt-[30px] pb-[22px] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.55)] lg:px-9 lg:pt-10 lg:pb-[30px]"
    >
      {/* Brilho de cetim seguindo o ponteiro (só ponteiro fino) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-(--t-slow) ease-cetim [@media(hover:hover)]:group-hover/card:opacity-100"
        style={{
          background: 'radial-gradient(420px at var(--mx, 50%) var(--my, 0%), rgb(255 255 255 / 0.55), transparent 70%)',
        }}
      />

      {status === 'success' ? (
        <SuccessCard />
      ) : (
        <>
          {/* Barra de progresso: conta só os 4 obrigatórios */}
          <div
            aria-hidden
            className="absolute top-0 left-0 h-1 w-full origin-left bg-folha transition-transform duration-(--t-base) ease-cetim"
            style={{ transform: `scaleX(${validCount / REQUIRED_FIELDS.length})` }}
          />

          <form noValidate onSubmit={handleSubmit} className="relative flex flex-col gap-3" aria-labelledby="form-titulo">
            <header className="flex flex-col gap-1.5 pb-1.5">
              <h2 id="form-titulo" className="display-s max-w-[420px] text-noite-900">
                Entre para o Club de <em className="text-rubor italic">Lirious Lovers</em>
              </h2>
              <p className="max-w-[310px] text-[14px] leading-[1.5] text-musgo">
                Leva 30 segundos. Avisamos pelo WhatsApp quando a pré-venda abrir.
              </p>
            </header>

            <Field
              name="name"
              label="Nome completo"
              autoComplete="name"
              value={values.name}
              onChange={(e) => update('name', e.target.value)}
              onBlur={() => blur('name')}
              error={fieldError('name')}
              valid={fieldValid('name')}
              shakeKey={submitAttempts}
            />
            <Field
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              label="E-mail"
              value={values.email}
              onChange={(e) => update('email', e.target.value)}
              onBlur={() => blur('email')}
              error={fieldError('email')}
              valid={fieldValid('email')}
              shakeKey={submitAttempts}
            />
            <Field
              name="whatsapp"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              label="WhatsApp com DDD"
              value={values.whatsapp}
              onChange={(e) => update('whatsapp', maskPhone(e.target.value))}
              onBlur={() => blur('whatsapp')}
              error={fieldError('whatsapp')}
              valid={fieldValid('whatsapp')}
              shakeKey={submitAttempts}
            />

            <label htmlFor="pain" className="flex flex-wrap items-baseline gap-x-1.5">
              <span className="text-[14px] leading-[1.35] font-medium text-tinta">
                Qual é o seu maior pesadelo ao acordar?
              </span>
              <span className="text-[12px] leading-[1.5] text-musgo">opcional</span>
            </label>
            <SelectField
              id="pain"
              name="pain"
              placeholder="Escolha uma opção"
              options={PAIN_OPTIONS}
              value={values.pain}
              onChange={(e) => update('pain', e.target.value as LeadInput['pain'])}
            />

            <div key={errors.consent ? submitAttempts : undefined} className={errors.consent ? 'shake' : undefined}>
              <ConsentCheckbox
                checked={values.consent}
                onChange={(v) => {
                  update('consent', v)
                  setTouched((prev) => ({ ...prev, consent: true }))
                }}
                error={fieldError('consent')}
              />
            </div>

            <Button type="submit" fullWidth pulse={complete} loading={status === 'submitting'}>
              Quero meu acesso VIP
            </Button>

            <p className="flex items-center justify-center gap-1.5 text-[12px] leading-[1.5] text-musgo">
              <img alt="" src="/figma/icone-escudo.svg" className="size-[15px]" />
              Dados protegidos. Zero spam.
            </p>
          </form>
        </>
      )}
    </div>
  )
}

function readUtm() {
  const params = new URLSearchParams(window.location.search)
  const utm: Record<string, string> = {}
  params.forEach((value, key) => {
    if (key.startsWith('utm_')) utm[key] = value
  })
  return Object.keys(utm).length ? utm : undefined
}
