## ADDED Requirements

### Requirement: Cliente HTTP Encapsulado na Infraestrutura
O sistema SHALL possuir um cliente HTTP tipado em `src/infrastructure/http/fetchHttpClient.ts` que encapsula o `fetch` nativo com generics `<T>`, gerenciando headers de autorização — sem cláusula `any` em nenhum parâmetro.

#### Scenario: Cliente HTTP injeta token de autorização automaticamente
- **WHEN** `fetchHttpClient.get<Viagem[]>("/viagens/")` é chamado com token presente no storage
- **THEN** SHALL incluir o header `Authorization: Bearer <token>` na requisição

#### Scenario: Cliente HTTP lança erro tipado em resposta não-ok
- **WHEN** a API retorna status HTTP 404
- **THEN** SHALL lançar um erro com mensagem descritiva, sem expor detalhes de fetch ao chamador

### Requirement: Implementações Concretas dos Repositórios
O sistema SHALL possuir em `src/infrastructure/repositories/` as classes `ViagemHttpRepository`, `ReservaHttpRepository` e `AuthHttpRepository` implementando as respectivas interfaces do domínio e realizando chamadas REST reais via o cliente HTTP injetado.

#### Scenario: ViagemHttpRepository implementa IViagemRepository
- **WHEN** `viagemHttpRepository instanceof IViagemRepository` é verificado em tempo de compilação TypeScript
- **THEN** o compilador SHALL validar que todos os métodos da interface estão implementados

#### Scenario: AuthHttpRepository persiste token via storage
- **WHEN** `authHttpRepository.login(credenciais)` é chamado com sucesso
- **THEN** SHALL invocar `tokenStorage.save(token)` do `ITokenStorage` injetado

### Requirement: Abstração de TokenStorage
O sistema SHALL possuir a interface `ITokenStorage` e sua implementação `LocalStorageTokenStorage` em `src/infrastructure/storage/`, encapsulando todo acesso ao `localStorage` do browser.

#### Scenario: LocalStorageTokenStorage salva e recupera token
- **WHEN** `tokenStorage.save("abc123")` é chamado
- **THEN** `tokenStorage.get()` SHALL retornar `"abc123"`

#### Scenario: LocalStorageTokenStorage retorna null em ambiente SSR
- **WHEN** `typeof window === "undefined"` (ambiente Node.js/SSR)
- **THEN** `tokenStorage.get()` SHALL retornar `null` sem lançar erro

### Requirement: Container de Injeção de Dependência Centralizado
O sistema SHALL possuir `src/infrastructure/di/container.ts` como único ponto de wiring da aplicação, instanciando e conectando: `FetchHttpClient` → `*HttpRepository` → `*UseCase`. Os hooks de presentation SHALL consumir apenas as instâncias exportadas pelo container.

#### Scenario: Container exporta instâncias prontas para uso
- **WHEN** `import { listarViagensUseCase } from "@/src/infrastructure/di/container"` é feito em um hook
- **THEN** SHALL retornar uma instância de `ListarViagensUseCase` já conectada ao `ViagemHttpRepository`
