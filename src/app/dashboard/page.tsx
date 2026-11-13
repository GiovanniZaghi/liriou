import { redirect } from 'next/navigation'

/** /dashboard abre na primeira tela do menu. */
export default function DashboardIndex() {
  redirect('/dashboard/pre-venda')
}
