# Spec: Viagens

## Added Requirements

### Requirement: Listagem de Viagens (Vitrine Pública)
A vitrine exibe todas as viagens com status `ATIVO`. Viagens com vagas disponíveis < 5 exibem o selo "Últimas Vagas".

#### Scenario: Listar viagens ativas
- **WHEN** qualquer visitante acessa `GET /viagens/`
- **THEN** retorna lista de viagens com status `ATIVO`, incluindo vagas_disponíveis calculadas

#### Scenario: Selo "Últimas Vagas"
- **WHEN** uma viagem tem `vagas_disponíveis < 5` e `status == ATIVO`
- **THEN** a resposta inclui campo `ultimas_vagas: true`

#### Scenario: Checkout bloqueado para viagem esgotada
- **WHEN** visitante tenta criar reserva em uma viagem com `status == ESGOTADO`
- **THEN** retorna 409 com mensagem "Viagem esgotada"

---

### Requirement: Gerenciamento de Viagens (Admin)
Admins podem criar, editar e alterar o status de viagens.

#### Scenario: Admin cria viagem
- **WHEN** ADMIN envia `POST /admin/viagens/` com título, descrição, data_partida e vagas_totais
- **THEN** retorna 201 com a viagem criada em status `ATIVO`

#### Scenario: Admin edita viagem
- **WHEN** ADMIN envia `PATCH /admin/viagens/{id}` com campos atualizados
- **THEN** retorna 200 com viagem atualizada

#### Scenario: Cálculo de Vagas Disponíveis
- **WHEN** qualquer endpoint retorna uma viagem
- **THEN** `vagas_disponíveis = vagas_totais - SUM(qtd_vagas WHERE reserva status IN ['BLOQUEADO','CONFIRMADO'])`
