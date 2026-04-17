from app.dominio import entidades as dom
from app.infra import modelos as infra

class MapeadorUsuario:
    @staticmethod
    def para_dominio(modelo: infra.Usuario) -> dom.Usuario:
        return dom.Usuario(
            id=modelo.id,
            email=modelo.email,
            senha_hash=modelo.senha_hash,
            nome=modelo.nome,
            cpf=modelo.cpf,
            telefone=modelo.telefone,
            data_nascimento=modelo.data_nascimento,
            tipo=dom.TipoUsuario(modelo.tipo.value),
            apelido=modelo.apelido,
            criado_em=modelo.criado_em
        )

    @staticmethod
    def para_infra(entidade: dom.Usuario) -> infra.Usuario:
        return infra.Usuario(
            id=entidade.id,
            email=entidade.email,
            senha_hash=entidade.senha_hash,
            nome=entidade.nome,
            cpf=entidade.cpf,
            telefone=entidade.telefone,
            data_nascimento=entidade.data_nascimento,
            tipo=infra.TipoUsuario(entidade.tipo.value),
            apelido=entidade.apelido
        )

class MapeadorViagem:
    @staticmethod
    def para_dominio(modelo: infra.Viagem) -> dom.Viagem:
        return dom.Viagem(
            id=modelo.id,
            titulo=modelo.titulo,
            descricao_curta=modelo.descricao_curta,
            itens_inclusos=modelo.itens_inclusos,
            descricao_precos=modelo.descricao_precos,
            data_partida=modelo.data_partida,
            vagas_totais=modelo.vagas_totais,
            status=dom.StatusViagem(modelo.status.value),
            criado_em=modelo.criado_em
        )

    @staticmethod
    def para_infra(entidade: dom.Viagem) -> infra.Viagem:
        return infra.Viagem(
            id=entidade.id,
            titulo=entidade.titulo,
            descricao_curta=entidade.descricao_curta,
            itens_inclusos=entidade.itens_inclusos,
            descricao_precos=entidade.descricao_precos,
            data_partida=entidade.data_partida,
            vagas_totais=entidade.vagas_totais,
            status=infra.StatusViagem(entidade.status.value)
        )

class MapeadorReserva:
    @staticmethod
    def para_dominio(modelo: infra.ReservaGrupo) -> dom.ReservaGrupo:
        return dom.ReservaGrupo(
            id=modelo.id,
            id_viagem=modelo.id_viagem,
            id_lider=modelo.id_lider,
            qtd_vagas=modelo.qtd_vagas,
            valor_acordado=float(modelo.valor_acordado) if modelo.valor_acordado else None,
            status=dom.StatusReserva(modelo.status.value),
            substatus=dom.SubstatusReserva(modelo.substatus.value),
            data_expiracao=modelo.data_expiracao,
            admin_responsavel_id=modelo.admin_responsavel_id,
            criado_em=modelo.criado_em
        )

    @staticmethod
    def para_infra(entidade: dom.ReservaGrupo) -> infra.ReservaGrupo:
        return infra.ReservaGrupo(
            id=entidade.id,
            id_viagem=entidade.id_viagem,
            id_lider=entidade.id_lider,
            qtd_vagas=entidade.qtd_vagas,
            valor_acordado=entidade.valor_acordado,
            status=infra.StatusReserva(entidade.status.value),
            substatus=infra.SubstatusReserva(entidade.substatus.value),
            data_expiracao=entidade.data_expiracao,
            admin_responsavel_id=entidade.admin_responsavel_id
        )

class MapeadorPassageiro:
    @staticmethod
    def para_dominio(modelo: infra.Passageiro) -> dom.Passageiro:
        return dom.Passageiro(
            id=modelo.id,
            id_reserva=modelo.id_reserva,
            nome=modelo.nome,
            documento=modelo.documento,
            eh_lider=modelo.eh_lider
        )

    @staticmethod
    def para_infra(entidade: dom.Passageiro) -> infra.Passageiro:
        return infra.Passageiro(
            id=entidade.id,
            id_reserva=entidade.id_reserva,
            nome=entidade.nome,
            documento=entidade.documento,
            eh_lider=entidade.eh_lider
        )
