import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CouponForm } from '@/components/dashboard/cupons/coupon-form'
import { PageHeader, pageShell } from '@/components/dashboard/page-header'
import { getCoupon } from '@/lib/api/admin'
import { ApiError } from '@/lib/api/http'
import { COUPON_STATUS } from '@/lib/coupons'

export const metadata: Metadata = { title: 'Cupom · Dashboard Líriou' }
export const dynamic = 'force-dynamic'

export default async function CupomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound()
  const coupon = await getCoupon(id).catch((err) => {
    if (err instanceof ApiError && err.status === 404) notFound()
    throw err
  })

  return (
    <main className={pageShell}>
      <PageHeader
        title={coupon.code}
        description={`${COUPON_STATUS[coupon.status].label} · usado ${coupon.usedCount}${coupon.maxUses ? ` de ${coupon.maxUses}` : ''} ${coupon.usedCount === 1 ? 'vez' : 'vezes'}`}
        breadcrumb={[{ href: '/dashboard/cupons', label: 'Cupons' }]}
      />
      <CouponForm key={coupon.updatedAt} coupon={coupon} />
    </main>
  )
}
