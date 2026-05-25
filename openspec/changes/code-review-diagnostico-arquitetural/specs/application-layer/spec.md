## ADDED Requirements

### Requirement: Casos de Uso como Classes com Método execute()
O sistema SHALL possuir Casos de Uso em `src/application/use-cases/`, sendo cada um uma classe TypeScript com método público `execute()` como único ponto de entrada. Casos de Uso obrigatórios: `ListarViagensUseCase`, `BuscarViagemUseCase`, `CriarReservaUseCase`, `LoginUseCase`, `CriarViagemUseCase`, `ListarReservasUseCase`.

#### Scenario: ListarViagensUseCase executa com sucesso
- **WHEN** `listarViagensUseCase.execute()` é chamado com repositório mockado retornando lista de viagens
- **THEN** SHALL retornar um array de entidades `Viagem` sem lançar exceção

#### Scenario: CriarReservaUseCase falha quando viagem esgotada
- **WHEN** `criarReservaUseCase.execute({ idViagem, qtdVagas })` é chamado e o repositório indica `vagasDisponiveis === 0`
- **THEN** SHALL lançar `ReservaNaoAutorizadaError`

### Requirement: Injeção de Dependência via Construtor
Todo Caso de Uso SHALL receber suas dependências (interfaces de repositório) exclusivamente via construtor — nunca por importação direta de uma implementação concreta.

#### Scenario: Use Case depende da interface, não da implementação
- **WHEN** o construtor de `ListarViagensUseCase` é inspecionado
- **THEN** SHALL aceitar um parâmetro do tipo `IViagemRepository` (interface do domínio), não `ViagemHttpRepository`

### Requirement: Casos de Uso dependem apenas do Domínio
Os Casos de Uso SHALL importar apenas de `src/domain/` (Entidades, VOs, Erros, Interfaces). Nenhum import de React, Next.js, infraestrutura HTTP ou storage é permitido na camada de aplicação.

#### Scenario: Verificação estática de imports da camada de aplicação
- **WHEN** qualquer arquivo de `src/application/` é analisado
- **THEN** não SHALL conter imports de `src/infrastructure/`, `react`, `next`, `axios` ou `fetch`
