## Context

O frontend do Viaje Bem utiliza Next.js 15 com App Router e TypeScript. Atualmente existe apenas a rota Home (`app/page.tsx`) com estilos genéricos azuis. O Design System ja foi configurado no `tailwind.config.ts` com a fonte Montserrat e a paleta de cores Viaje Bem (`viaje-primary`, `viaje-secondary`, `viaje-tertiary`, `viaje-neutral`). Um componente `Button` reutilizavel ja existe em `frontend/src/components/Button.tsx`.

Precisamos criar o esqueleto de rotas (Login, Cadastro, Painel do Lider), atualizar a Home para o Design System, e adicionar navegacao global via componente Header.

## Goals / Non-Goals

**Goals:**
- Criar a estrutura de rotas do App Router para as 4 paginas principais (Home, Login, Cadastro, Painel).
- Adotar as cores do Design System Viaje Bem em todas as paginas.
- Criar o componente Header com navegacao global integrado ao layout.
- Manter todas as paginas como esqueleto (sem logica de negocio ou integracao com backend).

**Non-Goals:**
- Implementar formularios funcionais de login/cadastro (apenas layout).
- Integrar com API de autenticacao do backend.
- Implementar protecao de rotas ou middleware de autenticacao.
- Criar versao mobile-first ou responsiva avancada (layout basico responsivo apenas).

## Decisions

### 1. Estrutura de arquivos no App Router

**Decisao**: Usar pastas de rota do App Router (`app/login/page.tsx`, `app/cadastro/page.tsx`, `app/painel/page.tsx`).

**Motivo**: E o padrao canonico do Next.js App Router. Cada pasta de rota contem um `page.tsx` que define a pagina. Isso facilita adicionar `layout.tsx` ou `loading.tsx` especificos por rota no futuro.

**Alternativa descartada**: Usar `pages/` directory -- incompativel com a configuracao atual do projeto que usa exclusivamente App Router.

### 2. Header como componente em `src/components/`

**Decisao**: Criar `Header.tsx` em `frontend/src/components/` e importa-lo no `app/layout.tsx`.

**Motivo**: O diretorio `src/components/` ja foi estabelecido com o `Button.tsx`. O layout raiz (`layout.tsx`) renderiza em todas as rotas, garantindo que o Header apareca sempre. Usar `next/link` para navegacao client-side sem recarregar a pagina.

**Alternativa descartada**: Criar um `app/components/` -- quebraria a convencao ja estabelecida.

### 3. Icones via `lucide-react`

**Decisao**: Usar icones da biblioteca `lucide-react` no Header e nas paginas. Proibido o uso de emojis.

**Motivo**: Restrição do projeto. `lucide-react` ja esta instalado como dependencia.

### 4. Cores neutras do Tailwind para esqueletos

**Decisao**: Utilizar as classes `viaje-neutral` e tons de `stone`/`gray` do Tailwind para fundos e textos secundarios das paginas esqueleto, com `viaje-primary` e `viaje-secondary` em destaques (titulos, botoes).

**Motivo**: Segue a paleta definida no Design System. As cores neutras (`#817569` / `viaje-neutral`) combinam com os tons quentes da identidade visual.

## Risks / Trade-offs

- **[Componentes shadcn/ui ainda nao instalados]** -- As paginas esqueleto usarao classes Tailwind puras por enquanto. Quando `shadcn/ui` for configurado, os formularios devem ser migrados para seus componentes. Mitigacao: manter o HTML semantico e classes Tailwind para facilitar a migracao.
- **[Header simples sem estado de autenticacao]** -- O Header mostrara todos os links (incluindo Painel) independentemente do estado de login. Mitigacao: sera refatorado quando a autenticacao for implementada.
