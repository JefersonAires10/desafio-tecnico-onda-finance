import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import Transfer from '@/pages/Transfer'
import * as api from '@/services/api'

// Mock Zustand store
const mockUpdateBalance = vi.fn()
let mockBalance = 5000

vi.mock('@/store/authStore', () => ({
  useAuthStore: (selector: (s: { balance: number; updateBalance: typeof mockUpdateBalance }) => unknown) =>
    selector({ balance: mockBalance, updateBalance: mockUpdateBalance }),
}))

// Mock toast
vi.mock('@/components/ui/toaster', () => ({
  toast: vi.fn(),
}))

function renderTransfer() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <Transfer />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('Transfer page', () => {
  beforeEach(() => {
    mockBalance = 5000
    vi.clearAllMocks()
  })

  it('renders the transfer form', () => {
    renderTransfer()
    expect(screen.getByText(/Transferência PIX/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Nome do destinatário/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Chave PIX/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Valor/i)).toBeInTheDocument()
  })

  it('shows validation errors when submitting empty form', async () => {
    renderTransfer()
    await userEvent.click(screen.getByRole('button', { name: /Continuar/i }))
    await waitFor(() => {
      expect(screen.getByText(/Nome deve ter ao menos/i)).toBeInTheDocument()
      expect(screen.getByText(/Chave inválida/i)).toBeInTheDocument()
      expect(screen.getByText(/Informe o valor/i)).toBeInTheDocument()
    })
  })

  it('shows insufficient balance warning', async () => {
    renderTransfer()
    await userEvent.type(screen.getByLabelText(/Valor/i), '9999')
    await waitFor(() => {
      expect(screen.getByText(/Saldo insuficiente/i)).toBeInTheDocument()
    })
  })

  it('advances to confirm step on valid input', async () => {
    renderTransfer()
    await userEvent.type(screen.getByLabelText(/Nome do destinatário/i), 'Ana Costa')
    await userEvent.type(screen.getByLabelText(/Chave PIX/i), 'ana@email.com')
    await userEvent.type(screen.getByLabelText(/Valor/i), '100')
    await userEvent.click(screen.getByRole('button', { name: /Continuar/i }))
    await waitFor(() => {
      expect(screen.getByText(/Confirmar transferência/i)).toBeInTheDocument()
      expect(screen.getByText('Ana Costa')).toBeInTheDocument()
    })
  })

  it('completes transfer and shows success screen', async () => {
    vi.spyOn(api, 'performTransfer').mockResolvedValue({ newBalance: 4900 })

    renderTransfer()
    await userEvent.type(screen.getByLabelText(/Nome do destinatário/i), 'Carlos Lima')
    await userEvent.type(screen.getByLabelText(/Chave PIX/i), 'carlos@pix.com')
    await userEvent.type(screen.getByLabelText(/Valor/i), '100')
    await userEvent.click(screen.getByRole('button', { name: /Continuar/i }))
    await waitFor(() => screen.getByText(/Confirmar transferência/i))
    await userEvent.click(screen.getByRole('button', { name: /Confirmar/i }))

    await waitFor(() => {
      expect(screen.getByText(/Transferência realizada/i)).toBeInTheDocument()
      expect(mockUpdateBalance).toHaveBeenCalledWith(4900)
    })
  })

  it('shows error toast on API failure', async () => {
    const { toast } = await import('@/components/ui/toaster')
    vi.spyOn(api, 'performTransfer').mockRejectedValue(new Error('Saldo insuficiente'))

    renderTransfer()
    await userEvent.type(screen.getByLabelText(/Nome do destinatário/i), 'Bob Falha')
    await userEvent.type(screen.getByLabelText(/Chave PIX/i), 'bob@pix.com')
    await userEvent.type(screen.getByLabelText(/Valor/i), '50')
    await userEvent.click(screen.getByRole('button', { name: /Continuar/i }))
    await waitFor(() => screen.getByText(/Confirmar transferência/i))
    await userEvent.click(screen.getByRole('button', { name: /Confirmar/i }))

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({ variant: 'destructive' })
      )
    })
  })
})
