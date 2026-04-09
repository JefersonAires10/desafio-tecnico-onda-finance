import type { Transaction } from '@/shared/types/transaction'

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn_001',
    type: 'credit',
    description: 'Salário',
    amount: 8500.0,
    date: '2025-03-05T09:00:00Z',
    category: 'Receita',
    counterpart: 'Empresa XPTO Ltda',
  },
  {
    id: 'txn_002',
    type: 'debit',
    description: 'Aluguel',
    amount: 1800.0,
    date: '2025-03-07T10:30:00Z',
    category: 'Moradia',
    counterpart: 'Imobiliária Central',
  },
  {
    id: 'txn_003',
    type: 'debit',
    description: 'Supermercado',
    amount: 312.45,
    date: '2025-03-10T15:20:00Z',
    category: 'Alimentação',
    counterpart: 'Pão de Açúcar',
  },
  {
    id: 'txn_004',
    type: 'credit',
    description: 'Freelance',
    amount: 2000.0,
    date: '2025-03-12T11:00:00Z',
    category: 'Receita',
    counterpart: 'Cliente ABC',
  },
  {
    id: 'txn_005',
    type: 'debit',
    description: 'Streaming',
    amount: 55.9,
    date: '2025-03-14T08:00:00Z',
    category: 'Lazer',
    counterpart: 'Netflix',
  },
  {
    id: 'txn_006',
    type: 'debit',
    description: 'Farmácia',
    amount: 89.3,
    date: '2025-03-16T17:45:00Z',
    category: 'Saúde',
    counterpart: 'Drogasil',
  },
  {
    id: 'txn_007',
    type: 'credit',
    description: 'Rendimento CDB',
    amount: 145.5,
    date: '2025-03-18T00:00:00Z',
    category: 'Investimento',
    counterpart: 'Onda Finance',
  },
  {
    id: 'txn_008',
    type: 'debit',
    description: 'Restaurante',
    amount: 78.0,
    date: '2025-03-20T13:00:00Z',
    category: 'Alimentação',
    counterpart: 'Bistrô Jardins',
  },
]

export async function fetchTransactions(): Promise<Transaction[]> {
  await delay(600)
  return MOCK_TRANSACTIONS
}
