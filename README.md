# Sistema de Gerenciamento de Férias

## Visão Geral
Sistema web desenvolvido em Next.js para gerenciamento de solicitações de férias de funcionários. O sistema possui diferentes níveis de acesso (administrador e funcionário) e permite o controle completo do fluxo de solicitações de férias.

## Tecnologias Utilizadas

- **Frontend**:
  - Next.js 15.2.3
  - React 19.0.0
  - TypeScript
  - Tailwind CSS
  - Axios
  - React Hook Form

- **Principais Funcionalidades**:
  - Autenticação de usuários
  - Gerenciamento de solicitações de férias
  - Painel administrativo
  - Dashboard do funcionário

## Estrutura do Projeto

```
frontend-ferias/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── ferias/
│   │   │   └── nova/
│   │   │       └── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── components/
│   │   ├── AdminDashboard.tsx
│   │   ├── Dashboard.tsx
│   │   ├── FeriasForm.tsx
│   │   ├── Layout.tsx
│   │   ├── LoginForm.tsx
│   │   ├── Navbar.tsx
│   │   ├── RegisterForm.tsx
│   │   └── UserManagement.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   └── services/
│       ├── api.ts
│       ├── authService.ts
│       └── feriasService.ts
```

## Fluxos do Sistema

### 1. Autenticação

#### Login
- Usuário acessa a página de login
- Insere credenciais (email e senha)
- Sistema valida as credenciais
- Redireciona para:
  - `/admin` se for administrador
  - `/dashboard` se for funcionário comum

#### Registro
- Usuário acessa página de registro
- Preenche dados pessoais (nome, email, cargo, senha)
- Sistema valida e cria nova conta
- Redireciona para dashboard

### 2. Fluxo do Funcionário

#### Dashboard
- Visualiza suas solicitações de férias
- Status possíveis: pendente, aprovado, rejeitado
- Pode criar novas solicitações
- Pode excluir solicitações pendentes

#### Nova Solicitação
- Acessa formulário de nova solicitação
- Preenche:
  - Data de início
  - Data de fim
  - Motivo
- Sistema registra a solicitação com status "pendente"

### 3. Fluxo do Administrador

#### Painel Administrativo
- Lista todas as solicitações de férias
- Pode aprovar ou rejeitar solicitações
- Visualiza informações completas dos funcionários
- Gerencia usuários do sistema

## Serviços

### authService
- `loginWithCredentials`: Autenticação de usuários
- `register`: Registro de novos usuários
- `isAuthenticated`: Verifica estado da autenticação
- `isAdmin`: Verifica se usuário é administrador
- `logout`: Finaliza sessão do usuário

### feriasService
- `create`: Cria nova solicitação
- `list`: Lista solicitações do usuário
- `listAll`: Lista todas as solicitações (admin)
- `updateStatus`: Atualiza status da solicitação
- `delete`: Remove solicitação pendente

## Contextos

### AuthContext
- Gerencia estado global de autenticação
- Mantém informações do usuário logado
- Fornece métodos de autenticação para componentes

## Componentes Principais

### LoginForm
- Formulário de autenticação
- Validação de campos
- Tratamento de erros
- Redirecionamento baseado no tipo de usuário

### RegisterForm
- Formulário de registro
- Validações de campos
- Feedback visual de erros
- Criação de nova conta

### FeriasForm
- Formulário de solicitação de férias
- Validação de datas
- Campos obrigatórios
- Feedback de sucesso/erro

### Dashboard
- Exibição de solicitações do usuário
- Filtros e ordenação
- Ações disponíveis por status
- Interface intuitiva

### AdminDashboard
- Gerenciamento completo de solicitações
- Aprovação/Rejeição de pedidos
- Visualização detalhada
- Controles administrativos

## Segurança

- Autenticação via JWT
- Proteção de rotas
- Validação de permissões
- Tratamento de erros
- Sanitização de dados

## Considerações de UI/UX

- Design responsivo
- Feedback visual claro
- Mensagens de erro informativas
- Transições suaves
- Consistência visual
- Acessibilidade básica

## Requisitos do Sistema

- Node.js 14+
- NPM ou Yarn
- Conexão com internet
- Navegador moderno

## Instalação e Execução

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Construir para produção
npm run build

# Executar em produção
npm start
```

## Variáveis de Ambiente

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Boas Práticas

- Código tipado com TypeScript
- Componentes funcionais
- Hooks do React
- Gerenciamento de estado contextual
- Validações de formulários
- Tratamento de erros
- Feedback ao usuário
