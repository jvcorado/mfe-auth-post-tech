# Guia de Integração - API Laravel Byte Bank

Este guia explica como a integração com a API Laravel foi implementada no frontend Next.js.

## 📋 Resumo da Integração

A integração foi concluída com sucesso! O frontend agora está totalmente conectado à API Laravel do Byte Bank, substituindo o antigo sistema que usava JSON Server.

## 🔧 Principais Mudanças

### 1. **Cliente API (axios)**
- **Arquivo**: `src/lib/api.ts`
- **Funcionalidades**:
  - Configuração centralizada do axios
  - Interceptors para autenticação automática
  - Tratamento de erros com toast notifications
  - Tipos TypeScript para todas as respostas

### 2. **Serviços Atualizados**

#### AuthService (`src/services/AuthService.ts`)
- ✅ Login com email/senha
- ✅ Registro com nome/email/senha
- ✅ Logout com limpeza de tokens
- ✅ Verificação de autenticação
- ✅ Dados do usuário atual

#### AccountService (`src/services/AccountService.ts`)
- ✅ Listar todas as contas
- ✅ Buscar conta por ID com transações
- ✅ Criar nova conta
- ✅ Atualizar conta existente
- ✅ Deletar conta

#### TransactionService (`src/services/TransactionService.ts`)
- ✅ Criar transação (INCOME/EXPENSE)
- ✅ Atualizar transação
- ✅ Deletar transação

### 3. **Modelos Atualizados**

#### User (`src/models/User.ts`)
- Novo modelo para dados do usuário
- Campos: id, name, email, created_at, updated_at

#### Account (`src/models/Account.ts`)
- Atualizado para API Laravel
- Campos: id, name, balance, user_id, transactions_count
- Métodos: getFormattedBalance(), hasSufficientBalance()

#### Transaction (`src/models/Transaction.ts`)
- Atualizado para API Laravel
- Campos: id, type, amount, account_id, created_at, updated_at
- Métodos: getFormattedAmount(), getFormattedDate(), isIncome(), isExpense()

### 4. **Contextos Atualizados**

#### AuthContext (`src/context/AuthContext.tsx`)
- ✅ Gerenciamento de usuário e tokens
- ✅ Login/logout com feedback visual
- ✅ Carregamento automático de dados
- ✅ Verificação de autenticação

#### BankContext (`src/context/BankContext.tsx`)
- ✅ Gerenciamento de múltiplas contas
- ✅ Seleção de conta ativa
- ✅ CRUD completo de contas e transações
- ✅ Sincronização com AuthContext

### 5. **Páginas Atualizadas**

#### Login (`src/app/login/page.tsx`)
- ✅ Formulário com email/senha
- ✅ Validação de campos
- ✅ Feedback de loading
- ✅ Tratamento de erros

#### Register (`src/app/register/page.tsx`)
- ✅ Formulário com nome/email/senha
- ✅ Confirmação de senha
- ✅ Validação completa
- ✅ Feedback visual

#### Home (`src/app/page.tsx`)
- ✅ Dashboard com dados do usuário
- ✅ Resumo de contas
- ✅ Seleção de conta ativa
- ✅ Proteção de rota

## 🚀 Como Usar

### 1. **Configuração da API**
```typescript
// src/config/api.ts
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8000/api', // URL da sua API Laravel
  // ... outras configurações
};
```

### 2. **Variáveis de Ambiente**
Crie um arquivo `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 3. **Executar o Projeto**
```bash
npm run dev
```

### 4. **Testar a Integração**
1. Acesse `http://localhost:3000`
2. Crie uma conta ou faça login
3. Explore as funcionalidades do dashboard

## 🔐 Autenticação

### Sistema de Tokens
- **Tipo**: Bearer Token (Laravel Sanctum)
- **Armazenamento**: localStorage
- **Renovação**: Automática via interceptors
- **Expiração**: Redirecionamento automático para login

### Fluxo de Autenticação
1. Usuário faz login → recebe token
2. Token é salvo no localStorage
3. Todas as requisições incluem o token automaticamente
4. Se token expira → usuário é redirecionado para login

## 📊 Estrutura de Dados

### Usuário
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}
```

### Conta
```typescript
interface Account {
  id: number;
  name: string;
  balance: number;
  user_id?: number;
  transactions_count?: number;
  created_at: string;
  updated_at: string;
}
```

### Transação
```typescript
interface Transaction {
  id: number;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  account_id: number;
  created_at: string;
  updated_at: string;
}
```

## 🛠️ Tratamento de Erros

### Interceptors Automáticos
- **401 Unauthorized**: Logout automático + redirecionamento
- **422 Validation Error**: Exibição de erros específicos
- **500 Server Error**: Mensagem genérica de erro

### Toast Notifications
- Feedback visual para todas as ações
- Sucesso: verde
- Erro: vermelho
- Carregamento: indicadores visuais

## 🔄 Sincronização de Dados

### Contextos Interligados
- **AuthContext**: Gerencia usuário e autenticação
- **BankContext**: Gerencia contas e transações
- **Sincronização**: Automática entre contextos

### Atualizações em Tempo Real
- Saldos atualizados após transações
- Lista de contas sincronizada
- Estado global consistente

## 🎨 Interface do Usuário

### Componentes Atualizados
- Formulários de login/registro
- Dashboard responsivo
- Cards informativos
- Feedback visual consistente

### Experiência do Usuário
- Loading states
- Error handling
- Navegação intuitiva
- Design responsivo

## 📝 Próximos Passos

### Funcionalidades Sugeridas
1. **Filtros de Transações**: Por data, tipo, valor
2. **Relatórios**: Gráficos e estatísticas
3. **Exportação**: PDF/Excel das transações
4. **Notificações**: Push notifications
5. **Temas**: Dark/Light mode

### Melhorias Técnicas
1. **Cache**: React Query ou SWR
2. **Offline**: Service Workers
3. **Testes**: Jest + Testing Library
4. **Performance**: Code splitting
5. **SEO**: Metadata dinâmico

## 🐛 Resolução de Problemas

### Problemas Comuns

#### 1. **Erro de CORS**
```bash
# Na API Laravel, configure CORS corretamente
php artisan config:publish cors
```

#### 2. **Token Expirado**
- O sistema redireciona automaticamente para login
- Verifique a configuração do Sanctum

#### 3. **Erro de Conexão**
- Verifique se a API Laravel está rodando
- Confirme a URL em `src/config/api.ts`

#### 4. **Dados Não Carregam**
- Verifique o console do navegador
- Confirme se o usuário está autenticado

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique o console do navegador
2. Confirme a configuração da API
3. Teste os endpoints diretamente
4. Verifique os logs do Laravel

---

## ✅ Status da Integração

- [x] Autenticação completa
- [x] Gerenciamento de contas
- [x] Transações CRUD
- [x] Interface atualizada
- [x] Tratamento de erros
- [x] Feedback visual
- [x] Proteção de rotas
- [x] Sincronização de dados

**🎉 Integração 100% Concluída!** 