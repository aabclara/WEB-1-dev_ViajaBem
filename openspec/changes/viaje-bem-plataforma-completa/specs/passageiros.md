# Spec: Passageiros

## Added Requirements

### Requirement: Listagem de Passageiros de uma Reserva
O Líder pode visualizar e preencher os dados dos passageiros vinculados à sua reserva.

#### Scenario: Líder acessa lista de passageiros
- **WHEN** Líder autenticado acessa `GET /reservas/{id}/passageiros`
- **THEN** retorna lista de passageiros da reserva (incluindo o próprio Líder no slot 1)

#### Scenario: Lider não pode acessar reserva de outro líder
- **WHEN** Líder A tenta acessar passageiros da reserva do Líder B
- **THEN** retorna 403

---

### Requirement: Atualização de Dados de Passageiro
O Líder preenche nome e documento dos acompanhantes.

#### Scenario: Atualização dentro do prazo
- **WHEN** Líder envia `PATCH /passageiros/{id}` com nome e documento, e `hoje < data_partida - 7 dias`
- **THEN** retorna 200 com passageiro atualizado

#### Scenario: Atualização bloqueada dentro de 7 dias
- **WHEN** Líder tenta atualizar passageiro com `hoje >= data_partida - 7 dias`
- **THEN** retorna 422 com mensagem "Edição bloqueada: viagem em menos de 7 dias"

---

### Requirement: Página do Acompanhante (Link Público)
Cada reserva gera um link público com informações da viagem e valor individual para o acompanhante.

#### Scenario: Acesso à página do acompanhante
- **WHEN** qualquer visitante acessa `GET /reservas/{id}/link-acompanhante` (ou a rota Next.js `/acompanhante/{id}`)
- **THEN** retorna informações públicas da viagem (título, data_partida) e o `valor_por_pessoa` da reserva

---

### Requirement: Exportação para ANTT/Seguro
Admin exporta lista de passageiros de uma viagem, substituindo documentos nulos por "PENDENTE".

#### Scenario: Exportação com documentos nulos
- **WHEN** Admin acessa `GET /admin/viagens/{id}/exportar-passageiros`
- **THEN** retorna lista de todos os passageiros das reservas CONFIRMADAS; campos `documento` nulos aparecem como `"PENDENTE"` no resultado

#### Scenario: Exportação formato CSV/JSON
- **WHEN** Admin especifica `?formato=csv` ou `?formato=json`
- **THEN** retorna o arquivo no formato solicitado (padrão: JSON)
