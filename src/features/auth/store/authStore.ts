import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthState } from '@/shared/types/user'

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      balance: 0,
      isAuthenticated: false,

      login: (user, balance) =>
        set({ user, balance, isAuthenticated: true }),

      logout: () =>
        set({ user: null, balance: 0, isAuthenticated: false }),

      updateBalance: (newBalance) =>
        set({ balance: newBalance }),
    }),
    {
      name: 'onda-auth',
    }
  )
)
