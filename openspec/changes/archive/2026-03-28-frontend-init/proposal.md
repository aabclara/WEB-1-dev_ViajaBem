# Proposal: Inicialização do Frontend Viaje Bem

## Why

O projeto "Viaje Bem" teve sua estrutura de backend iniciada, mas o frontend possui apenas um `Dockerfile`. Para que o ambiente Docker possa ser levantado com sucesso (`docker-compose up --build`), é imperativo que o diretório `frontend/` contenha o arquivo `package.json` com as dependências necessárias, além das configurações básicas do Next.js e TypeScript. Sem esses arquivos, a build do container de frontend falha, impedindo o desenvolvimento integrado da plataforma.

## What Changes

Esta mudança inicializa a base técnica do frontend, seguindo as restrições da disciplina WEB 1 e as preferências de design do projeto:

- **Configuração de Dependências (`package.json`)**: Inclusão de `next`, `react`, `react-dom`, `tailwindcss`, `axios` (para comunicação com a API FastAPI) e `lucide-react` (biblioteca de ícones obrigatória).
- **TypeScript (`tsconfig.json`)**: Configuração para um ambiente Next.js com App Router.
- **Tailwind CSS (`tailwind.config.ts`)**: Configuração inicial do framework de estilização.
- **Estrutura App Router**:
    - `app/layout.tsx`: Layout raiz da aplicação, configurando metadados e provedores iniciais.
    - `app/page.tsx`: Página inicial (Vitrine de Viagens) com estrutura em português.
- **Linguagem Ubíqua**: Todo o código (nomes de funções, variáveis e componentes) será escrito em Português do Brasil, conforme definido no contexto do projeto.

## Impact

- `frontend/package.json`: Criado com dependências base.
- `frontend/tsconfig.json`: Criado para suporte a TS.
- `frontend/tailwind.config.ts`: Criado para estilização.
- `frontend/app/layout.tsx`: Definido como layout principal.
- `frontend/app/page.tsx`: Definida como página inicial da vitrine.

## Requirement Changes

- Nenhuma mudança em requisitos existentes; esta é uma tarefa de inicialização técnica para viabilizar as especificações de "Vitrine Pública" e "Autenticação".
