import asyncio
from app.core.configuracao import configuracoes
# Ajusta a URL para asyncpg se necessário
if configuracoes.DATABASE_URL.startswith("postgresql://"):
    configuracoes.DATABASE_URL = configuracoes.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)
if "sslmode=" in configuracoes.DATABASE_URL:
    configuracoes.DATABASE_URL = configuracoes.DATABASE_URL.replace("sslmode=", "ssl=")

from app.core.banco import FabricaSessao
from app.infra.modelos import Viagem, ReservaGrupo, StatusViagem, StatusReserva
from app.core.tempo import obter_agora
from sqlalchemy import select, func, update, case

async def test_listar_viagens_admin():
    async with FabricaSessao() as sessao:
        hoje = obter_agora().date()
        print("Running dynamic archiving update...")
        await sessao.execute(
            update(Viagem)
            .where(
                Viagem.data_retorno < hoje,
                Viagem.status.not_in([StatusViagem.FINALIZADO, StatusViagem.CANCELADO]),
            )
            .values(status=StatusViagem.FINALIZADO)
        )
        await sessao.commit()
        print("Update committed.")

        print("Selecting viajes...")
        query = select(Viagem)
        ordem_status = case(
            (Viagem.status.in_([StatusViagem.FINALIZADO, StatusViagem.CANCELADO]), 2),
            else_=1,
        )
        resultado = await sessao.execute(
            query.order_by(ordem_status, Viagem.data_partida).offset(0).limit(50)
        )
        viagens = resultado.scalars().all()
        print(f"Encontradas {len(viagens)} viagens.")

        resposta = []
        for v in viagens:
            contagens = {}
            for s in StatusReserva:
                res = await sessao.execute(
                    select(func.count()).where(
                        ReservaGrupo.id_viagem == v.id, ReservaGrupo.status == s
                    )
                )
                contagens[s.value] = int(res.scalar())
            resposta.append(
                {
                    "id": v.id,
                    "titulo": v.titulo,
                    "data_partida": v.data_partida,
                    "status": v.status,
                    "vagas_totais": v.vagas_totais,
                    "reservas_por_status": contagens,
                }
            )
        print("Success! Resposta:")
        print(resposta)

if __name__ == "__main__":
    asyncio.run(test_listar_viagens_admin())
