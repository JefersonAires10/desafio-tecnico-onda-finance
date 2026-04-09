import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { mockLogin, MOCK_CREDENTIALS } from '../services/authService'
import { loginSchema, type LoginForm as LoginFormData } from '../schemas/loginSchema'
import { useAuthStore } from '@/features/auth/store/authStore'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { ROUTES } from '@/app/router/routes'

export function LoginForm() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [showPass, setShowPass] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(data: LoginFormData) {
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
    <div className="space-y-8 w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            autoComplete="email"
            disabled={isSubmitting}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register('email')}
          />
          {errors.email && (
            <p id="email-error" className="text-xs text-destructive" role="alert">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Senha</Label>
            <button type="button" className="text-xs text-brand-600 hover:underline">
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
              disabled={isSubmitting}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPass ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p id="password-error" className="text-xs text-destructive" role="alert">{errors.password.message}</p>
          )}
        </div>

        {serverError && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700" aria-live="polite">
            {serverError}
          </div>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Entrando…</> : 'Entrar'}
        </Button>
      </form>

      <div className="rounded-lg bg-brand-50 border border-brand-100 p-4 space-y-1">
        <p className="text-xs font-semibold text-brand-700">Credenciais de demonstração</p>
        <p className="text-xs text-brand-600 font-mono">{MOCK_CREDENTIALS.email}</p>
        <p className="text-xs text-brand-600 font-mono">{MOCK_CREDENTIALS.password}</p>
      </div>
    </div>
  )
}
