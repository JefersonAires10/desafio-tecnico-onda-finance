# Onda Finance 🌊

App bancário simulado desenvolvido como desafio técnico front-end para a JobZ Talentos / Onda Finance.

## 🔗 Demo

> [https://github.com/JefersonAires10/desafio-tecnico-onda-finance.git]

---

## 🚀 Como rodar o projeto

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

```bash
git clone https://github.com/JefersonAires10/desafio-tecnico-onda-finance.git
cd onda-finance
npm install
npm run dev
```

Acesse em: `http://localhost:5173`

### Credenciais de demonstração

| Campo  | Valor                  |
| ------ | ---------------------- |
| E-mail | joao@ondafinance.com   |
| Senha  | 123456                 |

### Testes

```bash
npm test
```

### Build de produção

```bash
npm run build && npm run preview
```

---

## 🏗️ Arquitetura: Feature-Based

O projeto adota uma **arquitetura orientada a features** (feature-based / vertical slices), onde cada domínio de negócio é uma mini-aplicação autônoma. Isso contrasta com a abordagem layer-based convencional onde os arquivos são agrupados por tipo (pages/, hooks/, services/…).

### Por que feature-based?

| Critério | Layer-based | Feature-based |
|---|---|---|
| Coesão | Baixa — arquivos de uma feature espalhados | Alta — tudo relacionado fica junto |
| Escalabilidade | Difícil — cresce em largura | Fácil — nova pasta por feature |
| Deleção | Arriscada — dependências cruzadas | Segura — deleta a pasta inteira |
| Onboarding | Lento — precisa entender a estrutura global | Rápido — lê uma feature de cada vez |
| Code ownership | Difuso | Claro — times podem ownar features inteiras |

### Estrutura de pastas

```
src/
├── app/                          # Camada de configuração global
│   ├── layout/AppLayout.tsx      # Shell com sidebar + header
│   ├── providers/index.tsx       # QueryClient, futuros providers
│   └── router/index.tsx          # React Router + guards de autenticação
│
├── features/                     # Domínios de negócio — cada um autônomo
│   ├── auth/
│   │   ├── hooks/useAuth.ts      # signIn / signOut encapsulados
│   │   ├── pages/LoginPage.tsx
│   │   ├── services/authService.ts
│   │   ├── store/authStore.ts    # Zustand + persist
│   │   └── index.ts              # ← API pública da feature
│   │
│   ├── dashboard/
│   │   ├── components/           # BalanceCard, SummaryCards, TransactionList
│   │   ├── hooks/useTransactions.ts
│   │   ├── pages/DashboardPage.tsx
│   │   ├── services/transactionService.ts
│   │   └── index.ts              # ← API pública da feature
│   │
│   └── transfer/
│       ├── components/           # TransferForm, TransferConfirm, TransferSuccess
│       ├── pages/TransferPage.tsx  # Orquestra form → confirm → success
│       ├── schemas/transferSchema.ts
│       ├── services/transferService.ts
│       └── index.ts              # ← API pública da feature
│
├── shared/                       # Genuinamente global — sem lógica de negócio
│   ├── components/ui/            # Button, Card, Input… (shadcn/ui + CVA)
│   ├── lib/utils.ts              # cn(), formatCurrency(), formatDate()
│   └── types/index.ts            # User, Transaction
│
└── __tests__/transfer.test.tsx   # 5 testes Vitest + Testing Library
```

### O padrão index.ts (API pública da feature)

Cada feature expõe apenas o que outras partes precisam. O resto é detalhe de implementação:

```ts
// features/transfer/index.ts  ← só isso é importável de fora
export { TransferPage }    from './pages/TransferPage'
export { transferSchema }  from './schemas/transferSchema'
export type { TransferFormData } from './schemas/transferSchema'

// Nunca exportado (detalhe interno):
// TransferForm, TransferConfirm, TransferSuccess, transferService
```

O router consome apenas barrel exports:

```ts
import { LoginPage, useAuthStore } from '@/features/auth'
import { DashboardPage }           from '@/features/dashboard'
import { TransferPage }            from '@/features/transfer'
```

---

## ⚙️ Stack e decisões técnicas

| Tecnologia | Decisão |
|---|---|
| React 18 + TypeScript | Tipagem estática elimina classes inteiras de bugs em runtime |
| Vite | Build extremamente rápido com HMR eficiente |
| Tailwind + CVA | Consistência visual; CVA permite variantes tipadas sem duplicar classes |
| shadcn/ui + Radix | Componentes acessíveis (ARIA, focus, keyboard) sem acoplamento a biblioteca fechada |
| React Router v6 | Guards de autenticação com Outlet sem rerenders desnecessários |
| React Query v5 | Cache, refetch e skeletons sem boilerplate; queryKey por feature evita colisões |
| Zustand + persist | Store mínimo; persist serializa sessão no localStorage sem configuração extra |
| React Hook Form + Zod | Formulários performáticos (re-render só no campo alterado); schema Zod reutilizável |
| Axios | Interceptors centralizados para token e erros HTTP |
| Vitest | Mesmo ecossistema do Vite; zero configuração extra |

---

## 🔒 Segurança (discussão técnica)

> Nota: estas são medidas que seriam adotadas em produção. O projeto atual é uma simulação.

### Contra engenharia reversa

| Ameaça | Mitigação |
|---|---|
| Leitura do bundle JS | Ofuscação com javascript-obfuscator ou Terser agressivo no build |
| Extração de segredos | Nunca armazenar chaves no código cliente — lógica sensível fica no backend |
| Análise de tráfego | TLS obrigatório + HSTS no servidor |
| Tokens expostos | HttpOnly cookies + refresh token rotation |
| Endpoints descobertos | API proxied em domínio próprio |

### Contra vazamento de dados

| Ameaça | Mitigação |
|---|---|
| XSS | CSP no servidor; evitar dangerouslySetInnerHTML |
| CSRF | Tokens CSRF + SameSite=Strict nos cookies |
| localStorage | Criptografia dos dados persistidos; limpeza no logout |
| Dados em trânsito | TLS 1.3 + certificate pinning mobile |
| Acesso não autorizado | JWT 15 min + refresh token rotation + rate limiting |
| Enumeração de contas | Mensagens de erro genéricas no login |

---

## 🔮 Melhorias futuras

- [ ] Paginação e filtros nas transações
- [ ] Gráfico de gastos por categoria (recharts)
- [ ] Extrato exportável em PDF/CSV
- [ ] Dark mode com CSS variables
- [ ] PWA para instalação mobile
- [ ] Testes E2E com Playwright
- [ ] Storybook para documentação dos componentes shared/
- [ ] Notificações push via WebSockets


