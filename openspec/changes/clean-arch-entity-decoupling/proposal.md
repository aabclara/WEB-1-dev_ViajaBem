## Why

Atualmente, o projeto utiliza os modelos do SQLAlchemy (`infra/modelos.py`) diretamente nos serviços e casos de uso. Isso fere o princípio da Clean Architecture que prega a independência da camada de domínio em relação à infraestrutura (frameworks, banco de dados, etc.). Qualquer mudança no banco de dados hoje reflete diretamente nas regras de negócio, o que torna o sistema rígido e difícil de testar de forma isolada.

## What Changes

- Criação de uma camada de **Entidades de Domínio** puras (POPOs - Plain Old Python Objects) em `backend/app/dominio/entidades.py`.
- Refatoração do `backend/app/infra/modelos.py` para atuar apenas como a camada de persistência.
- Implementação de **Mapeadores** (Mappers) para converter entre Entidades e Modelos do DB.
- Atualização dos Casos de Uso (`casos_uso/`) para operar exclusivamente com as Entidades de Domínio.
- Introdução formal de **Repositórios** para mediar o acesso aos dados, blindando o domínio contra detalhes do SQLAlchemy.

## Capabilities

### New Capabilities
- `clean-arch-entity-decoupling`: Implementação cabal da separação entre modelos de persistência e entidades de domínio.

### Modified Capabilities
- (Nenhuma)

## Impact

- **Domínio**: Nova pasta/arquivos para entidades.
- **Infraestrutura**: `modelos.py` deixa de conter lógica de negócio.
- **Casos de Uso**: Mudança nas assinaturas de métodos e gerenciamento de estado (deixam de receber objetos do SQLAlchemy).
- **Testes**: Facilitação de testes unitários sem necessidade de mockar o banco de dados.
