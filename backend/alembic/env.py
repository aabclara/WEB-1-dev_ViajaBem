import asyncio
from app.core.configuracao import configuracoes
from logging.config import fileConfig
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import pool
from alembic import context

# Configuração do objeto Alembic Config
config = context.config

# Interpretar o arquivo de log do Alembic.ini
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Modelos para suporte ao 'autogenerate'
from app.infra.modelos import Base  # noqa: E402
target_metadata = Base.metadata

def run_migrations_offline() -> None:
    """Executa migrações no modo 'offline'."""
    url = configuracoes.DATABASE_URL
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def do_run_migrations(connection):
    context.configure(connection=connection, target_metadata=target_metadata)

    with context.begin_transaction():
        context.run_migrations()

async def run_migrations_online() -> None:
    """Executa migrações no modo 'online'."""
    connectable = create_async_engine(
        configuracoes.DATABASE_URL,
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()

if context.is_offline_mode():
    run_migrations_offline()
else:
    asyncio.run(run_migrations_online())

