import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { formatCurrency } from '@/shared/lib/utils'
import { Card, CardContent } from '@/shared/components/ui/card'
import type { Transaction } from '@/shared/types/transaction'

interface SummaryCardsProps {
  transactions: Transaction[]
}

export function SummaryCards({ transactions }: SummaryCardsProps) {
  const totalCredits = transactions
    .filter((t) => t.type === 'credit')
    .reduce((s, t) => s + t.amount, 0)

  const totalDebits = transactions
    .filter((t) => t.type === 'debit')
    .reduce((s, t) => s + t.amount, 0)

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardContent className="p-5 flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 shrink-0">
            <ArrowDownLeft className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Entradas</p>
            <p className="text-base font-semibold tabular-nums text-emerald-600">
              {formatCurrency(totalCredits)}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5 flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-500 shrink-0">
            <ArrowUpRight className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Saídas</p>
            <p className="text-base font-semibold tabular-nums">
              {formatCurrency(totalDebits)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
