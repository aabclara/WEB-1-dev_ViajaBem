from datetime import datetime, timedelta, timezone, date
from typing import Optional
import uuid

from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.banco import obter_sessao
from app.core.configuracao import configuracoes
from app.core.seguranca import criar_token_acesso, gerar_hash_senha, verificar_senha
from app.infra.modelos import Usuario, TipoUsuario, TokenRedefinicaoSenha
from app.schemas.usuario_schemas import (
    CriarUsuarioSchema, LoginSchema, TokenSchema,
    EsqueciSenhaSchema, RedefinirSenhaSchema, UsuarioPublicoSchema,
)
import aiosmtplib
from email.mime.text import MIMEText

roteador_auth = APIRouter(prefix="/auth", tags=["Autenticação"])


def _calcular_idade(data_nascimento: date) -> int:
    hoje = date.today()
    return hoje.year - data_nascimento.year - (
        (hoje.month, hoje.day) < (data_nascimento.month, data_nascimento.day)
    )


@roteador_auth.post("/cadastro", response_model=UsuarioPublicoSchema, status_code=status.HTTP_201_CREATED)
async def cadastrar_usuario(
    dados: CriarUsuarioSchema,
    sessao: AsyncSession = Depends(obter_sessao),
):
    # Validação de maioridade para LIDER
    if dados.tipo == TipoUsuario.LIDER and _calcular_idade(dados.data_nascimento) < 18:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Líderes devem ter pelo menos 18 anos",
        )

    # Verificar duplicatas
    resultado = await sessao.execute(
        select(Usuario).where((Usuario.email == dados.email) | (Usuario.cpf == dados.cpf))
    )
    existente = resultado.scalar_one_or_none()
    if existente:
        campo = "E-mail" if existente.email == dados.email else "CPF"
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"{campo} já cadastrado")

    novo_usuario = Usuario(
        email=dados.email,
        senha_hash=gerar_hash_senha(dados.senha),
        nome=dados.nome,
        apelido=dados.apelido,
        cpf=dados.cpf,
        telefone=dados.telefone,
        data_nascimento=dados.data_nascimento,
        tipo=dados.tipo,
    )
    sessao.add(novo_usuario)
    await sessao.commit()
    await sessao.refresh(novo_usuario)
    return novo_usuario


@roteador_auth.post("/login", response_model=TokenSchema)
async def login(
    dados: OAuth2PasswordRequestForm = Depends(),
    sessao: AsyncSession = Depends(obter_sessao),
):
    resultado = await sessao.execute(select(Usuario).where(Usuario.email == dados.username))
    usuario = resultado.scalar_one_or_none()
    if not usuario or not verificar_senha(dados.password, usuario.senha_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciais inválidas")

    token = criar_token_acesso({"sub": str(usuario.id), "email": usuario.email, "tipo": usuario.tipo.value})
    return TokenSchema(access_token=token)



async def _enviar_email_redefinicao(email_destino: str, token: str):
    url = f"{configuracoes.NEXT_PUBLIC_API_URL}/redefinir-senha/{token}"
    mensagem = MIMEText(f"Clique no link para redefinir sua senha:\n\n{url}\n\nO link expira em 1 hora.")
    mensagem["Subject"] = "Viaje Bem — Redefinição de Senha"
    mensagem["From"] = configuracoes.EMAIL_REMETENTE
    mensagem["To"] = email_destino
    try:
        await aiosmtplib.send(
            mensagem,
            hostname=configuracoes.SMTP_HOST,
            port=configuracoes.SMTP_PORTA,
            use_tls=configuracoes.SMTP_TLS,
        )
    except Exception:
        pass  # Falha silenciosa para não vazar info


@roteador_auth.post("/esqueci-senha", status_code=status.HTTP_200_OK)
async def esqueci_senha(
    dados: EsqueciSenhaSchema,
    tarefas: BackgroundTasks,
    sessao: AsyncSession = Depends(obter_sessao),
):
    # Sempre retorna 200 para não vazar se o e-mail existe
    resultado = await sessao.execute(select(Usuario).where(Usuario.email == dados.email))
    usuario = resultado.scalar_one_or_none()
    if usuario:
        token_str = uuid.uuid4().hex
        token = TokenRedefinicaoSenha(
            id_usuario=usuario.id,
            token=token_str,
            expira_em=datetime.now(timezone.utc) + timedelta(hours=1),
        )
        sessao.add(token)
        await sessao.commit()
        tarefas.add_task(_enviar_email_redefinicao, usuario.email, token_str)
    return {"mensagem": "Se o e-mail estiver cadastrado, você receberá instruções em breve"}


@roteador_auth.post("/redefinir-senha", status_code=status.HTTP_200_OK)
async def redefinir_senha(
    dados: RedefinirSenhaSchema,
    sessao: AsyncSession = Depends(obter_sessao),
):
    agora = datetime.now(timezone.utc)
    resultado = await sessao.execute(
        select(TokenRedefinicaoSenha).where(
            TokenRedefinicaoSenha.token == dados.token,
            TokenRedefinicaoSenha.usado.is_(False),
            TokenRedefinicaoSenha.expira_em > agora,
        )
    )
    token_obj = resultado.scalar_one_or_none()
    if not token_obj:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Token expirado ou inválido")

    res_usuario = await sessao.execute(select(Usuario).where(Usuario.id == token_obj.id_usuario))
    usuario = res_usuario.scalar_one()
    usuario.senha_hash = gerar_hash_senha(dados.nova_senha)
    token_obj.usado = True
    await sessao.commit()
    return {"mensagem": "Senha redefinida com sucesso"}
