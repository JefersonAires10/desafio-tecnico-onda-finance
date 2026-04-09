import type { User } from '@/shared/types/user'

export const MOCK_CREDENTIALS = {
  email: 'joao@ondafinance.com',
  password: '123456',
}

const mockUser: User = {
  id: 'user-1',
  name: 'João da Silva',
  email: MOCK_CREDENTIALS.email,
  agency: '0001',
  accountNumber: '123456-7',
}

export function mockLogin(email: string, pass: string) {
  return new Promise<{ user: User; balance: number }>((resolve, reject) => {
    setTimeout(() => {
      if (email === MOCK_CREDENTIALS.email && pass === MOCK_CREDENTIALS.password) {
        resolve({ user: mockUser, balance: 15000 })
      } else {
        reject(new Error('Credenciais inválidas'))
      }
    }, 800)
  })
}
