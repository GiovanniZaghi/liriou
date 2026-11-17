'use client'

import { ExternalLink, FileText, Loader2, Printer, RefreshCw, Tag, Truck } from 'lucide-react'
import { useActionState } from 'react'
import { shipmentAction, type ShipmentActionState } from '@/app/actions/shipments'
import type { ShipmentInfo } from '@/lib/api/types'
import { formatBRL } from '@/lib/format'
import { shipmentStatusLabel } from '@/lib/orders'
import { dashBtn } from '../page-header'

/** Envio do pedido: frete escolhido, etiqueta Frenet e último evento de rastreio. */
export function ShipmentCard({ info }: { info: ShipmentInfo }) {
  const [state, action, pending] = useActionState<ShipmentActionState, FormData>(shipmentAction, {})
  const { shipping: s, shipment } = info

  return (
    <section className="space-y-3 rounded-[20px] border border-linho bg-white p-5 text-[14px]">
      <h2 className="flex items-center gap-2 text-[15px] font-semibold text-noite-900">
        <Truck className="size-4" aria-hidden /> Envio
      </h2>

      <dl className="space-y-1">
        <div className="flex justify-between gap-3">
          <dt className="text-musgo">Frete</dt>
          <dd className="text-right font-medium text-noite-900">{s.label}</dd>
        </div>
        {s.deliveryDays != null && s.deliveryDays > 0 && (
          <div className="flex justify-between gap-3">
            <dt className="text-musgo">Prazo</dt>
            <dd>até {s.deliveryDays} dias úteis</dd>
          </div>
        )}
        <div className="flex justify-between gap-3">
          <dt className="text-musgo">Cliente pagou</dt>
          <dd className="tabular-nums">{s.charged === 0 ? 'Grátis' : formatBRL(s.charged)}</dd>
        </div>
        {s.quoted != null && (
          <div className="flex justify-between gap-3">
            <dt className="text-musgo">Custo na Frenet</dt>
            <dd className="tabular-nums">{formatBRL(s.quoted)}</dd>
          </div>
        )}
      </dl>

      {shipment ? (
        <div className="space-y-3 border-t border-linho pt-3">
          <p className="flex items-center justify-between gap-2">
            <span className="text-musgo">Etiqueta</span>
            <span className="rounded-full bg-folha/12 px-2.5 py-0.5 text-[12px] font-medium text-folha">
              {shipmentStatusLabel(shipment.status)}
            </span>
          </p>
          {shipment.trackingNumber && (
            <p className="flex items-center justify-between gap-2">
              <span className="text-musgo">Rastreio</span>
              {shipment.trackingUrl ? (
                <a href={shipment.trackingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-mono text-[13px] text-noite-900 underline">
                  {shipment.trackingNumber} <ExternalLink className="size-3" aria-hidden />
                </a>
              ) : (
                <span className="font-mono text-[13px]">{shipment.trackingNumber}</span>
              )}
            </p>
          )}
          {shipment.lastEvent && (
            <div className="rounded-xl bg-leite px-3 py-2 text-[13px]">
              <p className="font-medium text-noite-900">{shipment.lastEvent.description}</p>
              <p className="text-[12px] text-musgo">
                {shipment.lastEvent.at}
                {shipment.lastEvent.location && ` · ${shipment.lastEvent.location}`}
              </p>
            </div>
          )}
          <div className="grid gap-2">
            {shipment.labelUrl && (
              <a href={shipment.labelUrl} target="_blank" rel="noopener noreferrer" className={dashBtn.primary}>
                <Printer className="size-4" aria-hidden /> Imprimir etiqueta
              </a>
            )}
            {shipment.declarationUrl && (
              <a href={shipment.declarationUrl} target="_blank" rel="noopener noreferrer" className={dashBtn.outline}>
                <FileText className="size-4" aria-hidden /> Declaração de conteúdo
              </a>
            )}
            <form action={action}>
              <input type="hidden" name="orderId" value={info.orderId} />
              <input type="hidden" name="intent" value="refresh" />
              <button type="submit" disabled={pending} className={`${dashBtn.outline} w-full`}>
                {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <RefreshCw className="size-4" aria-hidden />}
                Atualizar links da etiqueta
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="space-y-2 border-t border-linho pt-3">
          {!info.labelsEnabled ? (
            <p className="text-[13px] text-musgo">
              Geração de etiqueta pela API aguardando o <strong>token de parceiro</strong> da Frenet. Enquanto isso, gere no painel da
              Frenet.
            </p>
          ) : info.blockedReason ? (
            <p className="text-[13px] text-musgo">{info.blockedReason}</p>
          ) : (
            <p className="text-[13px] text-musgo">Gera a etiqueta na Frenet usando o saldo da sua conta.</p>
          )}
          <form action={action}>
            <input type="hidden" name="orderId" value={info.orderId} />
            <input type="hidden" name="intent" value="create" />
            <button type="submit" disabled={!info.canCreate || pending} className={`${dashBtn.primary} w-full`}>
              {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Tag className="size-4" aria-hidden />}
              {pending ? 'Gerando etiqueta…' : 'Gerar etiqueta'}
            </button>
          </form>
        </div>
      )}

      {state.error && (
        <p role="alert" className="rounded-xl bg-rubor/10 px-3 py-2 text-[13px] text-rubor">
          {state.error}
        </p>
      )}
    </section>
  )
}
