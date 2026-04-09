import type { TransferFormData } from '@/features/transfers/schemas/transferSchema'

export interface Transaction {
  id: string
  amount: number
  type: 'credit' | 'debit'
  date: string
  description: string
  counterpart: string
  category: string
}

export interface TransferPayload {
  recipientName: string
  recipientKey: string
  amount: number
  description?: string
}

export interface TransferConfirmProps {
  data: TransferFormData
  balance: number
  isSubmitting: boolean
  onConfirm: () => void
  onBack: () => void
}

export interface TransferFormProps {
  balance: number
  onSubmit: (data: TransferFormData) => void
}

export interface TransferSuccessProps {
  data: TransferFormData
  newBalance: number
  onReset: () => void
}
