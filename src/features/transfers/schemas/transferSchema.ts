import { z } from 'zod'

export const transferSchema = z.object({
  recipientName: z.string().min(1, 'Informe o nome do destinatário'),
  keyType: z.enum(['cpf', 'email', 'phone', 'random']),
  recipientKey: z.string().min(1, 'Informe a chave PIX'),
  amount: z.string().min(1, 'Informe o valor'),
  description: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.keyType === 'cpf') {
    if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(data.recipientKey)) {
      ctx.addIssue({
        path: ['recipientKey'],
        code: z.ZodIssueCode.custom,
        message: 'CPF inválido (formato: 000.000.000-00)',
      })
    }
  } else if (data.keyType === 'email') {
    if (!/^\S+@\S+\.\S+$/.test(data.recipientKey)) {
      ctx.addIssue({
        path: ['recipientKey'],
        code: z.ZodIssueCode.custom,
        message: 'E-mail inválido',
      })
    }
  } else if (data.keyType === 'phone') {
    if (!/^\(\d{2}\) \d{4,5}-\d{4}$/.test(data.recipientKey)) {
      ctx.addIssue({
        path: ['recipientKey'],
        code: z.ZodIssueCode.custom,
        message: 'Telefone inválido (formato: (99) 99999-9999)',
      })
    }
  }

  const amountNum = parseFloat(data.amount.replace(/\./g, '').replace(',', '.'))
  if (isNaN(amountNum) || amountNum <= 0) {
    ctx.addIssue({
      path: ['amount'],
      code: z.ZodIssueCode.custom,
      message: 'O valor da transferência deve ser maior que zero',
    })
  }
})

export type TransferFormData = z.infer<typeof transferSchema>
