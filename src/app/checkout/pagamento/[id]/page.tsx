import { notFound } from 'next/navigation'
import { PaymentStep } from '@/components/checkout/payment-step'

type Params = Promise<{ id: string }>

/** Etapa 4: pedido já criado (aguardando pagamento). A URL tem o id, então recarregar não perde nada. */
export default async function PagamentoPage({ params }: { params: Params }) {
  const { id } = await params
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound()
  return <PaymentStep orderId={id} />
}
