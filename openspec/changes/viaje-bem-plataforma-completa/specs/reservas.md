# Spec: Reservas de Grupo

## Added Requirements

### Requirement: Criação de Reserva
Um Líder autenticado pode criar uma reserva para uma viagem ativa. O sistema gera automaticamente os slots de passageiros.

#### Scenario: Líder cria reserva com sucesso
- **WHEN** um LIDER autenticado envia `POST /reservas/` com `id_viagem` e `qtd_vagas`
- **THEN** retorna 201 com `reserva_grupo` em status `SOLICITADO` e substatus `AGUARDANDO_CONTATO`
- **AND** são criados `qtd_vagas` registros de `passageiro` (o primeiro com `eh_lider=true` e dados do líder preenchidos)

#### Scenario: Bloqueio se viagem esgotada
- **WHEN** Líder tenta criar reserva em viagem com `status == ESGOTADO`
- **THEN** retorna 409 com mensagem "Viagem esgotada"

#### Scenario: Usuário não autenticado
- **WHEN** visitante sem token tenta criar reserva
- **THEN** retorna 401 e o frontend redireciona para login

---

### Requirement: Trava de Concorrência de Vagas
Antes de mover uma reserva para `BLOQUEADO`, o sistema verifica disponibilidade real.

#### Scenario: Bloqueio com vagas suficientes
- **WHEN** Admin move reserva para `BLOQUEADO` e há vagas físicas suficientes
- **THEN** retorna 200 com reserva em status `BLOQUEADO`

#### Scenario: Bloqueio sem vagas — sugere cancelamentos
- **WHEN** Admin move reserva para `BLOQUEADO` mas `vagas_ocupadas + qtd_vagas > vagas_totais`
- **THEN** retorna 409 com lista de reservas em `SOLICITADO` com `id` e `qtd_vagas` que poderiam ser canceladas para liberar espaço

---

### Requirement: Fluxo de Substatus (Anti-conflito entre Admins)
Cada reserva tem um substatus que coordena o atendimento entre admins.

#### Scenario: Atualização de substatus
- **WHEN** Admin atualiza `PATCH /admin/reservas/{id}` com novo substatus
- **THEN** retorna 200. O campo `admin_responsavel_id` é atualizado para o admin que realizou a ação.

---

### Requirement: Trava de Seguro (7 dias ante-partida)
Operações sensíveis são bloqueadas quando a data de partida está próxima.

#### Scenario: Cancelamento bloqueado
- **WHEN** tentativa de cancelar reserva com `hoje >= data_partida - 7 dias`
- **THEN** retorna 422 com mensagem "Cancelamento não permitido: viagem em menos de 7 dias"

#### Scenario: Edição de passageiro bloqueada
- **WHEN** tentativa de editar passageiro com `hoje >= data_partida - 7 dias`
- **THEN** retorna 422 com mensagem "Edição bloqueada: viagem em menos de 7 dias"

---

### Requirement: Resumo Financeiro da Reserva
O painel do Líder exibe o detalhamento financeiro da reserva.

#### Scenario: Cálculo do resumo financeiro
- **WHEN** Líder acessa `GET /reservas/{id}/resumo`
- **THEN** retorna `valor_acordado`, `sinal` (50%), `restante` (50%), `valor_por_pessoa` (valor_acordado / qtd_vagas)
