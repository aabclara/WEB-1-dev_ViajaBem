from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload

from app.core.banco import obter_sessao
from app.core.seguranca import requerer_admin
from app.core.configuracao import configuracoes
from app.infra.modelos import Viagem, ReservaGrupo, StatusReserva, StatusViagem, Usuario
from app.schemas.viagem_schemas import ViagemPublicaSchema, CriarViagemSchema, AtualizarViagemSchema

roteador_viagens = APIRouter(prefix="/viagens", tags=["Viagens"])


async def _calcular_vagas(viagem: Viagem, sessao: AsyncSession) -> tuple[int, bool]:
    resultado = await sessao.execute(
        select(func.coalesce(func.sum(ReservaGrupo.qtd_vagas), 0)).where(
            ReservaGrupo.id_viagem == viagem.id,
            ReservaGrupo.status.in_([StatusReserva.BLOQUEADO, StatusReserva.CONFIRMADO]),
        )
    )
    ocupadas = int(resultado.scalar())
    disponiveis = viagem.vagas_totais - ocupadas
    ultimas = disponiveis < configuracoes.LIMIAR_ULTIMAS_VAGAS and disponiveis > 0
    return disponiveis, ultimas


@roteador_viagens.get("/", response_model=list[ViagemPublicaSchema])
async def listar_viagens(sessao: AsyncSession = Depends(obter_sessao)):
    resultado = await sessao.execute(
        select(Viagem).where(Viagem.status == StatusViagem.ATIVO).order_by(Viagem.data_partida)
    )
    viagens = resultado.scalars().all()
    resposta = []
    for v in viagens:
        disponiveis, ultimas = await _calcular_vagas(v, sessao)
        resposta.append(ViagemPublicaSchema(
            id=v.id, titulo=v.titulo, descricao_precos=v.descricao_precos,
            data_partida=v.data_partida, vagas_totais=v.vagas_totais, status=v.status,
            vagas_disponiveis=disponiveis, ultimas_vagas=ultimas,
        ))
    return resposta


@roteador_viagens.get("/{id_viagem}", response_model=ViagemPublicaSchema)
async def detalhe_viagem(id_viagem: int, sessao: AsyncSession = Depends(obter_sessao)):
    resultado = await sessao.execute(select(Viagem).where(Viagem.id == id_viagem))
    viagem = resultado.scalar_one_or_none()
    if not viagem:
        raise HTTPException(status_code=404, detail="Viagem não encontrada")
    disponiveis, ultimas = await _calcular_vagas(viagem, sessao)
    return ViagemPublicaSchema(
        id=viagem.id, titulo=viagem.titulo, descricao_precos=viagem.descricao_precos,
        data_partida=viagem.data_partida, vagas_totais=viagem.vagas_totais, status=viagem.status,
        vagas_disponiveis=disponiveis, ultimas_vagas=ultimas,
    )
