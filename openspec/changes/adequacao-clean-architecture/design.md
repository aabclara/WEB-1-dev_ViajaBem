## Context

O projeto Viaje Bem foi desenvolvido sob as premissas de Clean Architecture no backend e um modelo estrito de Single Page Application (SPA) consumindo APIs no frontend. Entretanto, uma auditoria recente detectou fortes desvios: as entidades são anêmicas, não há uma interface para IA (que faz parte das diretrizes core do negócio), há vazamento de lógica de negócio e de persistência para as rotas da API, e o frontend em Next.js está usando forte SSR e lógica embaralhada nos componentes, ignorando os princípios SPA e Clean Architecture.

## Goals / Non-Goals

**Goals:**
- Sanar todos os itens apontados como NÃO CONFORME no relatório da auditoria.
- Criar modelos de domínio ricos, onde as regras intrínsecas (ex: validação de fechamento de vaga, precificação de reservas) fiquem em `domain/`.
- Garantir que a integração do framework web (FastAPI) e os controladores desconheçam totalmente o ORM e as regras de persistência.
- Transformar as páginas do Next.js de Server Components pesados para Client Components com estados locais (paginação e requisições).
- Abstrair o acesso a dados no frontend em módulos / services especializados (ex: `src/lib/services/apiViagens.ts`).

**Non-Goals:**
- Adicionar novas funcionalidades de produto que não existam atualmente.
- Mudar o banco de dados ou trocar completamente a tecnologia do frontend.

## Decisions

1. **Estratégia Backend (Bottom-Up)**:
   - Primeiro, enriquecer os arquivos em `app/dominio/`.
   - Adicionar a classe base de IA abstrata e as lógicas em `entidades.py`.
   - Depois, adaptar a infra/repositórios para garantir que recebam requisições abstratas e não espalhem imports SQL pelas outras rotas.
   - Por fim, limpar os `casos_uso` e `api/rotas`, garantindo a delegação estrita das chamadas.
2. **Estratégia Frontend (Refatoração Arquitetural)**:
   - Extrair a lógica do banco/backend para clients dedicados usando Axios ou fetch.
   - Nas páginas (ex: `app/painel/page.tsx` e `app/page.tsx`), introduzir o `"use client"`.
   - As lógicas de carregamento de dados não poderão usar `async component` nativo do SSR, devendo usar `useEffect` ou SWR/React Query para fazer fetch direto do navegador.
   - A paginação deverá ser controlada por parâmetros de URL e estado e consumida nos endpoints.

## Risks / Trade-offs

- **Testes Quebrados**: Como os contratos internos serão modificados profundamente, os testes (que cobrem boa parte do backend, segundo o histórico) irão quebrar. Ajustá-los fará parte da refatoração.
- **Risco de SEO**: Passar a Home (`app/page.tsx`) de SSR para Client Component puro SPA pode prejudicar o SEO, mas como a diretriz da aplicação é o "navegador como o cliente da aplicação web", seguiremos esse princípio à risca conforme exigido no requisito técnico.
