from datetime import date, timedelta
from app.core.tempo import obter_agora
import datetime as dt

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.banco import obter_sessao
from app.core.seguranca import obter_usuario_atual
from app.core.configuracao import configuracoes
from app.infra.modelos import Passageiro, ReservaGrupo, Usuario
from app.schemas.viagem_schemas import PassageiroSchema, AtualizarPassageiroSchema
from app.core.excecoes import PassageiroNaoEncontradoException, AcessoNegadoException, EdicaoBloqueadaException
from app.casos_uso.reservas_service import ReservasService

roteador_passageiros = APIRouter(prefix="/passageiros", tags=["Passageiros"])





@roteador_passageiros.patch("/{id_passageiro}", response_model=PassageiroSchema)
async def atualizar_passageiro(
    id_passageiro: int,
    dados: AtualizarPassageiroSchema,
    usuario: Usuario = Depends(obter_usuario_atual),
    sessao: AsyncSession = Depends(obter_sessao),
):
    res = await sessao.execute(select(Passageiro).where(Passageiro.id == id_passageiro))
    passageiro = res.scalar_one_or_none()
    if not passageiro:
        raise PassageiroNaoEncontradoException()

    res_r = await sessao.execute(
        select(ReservaGrupo).where(ReservaGrupo.id == passageiro.id_reserva)
    )
    reserva = res_r.scalar_one()

    if usuario.tipo != "ADMIN" and reserva.id_lider != usuario.id:
        raise AcessoNegadoException()

    # Buscar viagem para trava
    from app.infra.modelos import Viagem
    res_v = await sessao.execute(select(Viagem).where(Viagem.id == reserva.id_viagem))
    viagem = res_v.scalar_one()

    servico_reservas = ReservasService(sessao)
    if servico_reservas.dentro_da_trava_seguro(viagem.data_partida):
        raise EdicaoBloqueadaException("Edição bloqueada: viagem em menos de 7 dias")

    if dados.nome is not None:
        passageiro.nome = dados.nome
    if dados.documento is not None:
        passageiro.documento = dados.documento

    await sessao.commit()
    await sessao.refresh(passageiro)
    return passageiro
