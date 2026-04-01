import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Waves, Eye, EyeOff, Loader2 } from 'lucide-react'
import { mockLogin, MOCK_CREDENTIALS } from '@/services/auth.service'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { loginSchema, type LoginForm } from '@/schemas/loginSchema'
import { ROUTES } from '@/router/routes'

export default function Login() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [showPass, setShowPass] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(data: LoginForm) {
    setServerError('')
    try {
      const { user, balance } = await mockLogin(data.email, data.password)
      login(user, balance)
      navigate(ROUTES.DASHBOARD)
    } catch (e: unknown) {
      setServerError(e instanceof Error ? e.message : 'Erro ao entrar')
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f6fa] flex">
      {/* Left panel */}
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

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile logo */}
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                autoComplete="email"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <button
                  type="button"
                  className="text-xs text-brand-600 hover:underline"
                >
                  Esqueceu?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••"
                  autoComplete="current-password"
                  className="pr-10"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            {serverError && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {serverError}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Entrando…</>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          {/* Demo hint */}
          <div className="rounded-lg bg-brand-50 border border-brand-100 p-4 space-y-1">
            <p className="text-xs font-semibold text-brand-700">Credenciais de demonstração</p>
            <p className="text-xs text-brand-600 font-mono">{MOCK_CREDENTIALS.email}</p>
            <p className="text-xs text-brand-600 font-mono">{MOCK_CREDENTIALS.password}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
