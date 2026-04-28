## Why

O relatório de auditoria `plano-auditoria-interna` evidenciou diversas não-conformidades críticas em relação à arquitetura proposta (Clean Architecture) e ao comportamento do frontend (SPA). Há vazamento de lógica de negócio nos controllers, forte acoplamento com o ORM (SQLAlchemy) fora das camadas de persistência, modelos de domínio anêmicos, falta da integração com IA abstrata, e um frontend que está operando de forma acoplada ao servidor (SSR) sem seguir princípios de Clean Architecture ou gerenciar o estado da aplicação e requisições adequadamente. Esta mudança é necessária para corrigir estruturalmente o projeto, garantindo manutenibilidade, testabilidade e aderência às especificações.

## What Changes

O plano de ação abordará:
- **Refatoração do Backend**:
  - Enriquecer os modelos de `domain/` com as regras de negócio e validações atualmente espalhadas pelos casos de uso e routers.
  - Implementar a interface abstrata de IA em `domain/`.
  - Refatorar os `controllers` (routers da API) para que sejam apenas "orquestradores" burros que repassam chamadas aos Casos de Uso.
  - Migrar todas as dependências diretas de banco de dados (`sqlalchemy`) presentes nos roteadores e casos de uso para a camada de `repositories/`.
- **Refatoração do Frontend**:
  - Transformar componentes principais (como listas e visualizações dinâmicas) em Client Components (`"use client"`).
  - Centralizar requisições de API no frontend por meio de uma camada de serviço (Services/Gateways), impedindo que a lógica de "fetch" polua os componentes React.
  - Implementar suporte à paginação nas listagens de dados (ex: viagens), gerenciando estado (limit/offset) a partir do navegador.
- **Ajustes de Integração**:
  - Adaptar o backend para fornecer paginação e endpoints que correspondam à nova estrutura isolada de chamadas do frontend.

## Capabilities

### New Capabilities
- `refatoracao-backend`: Refatoração da arquitetura do backend em conformidade com Clean Architecture.
- `refatoracao-frontend`: Migração do frontend para SPA client-side com isolamento de services.

### Modified Capabilities
- N/A

## Impact

Essa refatoração estrutural é profunda e afetará as principais rotas da aplicação (ex: `/reservas`, `/admin/viagens`), bem como as telas de listagem e home do painel do usuário no frontend. Testes e fluxos existentes podem quebrar durante o processo caso não sejam adequados em conjunto.
