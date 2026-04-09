import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { TransferPage } from '@/features/transfers'
import * as transferService from '@/features/transfers/services/transferService'

const mockUpdateBalance = vi.fn()
let mockBalance = 5000

vi.mock('@/features/auth', () => ({
  useAuthStore: (selector?: (s: { balance: number; updateBalance: typeof mockUpdateBalance }) => unknown) => {
    const state = { balance: mockBalance, updateBalance: mockUpdateBalance };
    return selector ? selector(state) : state;
  },
}))

vi.mock('@/shared/components/ui/toaster', () => ({
  toast: vi.fn(),
}))

function renderTransfer() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const user = userEvent.setup()
  const utils = render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <TransferPage />
      </MemoryRouter>
    </QueryClientProvider>
  )
  return { ...utils, user }
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
    expect(screen.getByLabelText(/Tipo de Chave PIX/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^Chave PIX$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Valor/i)).toBeInTheDocument()
  })

  it('shows validation errors when submitting empty form', async () => {
    const { user } = renderTransfer()
    await user.click(screen.getByRole('button', { name: /Continuar/i }))
    await waitFor(() => {
      expect(screen.getByText(/Informe o nome do destinatário/i)).toBeInTheDocument()
      expect(screen.getByText(/Informe a chave PIX/i)).toBeInTheDocument()
      expect(screen.getByText(/Informe o valor/i)).toBeInTheDocument()
    })
  })

  it('shows insufficient balance warning', async () => {
    const { user } = renderTransfer()
    await user.type(screen.getByLabelText(/Valor/i), '9999')
    await waitFor(() => {
      expect(screen.getByText(/Saldo insuficiente/i)).toBeInTheDocument()
    })
  })

  it('advances to confirm step on valid input', async () => {
    const { user } = renderTransfer()
    await user.type(screen.getByLabelText(/Nome do destinatário/i), 'Ana Costa')
    await user.selectOptions(screen.getByLabelText(/Tipo de Chave PIX/i), 'email')
    await user.type(screen.getByLabelText(/^Chave PIX$/i), 'ana@email.com')
    await user.type(screen.getByLabelText(/Valor/i), '100')
    await user.click(screen.getByRole('button', { name: /Continuar/i }))
    await waitFor(() => {
      expect(screen.getByText(/Confirmar transferência/i)).toBeInTheDocument()
      expect(screen.getByText('Ana Costa')).toBeInTheDocument()
    })
  })

  it('completes transfer and shows success screen', async () => {
    vi.spyOn(transferService, 'performTransfer').mockResolvedValue({ newBalance: 4900 })

    const { user } = renderTransfer()
    await user.type(screen.getByLabelText(/Nome do destinatário/i), 'Carlos Lima')
    await user.selectOptions(screen.getByLabelText(/Tipo de Chave PIX/i), 'email')
    await user.type(screen.getByLabelText(/^Chave PIX$/i), 'carlos@pix.com')
    await user.type(screen.getByLabelText(/Valor/i), '100')
    await user.click(screen.getByRole('button', { name: /Continuar/i }))
    await waitFor(() => screen.getByText(/Confirmar transferência/i))
    await user.click(screen.getByRole('button', { name: /Confirmar/i }))

    await waitFor(() => {
      expect(screen.getByText(/Transferência realizada/i)).toBeInTheDocument()
      expect(mockUpdateBalance).toHaveBeenCalledWith(4900)
    })
  })

  it('shows error toast on API failure', async () => {
    const { toast } = await import('@/shared/components/ui/toaster')
    vi.spyOn(transferService, 'performTransfer').mockRejectedValue(new Error('Saldo insuficiente'))

    const { user } = renderTransfer()
    await user.type(screen.getByLabelText(/Nome do destinatário/i), 'Bob Falha')
    await user.selectOptions(screen.getByLabelText(/Tipo de Chave PIX/i), 'email')
    await user.type(screen.getByLabelText(/^Chave PIX$/i), 'bob@pix.com')
    await user.type(screen.getByLabelText(/Valor/i), '50')
    await user.click(screen.getByRole('button', { name: /Continuar/i }))
    await waitFor(() => screen.getByText(/Confirmar transferência/i))
    await user.click(screen.getByRole('button', { name: /Confirmar/i }))

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({ variant: 'destructive' })
      )
    })
  })
})
