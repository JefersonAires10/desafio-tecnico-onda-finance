import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, CheckCircle2, ArrowRightLeft, Info } from 'lucide-react'
import { performTransfer } from '@/services/transaction.service'
import { useAuthStore } from '@/store/authStore'
import { transferSchema, type TransferFormData } from '@/schemas/transferSchema'
import { formatCurrency } from '@/lib/utils'
import { toast } from '@/components/ui/toaster'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

type Step = 'form' | 'confirm' | 'success'

export default function Transfer() {
  const { balance, updateBalance } = useAuthStore()
  const [step, setStep] = useState<Step>('form')
  const [pending, setPending] = useState<TransferFormData | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      keyType: 'cpf',
    },
  })

  const amountRaw = watch('amount') ?? ''
  const amountNum = parseFloat(amountRaw.replace(',', '.')) || 0
  const isInsufficient = amountNum > balance
  const keyType = watch('keyType')

  function onFormSubmit(data: TransferFormData) {
    setPending(data)
    setStep('confirm')
  }

  async function onConfirm() {
    if (!pending) return
    setIsSubmitting(true)
    try {
      const amount = parseFloat(pending.amount.replace(',', '.'))
      const { newBalance } = await performTransfer(
        { ...pending, amount },
        balance
      )
      updateBalance(newBalance)
      setStep('success')
    } catch (e: unknown) {
      toast({
        variant: 'destructive',
        title: 'Erro na transferência',
        description: e instanceof Error ? e.message : 'Tente novamente',
      })
      setStep('form')
    } finally {
      setIsSubmitting(false)
    }
  }

  function onReset() {
    reset()
    setPending(null)
    setStep('form')
  }

  // ─── Success ───────────────────────────────────────────────────────────────
  if (step === 'success') {
    return (
      <div className="max-w-md mx-auto">
        <Card>
          <CardContent className="p-10 flex flex-col items-center text-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">Transferência realizada!</h2>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(parseFloat(pending!.amount.replace(',', '.')))} enviados para{' '}
                <span className="font-medium text-foreground">{pending!.recipientName}</span>.
              </p>
            </div>
            <div className="w-full rounded-lg bg-muted px-4 py-3 text-sm text-left space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Novo saldo</span>
                <span className="font-semibold tabular-nums">{formatCurrency(balance)}</span>
              </div>
            </div>
            <Button className="w-full" onClick={onReset}>
              Nova transferência
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ─── Confirm ───────────────────────────────────────────────────────────────
  if (step === 'confirm' && pending) {
    const amount = parseFloat(pending.amount.replace(',', '.'))
    return (
      <div className="max-w-md mx-auto space-y-4">
        <div>
          <h1 className="text-xl font-semibold">Confirmar transferência</h1>
          <p className="text-sm text-muted-foreground">Verifique os dados antes de confirmar</p>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            <Row label="Destinatário" value={pending.recipientName} />
            <Row label="Tipo de Chave" value={
              pending.keyType === 'cpf' ? 'CPF' :
                pending.keyType === 'email' ? 'E-mail' :
                  pending.keyType === 'phone' ? 'Telefone' : 'Chave Aleatória'
            } />
            <Row label="Chave PIX" value={pending.recipientKey} mono />
            <Row label="Valor" value={formatCurrency(amount)} highlight />
            {pending.description && (
              <Row label="Descrição" value={pending.description} />
            )}
            <div className="border-t border-border pt-4">
              <Row
                label="Saldo após transferência"
                value={formatCurrency(balance - amount)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setStep('form')}
            disabled={isSubmitting}
          >
            Voltar
          </Button>
          <Button className="flex-1" onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Enviando…</>
            ) : (
              'Confirmar'
            )}
          </Button>
        </div>
      </div>
    )
  }

  // ─── Form ──────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-md mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Transferência PIX</h1>
        <p className="text-sm text-muted-foreground">
          Saldo disponível:{' '}
          <span className="font-semibold text-foreground tabular-nums">
            {formatCurrency(balance)}
          </span>
        </p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-brand-600" />
            Dados da transferência
          </CardTitle>
          <CardDescription>Preencha os dados do destinatário</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="recipientName">Nome do destinatário</Label>
              <Input
                id="recipientName"
                placeholder="Ex: Maria Oliveira"
                {...register('recipientName')}
              />
              {errors.recipientName && (
                <p className="text-xs text-destructive">{errors.recipientName.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="keyType">Tipo de Chave PIX</Label>
              <select
                id="keyType"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                {...register('keyType')}
              >
                <option value="cpf">CPF</option>
                <option value="email">E-mail</option>
                <option value="phone">Telefone</option>
                <option value="random">Chave Aleatória</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="recipientKey">Chave PIX</Label>
              <Input
                id="recipientKey"
                placeholder={
                  keyType === 'cpf' ? 'Apenas números (11 dígitos)' :
                    keyType === 'email' ? 'exemplo@email.com' :
                      keyType === 'phone' ? '(DDD) 99999-9999' :
                        'Chave em formato UUID'
                }
                {...register('recipientKey')}
              />
              {errors.recipientKey && (
                <p className="text-xs text-destructive">{errors.recipientKey.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                placeholder="0,00"
                inputMode="decimal"
                {...register('amount')}
              />
              {errors.amount && (
                <p className="text-xs text-destructive">{errors.amount.message}</p>
              )}
              {isInsufficient && !errors.amount && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <Info className="w-3 h-3" /> Saldo insuficiente
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">
                Descrição{' '}
                <span className="text-muted-foreground font-normal">(opcional)</span>
              </Label>
              <Input
                id="description"
                placeholder="Ex: Almoço, pagamento de conta..."
                {...register('description')}
              />
              {errors.description && (
                <p className="text-xs text-destructive">{errors.description.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isInsufficient}
            >
              Continuar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function Row({
  label,
  value,
  mono,
  highlight,
}: {
  label: string
  value: string
  mono?: boolean
  highlight?: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      <span
        className={`text-sm text-right break-all ${mono ? 'font-mono' : 'font-medium'
          } ${highlight ? 'text-brand-700 font-semibold text-base' : ''}`}
      >
        {value}
      </span>
    </div>
  )
}
