import { useState } from 'react'
import { useAuthStore } from '@/features/auth'
import { toast } from '@/shared/components/ui/toaster'
import { performTransfer } from '../services/transferService'
import { TransferForm } from '../components/TransferForm'
import { TransferConfirm } from '../components/TransferConfirm'
import { TransferSuccess } from '../components/TransferSuccess'
import type { TransferFormData } from '../schemas/transferSchema'

type Step = 'form' | 'confirm' | 'success'

export function TransferPage() {
  const { balance, updateBalance } = useAuthStore()
  const [step, setStep] = useState<Step>('form')
  const [pending, setPending] = useState<TransferFormData | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newBalance, setNewBalance] = useState(balance)

  function handleFormSubmit(data: TransferFormData) {
    setPending(data)
    setStep('confirm')
  }

  async function handleConfirm() {
    if (!pending) return
    setIsSubmitting(true)
    try {
      const amount = parseFloat(pending.amount.replace(',', '.'))
      const result = await performTransfer({ ...pending, amount }, balance)
      updateBalance(result.newBalance)
      setNewBalance(result.newBalance)
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

  function handleReset() {
    setPending(null)
    setStep('form')
  }

  if (step === 'success' && pending) {
    return (
      <TransferSuccess
        data={pending}
        newBalance={newBalance}
        onReset={handleReset}
      />
    )
  }

  if (step === 'confirm' && pending) {
    return (
      <TransferConfirm
        data={pending}
        balance={balance}
        isSubmitting={isSubmitting}
        onConfirm={handleConfirm}
        onBack={() => setStep('form')}
      />
    )
  }

  return <TransferForm balance={balance} onSubmit={handleFormSubmit} />
}
