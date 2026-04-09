import { Loader2 } from 'lucide-react'
import { formatCurrency } from '@/shared/lib/utils'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import type { TransferConfirmProps } from '@/shared/types/transaction'

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
        className={`text-sm text-right break-all ${mono ? 'font-mono' : 'font-medium'} ${
          highlight ? 'text-brand-700 font-semibold text-base' : ''
        }`}
      >
        {value}
      </span>
    </div>
  )
}

export function TransferConfirm({
  data,
  balance,
  isSubmitting,
  onConfirm,
  onBack,
}: TransferConfirmProps) {
  const amount = parseFloat(data.amount.replace(',', '.'))

  return (
    <div className="max-w-md mx-auto space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Confirmar transferência</h1>
        <p className="text-sm text-muted-foreground">
          Verifique os dados antes de confirmar
        </p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <Row label="Destinatário" value={data.recipientName} />
          <Row label="Chave PIX" value={data.recipientKey} mono />
          <Row label="Valor" value={formatCurrency(amount)} highlight />
          {data.description && (
            <Row label="Descrição" value={data.description} />
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
          onClick={onBack}
          disabled={isSubmitting}
        >
          Voltar
        </Button>
        <Button className="flex-1" onClick={onConfirm} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Enviando…
            </>
          ) : (
            'Confirmar'
          )}
        </Button>
      </div>
    </div>
  )
}
