export interface User {
  id: string
  name: string
  email: string
  agency: string
  accountNumber: string
}

export interface AuthState {
  user: User | null
  balance: number
  isAuthenticated: boolean
  login: (user: User, balance: number) => void
  logout: () => void
  updateBalance: (newBalance: number) => void
}
