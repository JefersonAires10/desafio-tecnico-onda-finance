import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { ROUTES } from './routes'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import Transfer from '@/pages/Transfer'
import AppLayout from '@/components/layout/AppLayout'

function PrivateRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />
}

function PublicRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? <Navigate to={ROUTES.DASHBOARD} replace /> : <Outlet />
}

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [{ path: ROUTES.LOGIN, element: <Login /> }],
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <AppLayout />,
        errorElement: <div>Ops! Algo deu errado nesta página.</div>,
        children: [
          { path: ROUTES.DASHBOARD, element: <Dashboard /> },
          { path: ROUTES.TRANSFER, element: <Transfer /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to={ROUTES.DASHBOARD} replace /> },
])
