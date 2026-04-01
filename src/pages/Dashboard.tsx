import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRightLeft,
  Eye,
  EyeOff,
  TrendingUp,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { ROUTES } from '@/router/routes'
import { useTransactions } from '@/hooks/useTransactions'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { Transaction } from '@/types/transaction'

function TransactionRow({ tx }: { tx: Transaction }) {
  const isCredit = tx.type === 'credit'
  return (
    <div className="flex items-center gap-4 py-3.5 border-b border-border last:border-0">
      <div
        className={`flex items-center justify-center w-9 h-9 rounded-full shrink-0 ${isCredit ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-500'
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
          className={`text-sm font-semibold tabular-nums ${isCredit ? 'text-emerald-600' : 'text-foreground'
            }`}
        >
          {isCredit ? '+' : '-'} {formatCurrency(tx.amount)}
        </p>
        <p className="text-xs text-muted-foreground">{formatDate(tx.date)}</p>
      </div>

      <Badge variant={isCredit ? 'success' : 'secondary'} className="hidden sm:inline-flex shrink-0">
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

export default function Dashboard() {
  const { user, balance } = useAuthStore()
  const { data: transactions, isLoading } = useTransactions()
  const navigate = useNavigate()
  const [balanceVisible, setBalanceVisible] = useState(true)

  const credits = transactions?.filter((t) => t.type === 'credit') ?? []
  const debits = transactions?.filter((t) => t.type === 'debit') ?? []
  const totalCredits = credits.reduce((s, t) => s + t.amount, 0)
  const totalDebits = debits.reduce((s, t) => s + t.amount, 0)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-xl font-semibold">Olá, {user?.name.split(' ')[0]} 👋</h1>
        <p className="text-sm text-muted-foreground">
          Ag. {user?.agency} · Conta {user?.accountNumber}
        </p>
      </div>

      {/* Balance card */}
      <Card className="bg-brand-600 border-0 text-white">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-brand-200 text-sm font-medium">Saldo disponível</p>
              <div className="flex items-center gap-3">
                <p className="text-3xl font-semibold tracking-tight font-mono">
                  {balanceVisible ? formatCurrency(balance) : 'R$ ••••••'}
                </p>
                <button
                  onClick={() => setBalanceVisible((v) => !v)}
                  className="text-brand-300 hover:text-white transition-colors mt-1"
                >
                  {balanceVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/15">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              size="sm"
              className="bg-white text-brand-700 hover:bg-brand-50 hover:text-brand-800 shadow-none"
              onClick={() => navigate(ROUTES.TRANSFER)}
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              Transferir
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary cards */}
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

      {/* Transactions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Últimas transações</CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-2">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => <TransactionSkeleton key={i} />)
          ) : transactions?.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Nenhuma transação encontrada.
            </p>
          ) : (
            transactions?.map((tx) => <TransactionRow key={tx.id} tx={tx} />)
          )}
        </CardContent>
      </Card>
    </div>
  )
}
