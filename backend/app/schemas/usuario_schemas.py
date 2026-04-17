from datetime import date
from typing import Optional
from pydantic import BaseModel, EmailStr, field_validator, Field
from app.infra.modelos import TipoUsuario


class CriarUsuarioSchema(BaseModel):
    email: EmailStr = Field(..., description="E-mail válido", examples=["usuario@email.com"])
    senha: str = Field(..., description="Senha forte do usuário", examples=["S3nh@F0rt3"])
    nome: str = Field(..., description="Nome completo", examples=["Maria Souza"])
    apelido: Optional[str] = Field(None, description="Apelido opcional", examples=["Mari"])
    cpf: str = Field(..., description="CPF válido de 11 dígitos", examples=["12345678900"])
    telefone: str = Field(..., description="Telefone com DDD", examples=["11999999999"])
    data_nascimento: date = Field(..., description="Data de nascimento", examples=["1995-10-25"])
    tipo: TipoUsuario = Field(..., description="Tipo de acesso no sistema", examples=["LIDER"])

    @field_validator("tipo")
    @classmethod
    def validar_tipo(cls, v: TipoUsuario) -> TipoUsuario:
        # Só LIDER pode ser cadastrado via endpoint público
        if v == TipoUsuario.ADMIN:
            raise ValueError("Não é permitido cadastrar usuários ADMIN via este endpoint")
        return v


class LoginSchema(BaseModel):
    email: EmailStr = Field(..., description="E-mail de acesso", examples=["usuario@email.com"])
    senha: str = Field(..., description="Senha cadastrada")


class TokenSchema(BaseModel):
    access_token: str = Field(..., description="Token JWT codificado")
    token_type: str = Field("bearer", description="Tipo do token HTTP")
    id: int = Field(..., description="ID identificador do usuário")
    nome: str = Field(..., description="Nome do dono do token", examples=["Maria Souza"])
    email: str = Field(..., description="Email verificado", examples=["maria@email.com"])
    tipo: TipoUsuario = Field(..., description="Função ou grupo de segurança")


class EsqueciSenhaSchema(BaseModel):
    email: EmailStr = Field(..., description="E-mail para recuperação", examples=["usuario@email.com"])


class RedefinirSenhaSchema(BaseModel):
    token: str = Field(..., description="O token de reset recebido por e-mail")
    nova_senha: str = Field(..., description="A nova senha forte a ser gravada")


class UsuarioPublicoSchema(BaseModel):
    id: int = Field(..., description="ID identificador do usuário", examples=[1])
    email: str = Field(..., description="Endereço de e-mail", examples=["maria@email.com"])
    nome: str = Field(..., description="Nome completo")
    apelido: Optional[str] = Field(None, description="Apelido opcional")
    tipo: TipoUsuario = Field(..., description="Papel do usuário")

    model_config = {"from_attributes": True}
