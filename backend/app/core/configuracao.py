from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import Optional


class Configuracoes(BaseSettings):
    # Banco de Dados
    DATABASE_URL: str

    # JWT
    JWT_SECRETO: str
    JWT_ALGORITMO: str = "HS256"
    JWT_EXPIRACAO_MINUTOS: int = 60

    # Seed ADMIN
    ADMIN_EMAIL: str
    ADMIN_SENHA: str
    ADMIN_NOME: str = "Administrador"

    # SMTP
    SMTP_HOST: str = "mailhog"
    SMTP_PORTA: int = 1025
    SMTP_TLS: bool = False
    SMTP_USUARIO: Optional[str] = None
    SMTP_SENHA: Optional[str] = None
    EMAIL_REMETENTE: str = "noreply@viajebem.com.br"

    # Negócio
    CHAVE_PIX: str = ""
    DIAS_TRAVA_SEGURO: int = 7
    LIMIAR_ULTIMAS_VAGAS: int = 5
    TIMEZONE: str = "America/Sao_Paulo"

    # Next.js
    NEXT_PUBLIC_API_URL: str = "http://localhost:8000"

    model_config = {"env_file": ".env", "extra": "ignore"}


configuracoes = Configuracoes()
