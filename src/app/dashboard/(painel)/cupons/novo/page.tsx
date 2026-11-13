import type { Metadata } from 'next'
import { CouponForm } from '@/components/dashboard/cupons/coupon-form'
import { PageHeader, pageShell } from '@/components/dashboard/page-header'

export const metadata: Metadata = { title: 'Novo cupom · Dashboard Líriou' }

export default function NovoCupomPage() {
  return (
    <main className={pageShell}>
      <PageHeader title="Novo cupom" description="Desconto para todo o site." breadcrumb={[{ href: '/dashboard/cupons', label: 'Cupons' }]} />
      <CouponForm />
    </main>
  )
}
