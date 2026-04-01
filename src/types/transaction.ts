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