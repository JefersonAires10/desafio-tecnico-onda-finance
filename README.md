# Onda Finance 🌊

App bancário simulado desenvolvido como desafio técnico front-end para a JobZ Talentos / Onda Finance.

## 🔗 Demo

> [Link de produção aqui após publicação]

---

## 🚀 Como rodar o projeto

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/onda-finance.git
cd onda-finance

# Instale as dependências
npm install

# Rode em modo desenvolvimento
npm run dev
```

Acesse em: `http://localhost:5173`

### Credenciais de demonstração

| Campo | Valor |
|-------|-------|
| E-mail | `joao@ondafinance.com` |
| Senha | `123456` |

### Testes

```bash
npm test
```

### Build de produção

```bash
npm run build
npm run preview
```

---

## 🏗️ Decisões técnicas

### Estrutura de pastas

```
src/
├── __tests__/       # Testes Vitest + Testing Library
├── components/
│   ├── layout/      # AppLayout (sidebar + header)
│   └── ui/          # Componentes reutilizáveis (shadcn/ui pattern + CVA)
├── hooks/           # Custom hooks (React Query)
├── lib/             # Utilitários (cn, formatCurrency, formatDate)
├── pages/           # Login, Dashboard, Transfer
├── router/          # React Router v6 + guards de autenticação
├── schemas/         # Validação Zod (transferSchema)
├── services/        # Axios instance + funções mock de API
└── store/           # Zustand store (autenticação + saldo)
```

### Stack e justificativas

| Tecnologia | Decisão |
|---|---|
| **React 18 + TypeScript** | Tipagem estática elimina classes inteiras de bugs em runtime |
| **Vite** | Build tool extremamente rápido com HMR eficiente |
| **Tailwind + CVA** | Tailwind garante consistência visual; CVA permite variantes tipadas de componentes sem duplicar classes |
| **shadcn/ui + Radix** | Componentes acessíveis (ARIA, focus management, keyboard navigation) sem acoplamento a uma biblioteca de UI fechada — código fica no projeto |
| **React Router v6** | Aninhamento de rotas limpo; guards de autenticação com `<Outlet>` sem rerenders desnecessários |
| **React Query v5** | Gerenciamento de estado assíncrono com cache, refetch e skeleton states sem boilerplate |
| **Zustand** | Store global mínimo para sessão e saldo; `persist` middleware faz a persistência no localStorage sem configuração extra |
| **React Hook Form + Zod** | Formulários performáticos (re-render só no campo alterado); Zod garante schema único de validação compartilhável entre front e back |
| **Axios** | Interceptors centralizados para injeção de token e tratamento de erros HTTP |
| **Vitest** | Mesmo ecossistema do Vite; configuração zero para testes unitários e de componente |

### Fluxo de autenticação

1. Usuário preenche o formulário de login (validado com Zod)
2. `mockLogin()` simula latência de rede (800ms) e valida credenciais
3. Em caso de sucesso, `useAuthStore` (Zustand + `persist`) salva `user` e `balance` no `localStorage`
4. O router redireciona para `/dashboard`; rotas privadas checam `isAuthenticated` via `PrivateRoute`
5. Logout limpa o store e redireciona para `/login`

### Fluxo de transferência

O formulário de transferência usa um estado de 3 etapas (`form → confirm → success`) para garantir que o usuário revise os dados antes de confirmar, simulando o fluxo de apps bancários reais.

### Mock de API

Todas as chamadas de API são simuladas localmente em `src/services/api.ts` com delays artificiais para simular latência de rede. Em produção, bastaria apontar o `baseURL` do Axios para a API real e remover as funções mock.

---

## 🔒 Segurança (discussão técnica)

> **Nota:** Estas são medidas que seriam adotadas em um ambiente de produção real. O projeto atual é uma simulação e não implementa estas proteções.

### Proteção contra engenharia reversa

| Ameaça | Mitigação |
|---|---|
| Leitura do bundle JS | **Ofuscação de código** com ferramentas como `javascript-obfuscator` ou Terser com configurações agressivas no build |
| Extração de segredos do frontend | **Nunca armazenar chaves de API, tokens de acesso de longa duração ou segredos no código cliente.** Toda lógica sensível fica no backend |
| Análise do tráfego de rede | **TLS (HTTPS) obrigatório** em todos os ambientes; HSTS habilitado no servidor |
| Tokens expostos no localStorage | Preferir **HttpOnly cookies** para tokens de sessão (inacessíveis via JS) e usar **refresh token rotation** |
| Endpoints descobertos via bundle | Proxied API em domínio próprio; evitar expor URLs internas de microserviços |

### Proteção contra vazamento de dados

| Ameaça | Mitigação |
|---|---|
| XSS (Cross-Site Scripting) | React escapa conteúdo por padrão; evitar `dangerouslySetInnerHTML`; Content Security Policy (CSP) no servidor |
| CSRF | Tokens CSRF em formulários; `SameSite=Strict` nos cookies de sessão |
| Dados sensíveis no localStorage | Criptografia dos dados persistidos (ex: `crypto-js`); limpeza automática ao logout |
| Dados em trânsito | TLS 1.3; certificate pinning em apps mobile |
| Dados em repouso (backend) | Criptografia de dados sensíveis (AES-256); mascaramento de dados em logs |
| Acesso não autorizado | JWT de curta duração (15min) + refresh token rotation; rate limiting por IP e por conta |
| Enumeração de contas | Mensagens de erro genéricas no login (não revelar se e-mail existe) |
| Exposição de PII | Mascarar CPF/conta em tela (ex: `***.***.***-00`); logs sem dados pessoais |

---

## 🔮 Melhorias futuras

- [ ] **Paginação e filtros** nas transações (por data, categoria, tipo)
- [ ] **Gráfico de gastos** por categoria (recharts)
- [ ] **Extrato exportável** em PDF ou CSV
- [ ] **Dark mode** com `next-themes` / CSS variables
- [ ] **PWA** para instalação como app mobile
- [ ] **i18n** com `react-i18next`
- [ ] **Testes E2E** com Playwright (fluxo completo login → transferência)
- [ ] **Storybook** para documentação dos componentes
- [ ] **React Query Devtools** em modo development
- [ ] **Infinite scroll** no extrato de transações
- [ ] **Notificações push** para transações em tempo real (WebSockets)
- [ ] **Autenticação biométrica** via Web Authentication API

---

## 📄 Licença

MIT
