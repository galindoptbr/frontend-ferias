# Sistema de Gerenciamento de Férias

Sistema web para gerenciamento de solicitações de férias desenvolvido com Next.js.

## 🚀 Como Executar

1. Clone o repositório:
```bash
git clone https://github.com/galindoptbr/frontend-ferias.git
cd frontend-ferias
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Execute o projeto:
```bash
npm run dev
# ou
yarn dev
```

O projeto estará disponível em `http://localhost:3001`

## 📋 Requisitos

- Node.js 18.17.0 ou superior
- NPM ou Yarn
- Backend API rodando na porta 3000

## ✨ Funcionalidades

- Autenticação de usuários
- Gerenciamento de solicitações de férias
- Gerenciamento de usuários (apenas para administradores)

## 👥 Tipos de Usuário

### Funcionário
- Visualizar suas solicitações de férias
- Criar novas solicitações
- Cancelar solicitações pendentes

### Administrador
- Todas as funcionalidades do funcionário
- Gerenciar usuários (promover, excluir)
- Visualizar todas as solicitações de férias
- Aprovar ou rejeitar solicitações
