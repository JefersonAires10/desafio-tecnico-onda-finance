import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRightLeft, Info } from 'lucide-react'
import { transferSchema, type TransferFormData } from '../schemas/transferSchema'
import { formatCurrency } from '@/shared/lib/utils'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/shared/components/ui/card'
import type { TransferFormProps } from '@/shared/types/transaction'

export function TransferForm({ balance, onSubmit }: TransferFormProps) {
  const {
    register,
    handleSubmit,
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
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
