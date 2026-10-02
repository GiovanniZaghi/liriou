import { LoginForm } from '@/components/dashboard/login-form'
import { LogoSymbol } from '@/components/ui/logo'

export default function DashboardLoginPage() {
  return (
    <main className="grid min-h-svh place-items-center bg-noite-900 px-5">
      <div className="w-full max-w-[400px]">
        <div className="mb-8 flex justify-center">
          <LogoSymbol className="scale-125" />
        </div>
        <div className="rounded-(--radius-card) bg-leite px-6 pt-8 pb-7 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.55)] sm:px-8">
          <h1 className="display-s text-noite-900">
            Painel da <em className="text-rubor italic">lista VIP</em>
          </h1>
          <p className="mt-1.5 mb-6 text-[14px] leading-[1.5] text-musgo">Acesso restrito à equipe Líriou.</p>
          <LoginForm />
        </div>
      </div>
    </main>
  )
}
