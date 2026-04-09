import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { mockLogin } from '../services/authService'

export function useAuth() {
  const { user, balance, isAuthenticated, login, logout, updateBalance } =
    useAuthStore()
  const navigate = useNavigate()

  async function signIn(email: string, password: string) {
    const result = await mockLogin(email, password)
    login(result.user, result.balance)
    navigate('/dashboard')
  }

  function signOut() {
    logout()
    navigate('/login')
  }

  return { user, balance, isAuthenticated, signIn, signOut, updateBalance }
}