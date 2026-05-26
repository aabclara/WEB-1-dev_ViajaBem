## ADDED Requirements

### Requirement: Configuração de Vitest para o Frontend
O sistema SHALL possuir `vitest.config.ts` na raiz de `frontend/` configurado com ambiente `jsdom`, globals habilitados e `setupFiles` apontando para `vitest.setup.ts` que importa `@testing-library/jest-dom`.

#### Scenario: Suite de testes executa sem erros de configuração
- **WHEN** `npm run test` é executado no diretório `frontend/`
- **THEN** o Vitest SHALL inicializar, encontrar os arquivos `*.test.ts` e reportar resultado

### Requirement: Testes Unitários de Entidades e Value Objects
O sistema SHALL possuir testes Vitest puros (sem mocks, sem rede) em `src/domain/**/__tests__/` validando comportamento de Entidades e VOs.

#### Scenario: Teste de Entidade Viagem — cálculo de ocupação
- **WHEN** `new Viagem({ vagasTotais: 40, vagasDisponiveis: 10 })` é instanciado
- **THEN** `viagem.percentualOcupacao` SHALL ser `75` e o teste SHALL passar em menos de 10ms

#### Scenario: Teste de VO Email — rejeita email inválido
- **WHEN** `Email.create("nao-e-email")` é chamado em um teste Vitest
- **THEN** SHALL lançar `EmailInvalidoError` e o teste SHALL passar sem acesso à rede

### Requirement: Testes de Casos de Uso com Mocks de Repositório
O sistema SHALL possuir testes em `src/application/use-cases/__tests__/` que usam mocks Vitest (`vi.fn()`) dos repositórios para validar fluxos de sucesso e falha de cada Caso de Uso — sem bater na rede.

#### Scenario: ListarViagensUseCase retorna lista mockada
- **WHEN** `mockViagemRepository.listarTodas` retorna `[viagemMock]` e `execute()` é chamado
- **THEN** o resultado SHALL conter `[viagemMock]` e `mockViagemRepository.listarTodas` SHALL ter sido chamado exatamente uma vez

#### Scenario: LoginUseCase lança erro com credenciais inválidas
- **WHEN** `mockAuthRepository.login` lança `CredenciaisInvalidasError`
- **THEN** `loginUseCase.execute(credenciais)` SHALL propagar o erro e o teste SHALL capturá-lo com `expect(...).rejects.toThrow`

### Requirement: Testes de Componente com React Testing Library
O sistema SHALL possuir testes em `src/presentation/hooks/__tests__/` ou `app/**/__tests__/` usando `@testing-library/react` para simular interações do usuário (cliques, digitação) e validar renderização.

#### Scenario: Página de login exibe erro com credenciais inválidas
- **WHEN** o usuário digita email/senha e clica em "Entrar" com hook mockado retornando erro
- **THEN** o componente SHALL exibir a mensagem de erro na tela (testado via `screen.getByText`)

#### Scenario: Lista de viagens renderiza cards após carregamento
- **WHEN** `useViagens` mockado retorna `[viagemMock]` com `isLoading: false`
- **THEN** `screen.getByText(viagemMock.titulo)` SHALL estar visível no DOM
