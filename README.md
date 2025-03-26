# Sistema de Gerenciamento de Férias

Sistema web para gerenciamento de solicitações de férias, desenvolvido com Next.js.

## 🚀 Como Executar

1. Clone o repositório:
```bash
git clone https://github.com/galindoptbr/frontend-ferias.git
cd frontend-ferias
```

2. Configure o ambiente:
```bash
# Copie o arquivo de exemplo
cp .env.example .env.local

# Edite o .env.local com a URL da sua API
# Em desenvolvimento: http://localhost:3000
# Em produção: https://vacation-node-api.vercel.app
```

3. Instale as dependências e execute:
```bash
npm install
npm run dev
```

O projeto estará disponível em `http://localhost:3001`

## 📝 Requisitos

- Node.js 14+
- NPM ou Yarn
- Backend da API rodando (porta 3000)

## 🔑 Funcionalidades

- Autenticação de usuários
- Solicitação de férias
- Aprovação/rejeição de solicitações (admin)
- Gerenciamento de usuários (admin)

## 👥 Tipos de Usuário

### Funcionário
- Visualiza suas solicitações
- Cria novas solicitações
- Deleta solicitações pendentes

### Administrador
- Gerencia todas as solicitações
- Aprova/rejeita solicitações
- Gerencia usuários do sistema
