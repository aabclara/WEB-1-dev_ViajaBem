# Tasks: Correção do Suporte Async no Alembic

## 1. Ajuste Técnico do Alembic

- [x] 1.1 Modificar `backend/alembic/env.py` para utilizar `create_async_engine` e o padrão assíncrono do SQLAlchemy 2.0.
- [x] 1.2 Garantir que o `context.configure` em `run_migrations_online` use uma conexão assíncrona.

## 2. Validação de Infraestrutura

- [x] 2.1 Executar `docker-compose run --rm backend alembic upgrade head` para confirmar a aplicação das migrações.
- [x] 2.2 Verificar se as tabelas foram criadas corretamente no banco de dados PostgreSQL.
