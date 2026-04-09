import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { formatCurrency, formatDate } from '@/shared/lib/utils'
import { Badge } from '@/shared/components/ui/badge'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import type { Transaction } from '@/shared/types'

function TransactionRow({ tx }: { tx: Transaction }) {
  const isCredit = tx.type === 'credit'
  return (
    <div className="flex items-center gap-4 py-3.5 border-b border-border last:border-0">
      <div
        className={`flex items-center justify-center w-9 h-9 rounded-full shrink-0 ${
          isCredit ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-500'
        }`}
      >
        {isCredit ? (
          <ArrowDownLeft className="w-4 h-4" />
        ) : (
          <ArrowUpRight className="w-4 h-4" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{tx.description}</p>
        <p className="text-xs text-muted-foreground truncate">{tx.counterpart}</p>
      </div>

      <div className="text-right shrink-0">
        <p
          className={`text-sm font-semibold tabular-nums ${
            isCredit ? 'text-emerald-600' : 'text-foreground'
          }`}
        >
          {isCredit ? '+' : '-'} {formatCurrency(tx.amount)}
        </p>
        <p className="text-xs text-muted-foreground">{formatDate(tx.date)}</p>
      </div>

      <Badge
        variant={isCredit ? 'success' : 'secondary'}
        className="hidden sm:inline-flex shrink-0"
      >
        {tx.category}
      </Badge>
    </div>
  )
}

function TransactionSkeleton() {
  return (
    <div className="flex items-center gap-4 py-3.5 border-b border-border last:border-0">
      <Skeleton className="w-9 h-9 rounded-full" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3.5 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
      <div className="text-right space-y-1.5">
        <Skeleton className="h-3.5 w-20 ml-auto" />
        <Skeleton className="h-3 w-16 ml-auto" />
      </div>
    </div>
  )
}

interface TransactionListProps {
  transactions: Transaction[] | undefined
  isLoading: boolean
}

export function TransactionList({ transactions, isLoading }: TransactionListProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Últimas transações</CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-2">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <TransactionSkeleton key={i} />)
        ) : !transactions?.length ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Nenhuma transação encontrada.
          </p>
        ) : (
          transactions.map((tx) => <TransactionRow key={tx.id} tx={tx} />)
        )}
      </CardContent>
    </Card>
  )
}
