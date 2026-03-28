from datetime import date
from typing import Optional
from pydantic import BaseModel, EmailStr, field_validator
from app.infra.modelos import TipoUsuario


class CriarUsuarioSchema(BaseModel):
    email: EmailStr
    senha: str
    nome: str
    apelido: Optional[str] = None
    cpf: str
    telefone: str
    data_nascimento: date
    tipo: TipoUsuario

    @field_validator("tipo")
    @classmethod
    def validar_tipo(cls, v: TipoUsuario) -> TipoUsuario:
        # Só LIDER pode ser cadastrado via endpoint público
        if v == TipoUsuario.ADMIN:
            raise ValueError("Não é permitido cadastrar usuários ADMIN via este endpoint")
        return v


class LoginSchema(BaseModel):
    email: EmailStr
    senha: str


class TokenSchema(BaseModel):
    access_token: str
    token_type: str = "bearer"


class EsqueciSenhaSchema(BaseModel):
    email: EmailStr


class RedefinirSenhaSchema(BaseModel):
    token: str
    nova_senha: str


class UsuarioPublicoSchema(BaseModel):
    id: int
    email: str
    nome: str
    apelido: Optional[str]
    tipo: TipoUsuario

    model_config = {"from_attributes": True}
