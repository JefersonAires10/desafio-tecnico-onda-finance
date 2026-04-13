import { useAuthStore } from '@/features/auth'
import { useTransactions } from '../hooks/useTransactions'
import { BalanceCard } from '../components/BalanceCard'
import { SummaryCards } from '../components/SummaryCards'
import { TransactionList } from '../components/TransactionList'

export function DashboardPage() {
  const { user } = useAuthStore()
  const balance = useAuthStore((s) => s.balance)
  const { data: transactions, isLoading } = useTransactions()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold">
          Olá, {user?.name.split(' ')[0]}
        </h1>
        <p className="text-sm text-muted-foreground">
          Ag. {user?.agency} · Conta {user?.accountNumber}
        </p>
      </div>

      <BalanceCard balance={balance} />

      {!isLoading && transactions && (
        <SummaryCards transactions={transactions} />
      )}

      <TransactionList transactions={transactions} isLoading={isLoading} />
    </div>
  )
}
