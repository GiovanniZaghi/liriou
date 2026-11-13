import { Sidebar } from '@/components/dashboard/sidebar'

/** Casca do painel autenticado: menu lateral + área de conteúdo. */
export default function PainelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
      <Sidebar />
      <div className="min-w-0">{children}</div>
    </div>
  )
}
