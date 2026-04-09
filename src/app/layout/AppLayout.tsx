import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  ArrowRightLeft,
  LogOut,
  Waves,
  Bell,
} from 'lucide-react'
import { useAuthStore } from '@/features/auth/store/authStore'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/components/ui/button'
import { Separator } from '@/shared/components/ui/separator'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transfer', label: 'Transferir', icon: ArrowRightLeft },
]

export default function AppLayout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-[#f5f6fa] overflow-hidden">
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-border shrink-0">
        <div className="flex items-center gap-2.5 px-6 h-16 border-b border-border">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-600">
            <Waves className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-[15px] tracking-tight text-foreground">
            Onda Finance
          </span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <Separator />

        <div className="p-4 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-100 text-brand-700 text-xs font-semibold shrink-0">
              {user?.name.charAt(0) ?? 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-red-50 gap-3 px-3"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2 md:hidden">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-brand-600">
              <Waves className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-sm">Onda Finance</span>
          </div>

          <div className="hidden md:block" />

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Bell className="w-4 h-4" />
            </Button>
          </div>
        </header>

        <nav className="md:hidden flex border-b border-border bg-white px-4 gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 px-3 py-3 text-sm font-medium border-b-2 transition-colors -mb-px',
                  isActive
                    ? 'border-brand-600 text-brand-700'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
