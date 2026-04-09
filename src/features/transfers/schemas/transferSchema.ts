import { z } from 'zod'

export const transferSchema = z.object({
  recipientName: z.string().min(1, 'Informe o nome do destinatário'),
  keyType: z.enum(['cpf', 'email', 'phone', 'random']),
  recipientKey: z.string().min(1, 'Informe a chave PIX'),
  amount: z.string().min(1, 'Informe o valor'),
  description: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.keyType === 'cpf') {
    if (!/^\d{11}$/.test(data.recipientKey)) {
      ctx.addIssue({
        path: ['recipientKey'],
        code: z.ZodIssueCode.custom,
        message: 'CPF inválido (informe 11 números, sem pontos ou traços)',
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
    if (!/^\d{10,11}$/.test(data.recipientKey)) {
      ctx.addIssue({
        path: ['recipientKey'],
        code: z.ZodIssueCode.custom,
        message: 'Telefone inválido (informe DDD + Número, apenas dígitos)',
      })
    }
  }
})

export type TransferFormData = z.infer<typeof transferSchema>
