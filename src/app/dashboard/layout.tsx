import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard · Líriou',
  robots: { index: false, follow: false },
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-svh bg-leite text-tinta">{children}</div>
}
