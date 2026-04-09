import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRightLeft, Eye, EyeOff, TrendingUp } from 'lucide-react'
import { formatCurrency } from '@/shared/lib/utils'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'

interface BalanceCardProps {
  balance: number
}

export function BalanceCard({ balance }: BalanceCardProps) {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(true)

  return (
    <Card className="bg-brand-600 border-0 text-white">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-brand-200 text-sm font-medium">Saldo disponível</p>
            <div className="flex items-center gap-3">
              <p className="text-3xl font-semibold tracking-tight font-mono">
                {visible ? formatCurrency(balance) : 'R$ ••••••'}
              </p>
              <button
                onClick={() => setVisible((v) => !v)}
                className="text-brand-300 hover:text-white transition-colors mt-1"
              >
                {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
            onClick={() => navigate('/transfer')}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            Transferir
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
