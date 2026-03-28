from datetime import datetime, timedelta, timezone
from typing import Any
import bcrypt

from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.configuracao import configuracoes
from app.core.banco import obter_sessao
from app.infra.modelos import Usuario

def gerar_hash_senha(senha: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(senha.encode("utf-8"), salt).decode("utf-8")

def verificar_senha(senha: str, senha_hash: str) -> bool:
    return bcrypt.checkpw(senha.encode("utf-8"), senha_hash.encode("utf-8"))

esquema_oauth2 = OAuth2PasswordBearer(tokenUrl="/auth/login")


def criar_token_acesso(dados: dict[str, Any]) -> str:
    copia = dados.copy()
    expiracao = datetime.now(timezone.utc) + timedelta(minutes=configuracoes.JWT_EXPIRACAO_MINUTOS)
    copia.update({"exp": expiracao})
    return jwt.encode(copia, configuracoes.JWT_SECRETO, algorithm=configuracoes.JWT_ALGORITMO)


def decodificar_token(token: str) -> dict[str, Any]:
    try:
        payload = jwt.decode(token, configuracoes.JWT_SECRETO, algorithms=[configuracoes.JWT_ALGORITMO])
        return payload
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido ou expirado")


async def obter_usuario_atual(
    token: str = Depends(esquema_oauth2),
    sessao: AsyncSession = Depends(obter_sessao),
) -> Usuario:
    payload = decodificar_token(token)
    usuario_id: int | None = payload.get("sub")
    if usuario_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido")
    resultado = await sessao.execute(select(Usuario).where(Usuario.id == int(usuario_id)))
    usuario = resultado.scalar_one_or_none()
    if usuario is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuário não encontrado")
    return usuario


async def requerer_lider(usuario: Usuario = Depends(obter_usuario_atual)) -> Usuario:
    if usuario.tipo not in ("LIDER", "ADMIN"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Acesso negado")
    return usuario


async def requerer_admin(usuario: Usuario = Depends(obter_usuario_atual)) -> Usuario:
    if usuario.tipo != "ADMIN":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Acesso negado")
    return usuario
