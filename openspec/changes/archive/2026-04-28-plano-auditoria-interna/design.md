## Context

O projeto Viaje Bem está sendo construído com uma stack robusta baseada em FastAPI no backend e Next.js no frontend. Foi definido que a arquitetura deve seguir estritamente o modelo de Clean Architecture no backend, e que o frontend deve operar exclusivamente como uma Single Page Application (SPA), usando o navegador como cliente principal. Com o avanço do desenvolvimento, faz-se necessária uma auditoria formal para garantir que essas decisões arquiteturais não foram violadas e não há "vazamento" de lógica.

## Goals / Non-Goals

**Goals:**
- Validar se o domínio backend é rico e controla o negócio (incluindo lógicas e verificações).
- Identificar a presença de uma classe abstrata definindo características da IA.
- Verificar se não há vazamento de lógica nos casos de uso ou controllers.
- Assegurar que não há acoplamento de repositórios em camadas indevidas no backend.
- Garantir que o frontend em Next.js opere exclusivamente no navegador (SPA).
- Confirmar que as requisições do servidor saem do Next.js diretamente para a FastAPI.
- Validar que paginações são controladas a partir do frontend no navegador.

**Non-Goals:**
- Corrigir automaticamente os eventuais problemas ou violações encontradas (esta mudança propõe apenas a auditoria e geração do relatório).
- Adicionar novas funcionalidades de negócio ao projeto.

## Decisions

A auditoria será conduzida em duas etapas de inspeção:
1. **Inspeção Backend (FastAPI)**: Vamos focar na análise das pastas de `domain`, `use_cases`, e `repositories`. Checaremos imports indevidos e localizaremos a classe de IA abstrata.
2. **Inspeção Frontend (Next.js)**: Verificaremos o uso correto de chamadas à API externa (FastAPI) e a ausência de lógica de negócios pesada nos Server Components ou API Routes do Next.js (já que a aplicação web deve ser um cliente SPA).
Os resultados serão compilados em um relatório para posterior ação.

## Risks / Trade-offs

- **Falsos Positivos**: Alguns padrões podem parecer violações à primeira vista (ex: patterns de abstração). A auditoria precisa ser minuciosa.
- **Escopo**: Se o projeto for grande, a auditoria pode ser extensa. Focaremos nos módulos core já desenvolvidos para garantir a base do sistema.
