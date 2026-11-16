'use client'

import { Loader2 } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'

const SDK_URL = 'https://sdk.mercadopago.com/js/v2'

/** Dados que o Brick entrega no envio (o número do cartão já virou token no navegador). */
export interface CardFormData {
  token: string
  payment_method_id: string
  installments: number
  issuer_id?: string
}

interface BrickController {
  unmount: () => void
}

interface MercadoPagoInstance {
  bricks: () => { create: (brick: 'cardPayment', containerId: string, settings: unknown) => Promise<BrickController> }
}

declare global {
  interface Window {
    MercadoPago?: new (publicKey: string, options?: { locale?: string }) => MercadoPagoInstance
  }
}

let sdkPromise: Promise<void> | null = null

/** Carrega o MercadoPago.js uma única vez (script oficial, exigido para tokenizar o cartão com segurança). */
function loadSdk(): Promise<void> {
  if (window.MercadoPago) return Promise.resolve()
  sdkPromise ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = SDK_URL
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => {
      sdkPromise = null
      reject(new Error('sdk'))
    }
    document.head.appendChild(script)
  })
  return sdkPromise
}

interface CardPaymentBrickProps {
  amount: number
  email: string
  maxInstallments: number
  /** Deve resolver quando o pagamento terminar (aprovado ou recusado) */
  onSubmit: (data: CardFormData) => Promise<void>
}

/**
 * Card Payment Brick do Mercado Pago: os campos do cartão rodam em iframes do MP
 * (PCI), e a loja recebe só o token. Visual ajustado à paleta da marca.
 */
export function CardPaymentBrick({ amount, email, maxInstallments, onSubmit }: CardPaymentBrickProps) {
  const containerId = `card-brick-${useId().replace(/:/g, '')}`
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const submitRef = useRef(onSubmit)
  useEffect(() => {
    submitRef.current = onSubmit
  })

  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY
    if (!publicKey) {
      setStatus('error')
      return
    }

    let controller: BrickController | undefined
    let cancelled = false

    loadSdk()
      .then(async () => {
        if (cancelled || !window.MercadoPago) return
        const mp = new window.MercadoPago(publicKey, { locale: 'pt-BR' })
        const brick = await mp.bricks().create('cardPayment', containerId, {
          initialization: { amount, payer: { email } },
          customization: {
            paymentMethods: { maxInstallments, types: { excluded: ['debit_card'] } },
            visual: {
              hideFormTitle: true,
              style: {
                theme: 'default',
                customVariables: {
                  baseColor: '#0B2E1F',
                  textPrimaryColor: '#10231A',
                  textSecondaryColor: '#5C6E63',
                  inputBackgroundColor: '#FFFFFF',
                  formBackgroundColor: '#FBF3EC',
                  outlinePrimaryColor: '#F0D9DC',
                  errorColor: '#B03A62',
                  borderRadiusMedium: '12px',
                  borderRadiusLarge: '999px',
                  fontSizeMedium: '14px',
                },
              },
            },
          },
          callbacks: {
            onReady: () => !cancelled && setStatus('ready'),
            onSubmit: (data: CardFormData) => submitRef.current(data),
            onError: (error: unknown) => console.error('[mercadopago] brick', error),
          },
        })
        if (cancelled) brick.unmount()
        else controller = brick
      })
      .catch(() => !cancelled && setStatus('error'))

    return () => {
      cancelled = true
      controller?.unmount()
    }
  }, [containerId, amount, email, maxInstallments])

  return (
    <div className="relative min-h-40">
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center gap-2 text-xs text-cinza">
          <Loader2 className="size-4 animate-spin" aria-hidden /> Carregando pagamento seguro…
        </div>
      )}
      {status === 'error' && (
        <p role="alert" className="rounded-xl bg-rubor/10 px-4 py-3 text-xs text-rubor">
          Não foi possível carregar o pagamento com cartão. Recarregue a página ou pague com Pix.
        </p>
      )}
      <div id={containerId} />
    </div>
  )
}
