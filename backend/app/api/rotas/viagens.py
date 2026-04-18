from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.banco import obter_sessao
from app.casos_uso.viagens_service import ViagensService
from app.repositorios.viagem_repositorio import ViagemRepositorio
from app.schemas.viagem_schemas import ViagemPublicaSchema
from app.core.excecoes import ViagemNaoEncontradaException

roteador_viagens = APIRouter(prefix="/viagens", tags=["Viagens"])

@roteador_viagens.get("/", response_model=list[ViagemPublicaSchema])
async def listar_viagens(sessao: AsyncSession = Depends(obter_sessao)):
    repo = ViagemRepositorio(sessao)
    # Para listagem, o repositório deve ter um método listar
    # Como não criei ainda, vou usar a lógica do SQLAlchemy aqui mas convertendo para Entidade no repo
    # Refatorando repo primeiro...
    from sqlalchemy import select
    from app.infra.modelos import Viagem as ViagemModel, StatusViagem
    from app.infra.mapeadores import MapeadorViagem

    resultado = await sessao.execute(
        select(ViagemModel).where(ViagemModel.status == StatusViagem.ATIVO).order_by(ViagemModel.data_partida)
    )
    modelos = resultado.scalars().all()
    viagens = [MapeadorViagem.para_dominio(m) for m in modelos]
    
    servico_viagem = ViagensService(repo)
    resposta = []
    for v in viagens:
        disponiveis, ultimas = await servico_viagem.calcular_vagas_disponiveis(v)
        resposta.append(ViagemPublicaSchema(
            id=v.id, titulo=v.titulo, descricao_precos=v.descricao_precos,
            descricao_curta=v.descricao_curta, itens_inclusos=v.itens_inclusos,
            data_partida=v.data_partida, data_retorno=v.data_retorno,
            url_capa=v.url_capa,
            vagas_totais=v.vagas_totais, status=v.status,
            vagas_disponiveis=disponiveis, ultimas_vagas=ultimas,
        ))
    return resposta

@roteador_viagens.get("/{id_viagem}", response_model=ViagemPublicaSchema)
async def detalhe_viagem(id_viagem: int, sessao: AsyncSession = Depends(obter_sessao)):
    repo = ViagemRepositorio(sessao)
    viagem = await repo.buscar_por_id(id_viagem)
    
    if not viagem:
        raise ViagemNaoEncontradaException()
        
    servico_viagem = ViagensService(repo)
    disponiveis, ultimas = await servico_viagem.calcular_vagas_disponiveis(viagem)
    return ViagemPublicaSchema(
        id=viagem.id, titulo=viagem.titulo, descricao_precos=viagem.descricao_precos,
        descricao_curta=viagem.descricao_curta, itens_inclusos=viagem.itens_inclusos,
        data_partida=viagem.data_partida, data_retorno=viagem.data_retorno,
        url_capa=viagem.url_capa,
        vagas_totais=viagem.vagas_totais, status=viagem.status,
        vagas_disponiveis=disponiveis, ultimas_vagas=ultimas,
    )

