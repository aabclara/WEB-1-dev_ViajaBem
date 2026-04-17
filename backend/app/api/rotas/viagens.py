from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload

from app.core.banco import obter_sessao
from app.core.seguranca import requerer_admin
from app.core.configuracao import configuracoes
from app.casos_uso.viagens_service import ViagensService
from app.infra.modelos import Viagem, ReservaGrupo, StatusReserva, StatusViagem, Usuario
from app.schemas.viagem_schemas import ViagemPublicaSchema, CriarViagemSchema, AtualizarViagemSchema
from app.core.excecoes import ViagemNaoEncontradaException

roteador_viagens = APIRouter(prefix="/viagens", tags=["Viagens"])





@roteador_viagens.get("/", response_model=list[ViagemPublicaSchema])
async def listar_viagens(sessao: AsyncSession = Depends(obter_sessao)):
    resultado = await sessao.execute(
        select(Viagem).where(Viagem.status == StatusViagem.ATIVO).order_by(Viagem.data_partida)
    )
    viagens = resultado.scalars().all()
    servico_viagem = ViagensService(sessao)
    resposta = []
    for v in viagens:
        disponiveis, ultimas = await servico_viagem.calcular_vagas_disponiveis(v)
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
        raise ViagemNaoEncontradaException()
    servico_viagem = ViagensService(sessao)
    disponiveis, ultimas = await servico_viagem.calcular_vagas_disponiveis(viagem)
    return ViagemPublicaSchema(
        id=viagem.id, titulo=viagem.titulo, descricao_precos=viagem.descricao_precos,
        data_partida=viagem.data_partida, vagas_totais=viagem.vagas_totais, status=viagem.status,
        vagas_disponiveis=disponiveis, ultimas_vagas=ultimas,
    )
