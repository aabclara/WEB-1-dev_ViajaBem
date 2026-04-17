import enum
from datetime import datetime, date
from sqlalchemy import (
    BigInteger, Integer, String, Text, Date, DateTime, Boolean,
    Enum as SAEnum, ForeignKey, Numeric, func
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


from app.dominio.enums import TipoUsuario, StatusViagem, StatusReserva, SubstatusReserva

class Base(DeclarativeBase):
    pass


class Usuario(Base):
    __tablename__ = "usuario"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    senha_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    nome: Mapped[str] = mapped_column(String(150), nullable=False)
    apelido: Mapped[str | None] = mapped_column(String(80), nullable=True)
    cpf: Mapped[str] = mapped_column(String(14), unique=True, nullable=False)
    telefone: Mapped[str] = mapped_column(String(20), nullable=False)
    data_nascimento: Mapped[date] = mapped_column(Date, nullable=False)
    tipo: Mapped[TipoUsuario] = mapped_column(SAEnum(TipoUsuario, name="tipo_usuario"), nullable=False)
    criado_em: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    reservas: Mapped[list["ReservaGrupo"]] = relationship(
        "ReservaGrupo", foreign_keys="ReservaGrupo.id_lider", back_populates="lider"
    )


class TokenRedefinicaoSenha(Base):
    __tablename__ = "token_redefinicao_senha"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id_usuario: Mapped[int] = mapped_column(ForeignKey("usuario.id", ondelete="CASCADE"), nullable=False)
    token: Mapped[str] = mapped_column(String(64), unique=True, nullable=False, index=True)
    criado_em: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    expira_em: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    usado: Mapped[bool] = mapped_column(Boolean, default=False)

    usuario: Mapped["Usuario"] = relationship("Usuario")


class Viagem(Base):
    __tablename__ = "viagem"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    titulo: Mapped[str] = mapped_column(String(255), nullable=False)
    descricao_curta: Mapped[str | None] = mapped_column(String(255), nullable=True)
    itens_inclusos: Mapped[str | None] = mapped_column(Text, nullable=True)
    descricao_precos: Mapped[str | None] = mapped_column(Text, nullable=True)
    data_partida: Mapped[date] = mapped_column(Date, nullable=False)
    vagas_totais: Mapped[int] = mapped_column(nullable=False)
    status: Mapped[StatusViagem] = mapped_column(
        SAEnum(StatusViagem, name="status_viagem"), nullable=False, default=StatusViagem.ATIVO
    )
    criado_em: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    reservas: Mapped[list["ReservaGrupo"]] = relationship("ReservaGrupo", back_populates="viagem")


class ReservaGrupo(Base):
    __tablename__ = "reserva_grupo"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id_viagem: Mapped[int] = mapped_column(ForeignKey("viagem.id", ondelete="CASCADE"), nullable=False)
    id_lider: Mapped[int] = mapped_column(ForeignKey("usuario.id"), nullable=False)
    qtd_vagas: Mapped[int] = mapped_column(nullable=False)
    valor_acordado: Mapped[float | None] = mapped_column(Numeric(10, 2), nullable=True)
    status: Mapped[StatusReserva] = mapped_column(
        SAEnum(StatusReserva, name="status_reserva"),
        nullable=False,
        default=StatusReserva.SOLICITADO,
    )
    substatus: Mapped[SubstatusReserva] = mapped_column(
        SAEnum(SubstatusReserva, name="substatus_reserva"),
        nullable=False,
        default=SubstatusReserva.AGUARDANDO_CONTATO,
    )
    data_expiracao: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    admin_responsavel_id: Mapped[int | None] = mapped_column(ForeignKey("usuario.id"), nullable=True)
    criado_em: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    viagem: Mapped["Viagem"] = relationship("Viagem", back_populates="reservas")
    lider: Mapped["Usuario"] = relationship("Usuario", foreign_keys=[id_lider], back_populates="reservas")
    admin_responsavel: Mapped["Usuario | None"] = relationship("Usuario", foreign_keys=[admin_responsavel_id])
    passageiros: Mapped[list["Passageiro"]] = relationship("Passageiro", back_populates="reserva")


class Passageiro(Base):
    __tablename__ = "passageiro"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id_reserva: Mapped[int] = mapped_column(ForeignKey("reserva_grupo.id", ondelete="CASCADE"), nullable=False)
    nome: Mapped[str | None] = mapped_column(String(150), nullable=True)
    documento: Mapped[str | None] = mapped_column(String(20), nullable=True)
    eh_lider: Mapped[bool] = mapped_column(Boolean, default=False)

    reserva: Mapped["ReservaGrupo"] = relationship("ReservaGrupo", back_populates="passageiros")
