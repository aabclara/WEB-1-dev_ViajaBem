## ADDED Requirements

### Requirement: Entidades de Domínio com Comportamento
O sistema SHALL possuir classes TypeScript em `src/domain/entities/` representando os agregados `Viagem`, `Reserva` e `Usuario`, cada uma com estado encapsulado e comportamento puro de negócio (getters calculados, validações internas).

#### Scenario: Entidade Viagem calcula percentual de ocupação
- **WHEN** uma instância de `Viagem` é criada com `vagasTotais` e `vagasDisponiveis`
- **THEN** o getter `percentualOcupacao` SHALL retornar o valor calculado sem depender de nenhuma biblioteca externa

#### Scenario: Entidade Viagem informa últimas vagas
- **WHEN** `vagasDisponiveis` for menor ou igual a 10% de `vagasTotais`
- **THEN** o getter `ultimasVagas` SHALL retornar `true`

### Requirement: Value Objects Imutáveis com Validação Própria
O sistema SHALL possuir Value Objects em `src/domain/value-objects/` — no mínimo `Email`, `StatusViagem` e `StatusReserva` — com construtor privado e factory method `create()` que lança erro de domínio se o valor for inválido.

#### Scenario: Email inválido lança erro de domínio
- **WHEN** `Email.create("invalido")` é chamado sem o caractere `@`
- **THEN** SHALL lançar `EmailInvalidoError` sem depender de Zod, React ou qualquer lib externa

#### Scenario: Email válido retorna instância imutável
- **WHEN** `Email.create("user@example.com")` é chamado
- **THEN** SHALL retornar um `Email` com `value` normalizado em lowercase

### Requirement: Erros de Domínio Customizados
O sistema SHALL possuir classes de erro em `src/domain/errors/` herdando de `Error`, cobrindo pelo menos: `EmailInvalidoError`, `ViagemNaoEncontradaError`, `ReservaNaoAutorizadaError`, `CredenciaisInvalidasError`.

#### Scenario: Erro de domínio é instância de Error
- **WHEN** `new ViagemNaoEncontradaError(42)` é instanciado
- **THEN** `err instanceof Error` SHALL ser `true` e `err.message` SHALL conter o id da viagem

### Requirement: Contratos de Repositório como Interfaces Puras TypeScript
O sistema SHALL possuir interfaces TypeScript em `src/domain/repositories/` — `IViagemRepository`, `IReservaRepository`, `IAuthRepository` — sem nenhuma importação de React, Next.js, Axios, fetch ou qualquer dependência de runtime.

#### Scenario: Interface de repositório não importa dependências externas
- **WHEN** o arquivo `src/domain/repositories/IViagemRepository.ts` é inspecionado
- **THEN** SHALL conter apenas declarações de interface TypeScript puras, sem imports de infraestrutura

### Requirement: Isolamento Absoluto da Camada de Domínio
O domínio SHALL ser 100% isolado: nenhum arquivo em `src/domain/` SHALL importar React, hooks, Next.js, Axios, fetch, Zod ou qualquer dependência de runtime que não seja TypeScript puro.

#### Scenario: Verificação estática de imports proibidos no domínio
- **WHEN** qualquer arquivo de `src/domain/` é analisado
- **THEN** não SHALL conter imports de `react`, `next`, `axios`, `zod` ou `fetch`
