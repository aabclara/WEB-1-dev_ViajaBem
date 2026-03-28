# Proposal: Correção do Suporte Async no Alembic

## Why

O comando `alembic upgrade head` falhou com `ModuleNotFoundError: No module named 'psycopg2'`. Isso ocorre porque a configuração atual do Alembic tenta usar um engine síncrono que depende do driver `psycopg2`, enquanto o projeto "Viaje Bem" utiliza `asyncpg` para conexões assíncronas com o PostgreSQL. Para permitir migrações de banco de dados em um ambiente assíncrono, o arquivo `env.py` do Alembic precisa ser ajustado para criar e utilizar um engine assíncrono da SQLAlchemy.

## What Changes

Esta mudança ajusta a configuração do Alembic para ser compatível com drivers assíncronos:

- **Ajuste no `backend/alembic/env.py`**: 
    - Substituição da lógica de conexão síncrona por uma abordagem assíncrona usando `create_async_engine`.
    - Implementação correta do método `run_migrations_online` para lidar com a natureza assíncrona do driver `asyncpg`.
    - Garantia de que a `DATABASE_URL` seja lida corretamente das configurações do aplicativo (que por sua vez lê do `.env`).
- **Validação**: Execução do comando de migração para confirmar que o erro foi resolvido.

## Impact

- `backend/alembic/env.py`: Modificado para suportar migrações assíncronas.
- Infraestrutura de Banco de Dados: Migrações agora podem ser executadas com sucesso usando o driver `asyncpg`.

## Requirement Changes

- Nenhuma mudança nos requisitos de negócio; trata-se de uma correção técnica de infraestrutura.
