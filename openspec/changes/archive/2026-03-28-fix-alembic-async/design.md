# Design: Correção do Suporte Async no Alembic

## Context

O projeto utiliza SQLAlchemy 2.0 com o driver assíncrono `asyncpg`. O Alembic, por padrão, é configurado para operações síncronas. Para que as migrações funcionem com um driver assíncrono, é necessário utilizar extensões assíncronas do Alembic e da SQLAlchemy no arquivo `env.py`.

## Goals / Non-Goals

**Goals:**
- Configurar o Alembic para usar `create_async_engine` da SQLAlchemy.
- Implementar o fluxo assíncrono no método `run_migrations_online`.
- Garantir que a `DATABASE_URL` seja extraída adequadamente da configuração do sistema (`app.core.configuracao`).

**Non-Goals:**
- Mudar o driver de banco de dados (permanecer com `asyncpg`).
- Alterar as tabelas ou a lógica de migração em si.

---

## Technical Details

### Estrutura do `env.py` Assíncrono

Para suportar `asyncpg`, o `env.py` deve seguir este padrão:

1. **Importação**: `from sqlalchemy.ext.asyncio import create_async_engine`.
2. **Configuração do Engine**: Utilizar o `engine_from_config` ou `create_async_engine` diretamente com a URL correta.
3. **Método `run_migrations_online`**:
    - Deve ser uma função assíncrona (ou conter uma).
    - Usar `connectable.connect()` de forma assíncrona.
    - Executar `context.run_migrations()` dentro de um bloco de transação assíncrona.

### Leitura da Configuração

O arquivo deve importar `configuracoes` de `app.core.configuracao` para obter a `DATABASE_URL` atualizada, evitando hardcoding ou dependência direta de variáveis de ambiente sem validação.

---

## Decisions

| Decisão | Rationale |
|---|---|
| Async Engine no Alembic | Necessário para compatibilidade com o driver `asyncpg` definido no projeto. |
| Uso de `asyncio.run()` | O Alembic é um processo síncrono que chama o `env.py`; precisamos de um loop de evento para executar as partes assíncronas. |

## Risks / Trade-offs

| Risco | Mitigação |
|---|---|
| Incompatibilidade com versões antigas da SQLAlchemy | O projeto já utiliza SQLAlchemy 2.0.36, que possui suporte nativo excelente para async. |
