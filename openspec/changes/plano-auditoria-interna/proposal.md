## Why

O objetivo desta mudança é criar um plano formal de auditoria interna para verificar se a implementação atual do projeto Viaje Bem está aderente aos princípios arquiteturais definidos. É necessário garantir que o projeto não possui vazamento de lógica, que o domínio permanece rico controlando as regras de negócio, e que o frontend está respeitando a arquitetura de Single Page Application (SPA) exclusiva pelo navegador, com a divisão correta de responsabilidades entre Next.js e o backend em FastAPI.

## What Changes

Criar um plano de auditoria que verifique especificamente os seguintes pontos no código base atual:
- **Backend (FastAPI)**:
    - O domínio deve ser rico no sentido de controlar o negócio e todas as regras da aplicação (incluindo verificações e lógicas).
    - Verificar a presença e o uso correto de uma classe abstrata definindo as características da IA.
    - Garantir que não há vazamento de lógica, seguindo as regras do Clean Architecture (por exemplo, lógica de negócio em controllers).
    - Garantir que não há acoplamento de repositório nas camadas superiores.
- **Frontend (Next.js)**:
    - Trabalhar exclusivamente com o Next.js, com o navegador atuando como o cliente da aplicação web.
    - As requisições feitas pelo servidor saem do Next.js e vão para o servidor da FastAPI.
    - A paginação e a renderização SPA são feitas diretamente do navegador.
    - O Clean Architecture também deve estar presente e ser respeitado na estrutura da aplicação frontend.

## Capabilities

### New Capabilities
- `auditoria-arquitetura`: Define os critérios e passos da auditoria da arquitetura no frontend e backend.

### Modified Capabilities

## Impact

Esta auditoria impactará a forma como avaliamos e eventualmente refatoramos a base de código do projeto. Dependendo dos resultados, tickets de correção arquitetural podem ser levantados.
