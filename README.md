# 🔐 MFE Auth - Sistema de Autenticação

## 📋 Descrição

O MFE Auth é responsável por toda a autenticação do ByteBank, oferecendo login, registro e gerenciamento de sessão com comunicação integrada ao MFE Core.

## 🏗️ Arquitetura

### Responsabilidades
- **Autenticação**: Login e registro de usuários
- **Validação**: Validação de formulários e credenciais
- **Comunicação**: Envio de tokens para MFE Core
- **Segurança**: Gerenciamento seguro de sessões
- **UX**: Interface intuitiva para autenticação

### Estrutura de Pastas
```
src/
├── app/                    # Páginas Next.js
│   ├── login/             # Página de login
│   │   ├── layout.tsx     # Layout da página de login
│   │   └── page.tsx       # Componente de login
│   ├── register/          # Página de registro
│   │   ├── layout.tsx     # Layout da página de registro
│   │   └── page.tsx       # Componente de registro
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página inicial
├── components/            # Componentes reutilizáveis
│   ├── actionButton.tsx   # Botão de ação
│   ├── button.tsx         # Botão base
│   ├── container.tsx      # Container responsivo
│   ├── input.tsx          # Campo de entrada
│   └── ui/                # Componentes UI base
├── context/               # Contextos React
│   └── AuthContext.tsx    # Contexto de autenticação
├── services/              # Serviços de API
│   ├── AuthService.ts     # Serviço de autenticação
│   ├── AccountService.ts  # Serviço de contas
│   └── TransactionService.ts # Serviço de transações
├── models/                # Modelos de dados
│   ├── User.ts           # Modelo de usuário
│   ├── Account.ts        # Modelo de conta
│   ├── Transaction.ts    # Modelo de transação
│   └── TransactionType.ts # Tipos de transação
├── config/                # Configurações
│   ├── api.ts            # Configuração da API
│   └── security.ts       # Configurações de segurança
├── lib/                   # Utilitários
│   ├── api.ts            # Cliente HTTP
│   ├── formatCurrency.ts # Formatação de moeda
│   └── utils.ts          # Utilitários gerais
└── context/               # Contextos adicionais
    └── BankContext.tsx    # Contexto bancário
```

## 🚀 Tecnologias

- **Next.js 14** com App Router
- **TypeScript**
- **Tailwind CSS**
- **React Hot Toast** para notificações
- **Lucide React** para ícones
- **Axios** para requisições HTTP
- **React Hook Form** para formulários

## 🔧 Instalação

```bash
cd mfe-auth-post-tech
npm install
npm run dev
```

## 🔐 Sistema de Autenticação

### Fluxo de Login
1. Usuário preenche formulário de login
2. Validação client-side dos campos
3. Requisição para API Laravel
4. Recebimento do token JWT
5. Armazenamento local do token
6. Comunicação com MFE Core
7. Redirecionamento para dashboard

### Fluxo de Registro
1. Usuário preenche formulário de registro
2. Validação client-side dos campos
3. Requisição para API Laravel
4. Criação do usuário e conta
5. Recebimento do token JWT
6. Armazenamento local do token
7. Comunicação com MFE Core
8. Redirecionamento para dashboard

### Comunicação com MFE Core

```typescript
// Após login bem-sucedido
window.parent.postMessage({
  type: "AUTH_SUCCESS",
  token: token
}, "*");

// Após logout
window.parent.postMessage({
  type: "AUTH_LOGOUT"
}, "*");
```

## 📝 Formulários

### Login
- **Email**: Campo obrigatório com validação de formato
- **Senha**: Campo obrigatório com mínimo de 6 caracteres
- **Lembrar-me**: Checkbox opcional
- **Esqueci a senha**: Link para recuperação (futuro)

### Registro
- **Nome**: Campo obrigatório com mínimo de 2 caracteres
- **Email**: Campo obrigatório com validação de formato único
- **Senha**: Campo obrigatório com mínimo de 6 caracteres
- **Confirmar Senha**: Campo obrigatório com validação de igualdade

### Validações

#### Client-side
```typescript
// Validação de email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  throw new Error('Email inválido');
}

// Validação de senha
if (password.length < 6) {
  throw new Error('A senha deve ter pelo menos 6 caracteres');
}

// Validação de confirmação de senha
if (password !== confirmPassword) {
  throw new Error('As senhas não coincidem');
}
```

#### Server-side
- Validação de email único
- Hash seguro de senha
- Sanitização de dados
- Rate limiting

## 🎨 Interface do Usuário

### Design System
- **Cores**: Paleta consistente com outros MFEs
- **Tipografia**: Hierarquia clara de textos
- **Espaçamento**: Sistema de espaçamento consistente
- **Componentes**: Reutilizáveis e acessíveis

### Componentes Principais

#### Formulário de Login
- **Layout limpo** e focado
- **Validação visual** em tempo real
- **Mensagens de erro** claras
- **Botão de loading** durante submissão

#### Formulário de Registro
- **Layout em etapas** (opcional)
- **Validação progressiva**
- **Feedback visual** para cada campo
- **Link para login** existente

### Responsividade
- **Mobile-first** design
- **Adaptação automática** para diferentes telas
- **Touch-friendly** em dispositivos móveis
- **Acessibilidade** completa

## 🔄 API Integration

### Endpoints Utilizados

#### Autenticação
```typescript
POST /api/login - Login do usuário
POST /api/register - Registro de novo usuário
POST /api/logout - Logout do usuário
GET /api/me - Dados do usuário atual
```

### Exemplo de Requisição

```typescript
// Login
const loginData = {
  email: 'usuario@exemplo.com',
  password: 'senha123'
};

const response = await AuthService.login(loginData.email, loginData.password);
const { user, token } = response;

// Registro
const registerData = {
  name: 'João Silva',
  email: 'joao@exemplo.com',
  password: 'senha123'
};

const response = await AuthService.register(
  registerData.name,
  registerData.email,
  registerData.password
);
```

## 🔒 Segurança

### Medidas Implementadas
- **JWT Tokens** para autenticação
- **HTTPS** obrigatório em produção
- **Validação de entrada** rigorosa
- **Sanitização** de dados
- **Rate limiting** no backend
- **CORS** configurado adequadamente

### Boas Práticas
- **Senhas nunca** armazenadas em texto plano
- **Tokens com expiração** configurável
- **Logout automático** em inatividade
- **Validação de origem** das mensagens
- **Logs de auditoria** para tentativas de login

## 🐛 Debug e Logs

### Logs Importantes
- `🔍 Verificando autenticação no MFE Auth`
- `📤 Enviando token para MFE Core após login`
- `🚪 Iniciando logout`
- `📤 Enviando mensagem de logout para MFE Core`
- `❌ Erro ao fazer login`

### Console Commands
```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Testes
npm test

# Lint
npm run lint
```

## 🌐 Deploy

### Vercel
```bash
npm run build
vercel --prod
```

### Variáveis de Ambiente
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_CORE_URL=http://localhost:3000
```

## 📱 Responsividade

### Breakpoints
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

### Adaptações Mobile
- **Formulários otimizados** para touch
- **Botões maiores** para melhor usabilidade
- **Teclado virtual** adequado
- **Scroll suave** entre campos

## 🧪 Testes

### Testes Unitários
```bash
npm run test:unit
```

### Testes de Integração
```bash
npm run test:integration
```

### Testes E2E
```bash
npm run test:e2e
```

## 🔄 Integração com Outros MFEs

### MFE Core
- **Envio de tokens** após autenticação
- **Comunicação de logout** para limpeza global
- **Sincronização** de estado de autenticação

### MFE Dashboard
- **Não tem integração direta**
- **Comunicação via MFE Core**

### Backend Laravel
- **API RESTful** para autenticação
- **Validação de dados** no servidor
- **Geração de tokens JWT**
- **Gestão de sessões**

## 📊 Métricas e Analytics

### Métricas Importantes
- **Taxa de conversão** de registro
- **Taxa de sucesso** de login
- **Tempo médio** de preenchimento de formulários
- **Erros mais comuns** nos formulários

### Eventos Rastreados
- Tentativas de login
- Registros bem-sucedidos
- Erros de validação
- Logouts

## 🚀 Otimizações

### Performance
- **Lazy loading** de componentes
- **Code splitting** automático
- **Otimização de imagens**
- **Cache de formulários**

### UX
- **Feedback visual** imediato
- **Validação em tempo real**
- **Mensagens de erro** claras
- **Loading states** informativos

---

**MFE Auth** - Segurança e simplicidade na autenticação 🔐
