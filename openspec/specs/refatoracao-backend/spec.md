# refatoracao-backend Specification

## Purpose
TBD - created by archiving change adequacao-clean-architecture. Update Purpose after archive.
## Requirements
### Requirement: Domínio Rico e Isolamento
As entidades de domínio MUST encapsular suas lógicas e regras essenciais de negócio.

#### Scenario: Entidade de Viagem Validando Fechamento de Vaga
- **WHEN** Um caso de uso invoca um método de domínio para registrar a ocupação de uma vaga em `Viagem`.
- **THEN** A entidade deve, em si própria, verificar limites e jogar erro caso não haja disponibilidade.

### Requirement: Classe Abstrata para IA
A arquitetura base MUST fornecer uma interface ou classe base para as características da IA, em `domain/`.

#### Scenario: Definição da Interface de IA
- **WHEN** Analisando o core do sistema.
- **THEN** Uma classe abstrata `CaracteristicaIABase` (ou similar) deve existir no pacote de domínio e ser independente de frameworks.

### Requirement: Rotas e Casos de Uso Desacoplados (Clean Architecture)
A lógica MUST NOT vazar em routers.

#### Scenario: Requisição Financeira e de Reserva
- **WHEN** Um cliente chama uma rota da API.
- **THEN** O controlador HTTP não deve ter blocos `if` de validação de negócio nem instanciar recursos diretos do ORM, operando apenas como interceptor que direciona para `Casos de Uso`.

