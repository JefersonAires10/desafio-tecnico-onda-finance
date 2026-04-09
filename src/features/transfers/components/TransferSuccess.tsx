import { CheckCircle2 } from 'lucide-react'
import { formatCurrency } from '@/shared/lib/utils'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import type { TransferFormData } from '../schemas/transferSchema'
import type { TransferSuccessProps } from '@/shared/types/transaction'

export function TransferSuccess({ data, newBalance, onReset }: TransferSuccessProps) {
  const amount = parseFloat(data.amount.replace(',', '.'))

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
              {formatCurrency(amount)} enviados para{' '}
              <span className="font-medium text-foreground">
                {data.recipientName}
              </span>
              .
            </p>
          </div>

          <div className="w-full rounded-lg bg-muted px-4 py-3 text-sm text-left space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Novo saldo</span>
              <span className="font-semibold tabular-nums">
                {formatCurrency(newBalance)}
              </span>
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
