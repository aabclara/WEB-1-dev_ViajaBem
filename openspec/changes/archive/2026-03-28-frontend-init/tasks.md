# Tasks: Inicialização do Frontend Viaje Bem

## 1. Configurações Base do Projeto (Node/TS/Tailwind)

- [x] 1.1 Criar `frontend/package.json` com dependências: `next`, `react`, `react-dom`, `tailwindcss`, `axios`, `lucide-react`, `clsx`, `tailwind-merge`.
- [x] 1.2 Criar `frontend/tsconfig.json` configurado para Next.js e TypeScript estrito (proibido `any`).
- [x] 1.3 Criar `frontend/tailwind.config.ts` com suporte à linguagem ubíqua e ícones `lucide-react`.
- [x] 1.4 Criar `frontend/postcss.config.js` básico para processamento do Tailwind.

## 2. Estrutura App Router e Código Inicial (Português)

- [x] 2.1 Criar `frontend/app/globals.css` com as diretivas `@tailwind`.
- [x] 2.2 Criar `frontend/app/layout.tsx` (Layout Raiz) com metadados em português e configuração de fonte Inter/Roboto.
- [x] 2.3 Criar `frontend/app/page.tsx` (Página Inicial) implementando a estrutura básica da vitrine em português.
- [x] 2.4 Criar `frontend/lib/api.ts` para centralizar a instância do Axios apontando para o backend FastAPI.

## 3. Validação de Build e Infra

- [x] 3.1 Verificar se o `Dockerfile` de frontend existente é compatível com a nova estrutura.
- [x] 3.2 Executar `docker-compose up --build frontend` para validar a build do container.
- [x] 3.3 Resolver quaisquer erros de tipagem TypeScript ou dependências ausentes.
