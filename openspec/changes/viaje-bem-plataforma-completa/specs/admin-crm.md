# Spec: CRM do Administrador

## Added Requirements

### Requirement: Home Admin — Lista de Viagens
O CRM exibe todas as viagens para o admin com busca por texto.

#### Scenario: Listar viagens no CRM
- **WHEN** ADMIN acessa `GET /admin/viagens/`
- **THEN** retorna todas as viagens (inclusive ESGOTADAS) com totais de reservas por status

#### Scenario: Busca por título
- **WHEN** ADMIN acessa `GET /admin/viagens/?busca=fortaleza`
- **THEN** retorna apenas viagens cujo título contém "fortaleza" (case-insensitive)

---

### Requirement: Kanban de Reservas por Viagem
Cada viagem tem um Kanban com colunas por status. O clique na viagem abre seu Kanban.

#### Scenario: Carregar Kanban de uma viagem
- **WHEN** ADMIN acessa `GET /admin/viagens/{id}/reservas`
- **THEN** retorna reservas agrupadas por status: SOLICITADO, BLOQUEADO, CONFIRMADO, CANCELADO; cada card inclui `substatus`

#### Scenario: Mover card entre colunas (atualizar status)
- **WHEN** ADMIN envia `PATCH /admin/reservas/{id}` com `status` e/ou `substatus`
- **THEN** o sistema valida regras de negócio (trava de vagas, trava de 7 dias) e retorna 200 ou código de erro

---

### Requirement: Definição de Valor Acordado
Admin define manualmente o valor negociado com o líder.

#### Scenario: Admin define valor acordado
- **WHEN** ADMIN envia `PATCH /admin/reservas/{id}` com `valor_acordado`
- **THEN** retorna 200 e o resumo financeiro do Líder é recalculado (sinal, restante, por pessoa)

---

### Requirement: Copiar Resumo WhatsApp
Ferramenta de venda que gera texto formatado para copiar e colar no WhatsApp.

#### Scenario: Gerar resumo WhatsApp
- **WHEN** ADMIN acessa `GET /admin/reservas/{id}/resumo-whatsapp`
- **THEN** retorna texto formatado contendo: nome da viagem, data_partida, qtd_vagas, valor_acordado, sinal (50%), restante (50%), valor_por_pessoa e chave PIX (configurada via env var)

#### Scenario: Sem valor acordado definido
- **WHEN** `valor_acordado` ainda não foi definido pelo admin
- **THEN** retorna 422 com mensagem "Defina o valor acordado antes de gerar o resumo"
