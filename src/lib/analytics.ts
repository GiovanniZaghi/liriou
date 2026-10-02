type EventName =
  | 'lead_form_start'
  | 'lead_form_error'
  | 'generate_lead'
  | 'lead_form_submit_error'
  | 'cta_click'
  | 'share_whatsapp'
  | 'copy_link'

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

/** Empurra eventos para o dataLayer (GTM/GA4). Sem GTM instalado, não faz nada. */
export function track(event: EventName, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push({ event, ...params })
}
