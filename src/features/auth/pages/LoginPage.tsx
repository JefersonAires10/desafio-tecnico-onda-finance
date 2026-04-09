import { Waves } from 'lucide-react'
import { LoginForm } from '../components/LoginForm'

export function LoginPage() {
  return (
    <div className="min-h-screen bg-[#f5f6fa] flex">
      <div className="hidden lg:flex flex-col justify-between w-[420px] bg-brand-600 p-10 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/20">
            <Waves className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-semibold text-lg">Onda Finance</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-white text-3xl font-semibold leading-snug">
            Sua vida financeira, no ritmo certo.
          </h1>
          <p className="text-brand-200 text-sm leading-relaxed">
            Gerencie seu dinheiro com simplicidade e segurança. Transferências, saldo e extratos em um só lugar.
          </p>
        </div>

        <p className="text-brand-300 text-xs">© 2025 Onda Finance</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-8">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-600">
              <Waves className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">Onda Finance</span>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">Entrar</h2>
            <p className="text-muted-foreground text-sm">
              Acesse sua conta para continuar
            </p>
          </div>

          <LoginForm />

        </div>
      </div>
    </div>
  )
}
