## 1. Configuração de Testes (Vitest + RTL)

- [x] 1.1 Instalar dependências de teste: `vitest`, `@vitejs/plugin-react`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`
- [x] 1.2 Criar `frontend/vitest.config.ts` com ambiente `jsdom`, globals e setupFiles
- [x] 1.3 Criar `frontend/vitest.setup.ts` importando `@testing-library/jest-dom`
- [x] 1.4 Adicionar script `"test": "vitest"` ao `frontend/package.json`

## 2. Camada de Domínio — Estrutura de Pastas

- [x] 2.1 Criar diretório `frontend/src/domain/entities/`
- [x] 2.2 Criar diretório `frontend/src/domain/value-objects/`
- [x] 2.3 Criar diretório `frontend/src/domain/errors/`
- [x] 2.4 Criar diretório `frontend/src/domain/repositories/`

## 3. Camada de Domínio — Erros Customizados

- [x] 3.1 Criar `src/domain/errors/EmailInvalidoError.ts` herdando de `Error`
- [x] 3.2 Criar `src/domain/errors/ViagemNaoEncontradaError.ts` herdando de `Error`
- [x] 3.3 Criar `src/domain/errors/ReservaNaoAutorizadaError.ts` herdando de `Error`
- [x] 3.4 Criar `src/domain/errors/CredenciaisInvalidasError.ts` herdando de `Error`
- [x] 3.5 Criar `src/domain/errors/index.ts` re-exportando todos os erros

## 4. Camada de Domínio — Value Objects

- [x] 4.1 Criar `src/domain/value-objects/Email.ts` com construtor privado e `Email.create()` que lança `EmailInvalidoError` se inválido
- [x] 4.2 Criar `src/domain/value-objects/StatusViagem.ts` como enum ou VO validando os valores: `ATIVO`, `FINALIZADO`, `ESGOTADO`, `CANCELADO`
- [x] 4.3 Criar `src/domain/value-objects/StatusReserva.ts` validando: `SOLICITADO`, `CONFIRMADO`, `CANCELADO`, `BLOQUEADO`
- [x] 4.4 Criar `src/domain/value-objects/index.ts` re-exportando todos os VOs

## 5. Camada de Domínio — Entidades

- [x] 5.1 Criar `src/domain/entities/Viagem.ts` com estado encapsulado e getters: `percentualOcupacao`, `ultimasVagas`, `estaEsgotada`
- [x] 5.2 Criar `src/domain/entities/Reserva.ts` com campos tipados e getter `estaFinalizada` (baseado em `data_partida_viagem < now`)
- [x] 5.3 Criar `src/domain/entities/Usuario.ts` com campos tipados e getter `ehAdmin`, `ehLider`
- [x] 5.4 Criar `src/domain/entities/index.ts` re-exportando todas as entidades

## 6. Camada de Domínio — Interfaces de Repositório

- [x] 6.1 Criar `src/domain/repositories/IViagemRepository.ts` com métodos: `listarTodas()`, `buscarPorId(id)`, `criar(dados)`, `listarAdmin(skip, limit)`
- [x] 6.2 Criar `src/domain/repositories/IReservaRepository.ts` com métodos: `criar(dados)`, `listarMinhas()`, `buscarPorId(id)`, `atualizar(id, status)`
- [x] 6.3 Criar `src/domain/repositories/IAuthRepository.ts` com métodos: `login(credenciais)`, `cadastrar(dados)`
- [x] 6.4 Criar `src/domain/repositories/ITokenStorage.ts` com métodos: `save(token)`, `get()`, `remove()`

## 7. Testes Unitários — Domínio

- [x] 7.1 Criar `src/domain/entities/__tests__/Viagem.test.ts` testando `percentualOcupacao`, `ultimasVagas` e `estaEsgotada`
- [x] 7.2 Criar `src/domain/value-objects/__tests__/Email.test.ts` testando criação válida e lançamento de erro
- [x] 7.3 Criar `src/domain/errors/__tests__/errors.test.ts` validando `instanceof Error` e mensagens

## 8. Camada de Aplicação — Casos de Uso

- [x] 8.1 Criar `src/application/use-cases/ListarViagensUseCase.ts` com `constructor(private repo: IViagemRepository)` e `execute()`
- [x] 8.2 Criar `src/application/use-cases/BuscarViagemUseCase.ts` com `execute(id: number)`
- [x] 8.3 Criar `src/application/use-cases/CriarReservaUseCase.ts` com `execute({ idViagem, qtdVagas })` lançando `ReservaNaoAutorizadaError` se esgotada
- [x] 8.4 Criar `src/application/use-cases/LoginUseCase.ts` com `execute(credenciais)` e persistência via `ITokenStorage`
- [x] 8.5 Criar `src/application/use-cases/CadastrarUseCase.ts` com `execute(dados)` chamando `IAuthRepository.cadastrar`
- [x] 8.6 Criar `src/application/use-cases/CriarViagemUseCase.ts` com `execute(dados)` para ADMIN
- [x] 8.7 Criar `src/application/use-cases/ListarReservasUseCase.ts` com `execute()` retornando lista de `Reserva`
- [x] 8.8 Criar `src/application/use-cases/index.ts` re-exportando todos os casos de uso

## 9. Testes de Casos de Uso

- [x] 9.1 Criar `src/application/use-cases/__tests__/ListarViagensUseCase.test.ts` com mock do repositório via `vi.fn()`
- [x] 9.2 Criar `src/application/use-cases/__tests__/CriarReservaUseCase.test.ts` testando fluxo de sucesso e falha por viagem esgotada
- [x] 9.3 Criar `src/application/use-cases/__tests__/LoginUseCase.test.ts` testando sucesso e `CredenciaisInvalidasError`

## 10. Camada de Infraestrutura — Cliente HTTP

- [x] 10.1 Criar `src/infrastructure/http/FetchHttpClient.ts` com métodos genéricos `get<T>()`, `post<T>()`, `patch<T>()`, `put<T>()` sem cláusula `any`
- [x] 10.2 Criar `src/infrastructure/storage/LocalStorageTokenStorage.ts` implementando `ITokenStorage` com guard `typeof window !== "undefined"`

## 11. Camada de Infraestrutura — Repositórios Concretos

- [x] 11.1 Criar `src/infrastructure/repositories/ViagemHttpRepository.ts` implementando `IViagemRepository`
- [x] 11.2 Criar `src/infrastructure/repositories/ReservaHttpRepository.ts` implementando `IReservaRepository`
- [x] 11.3 Criar `src/infrastructure/repositories/AuthHttpRepository.ts` implementando `IAuthRepository`

## 12. Camada de Infraestrutura — Container de DI

- [x] 12.1 Criar `src/infrastructure/di/container.ts` instanciando e conectando: `FetchHttpClient` → todos os Repositories → todos os UseCases
- [x] 12.2 Exportar nomeadamente cada use case: `export const listarViagensUseCase`, `export const loginUseCase`, etc.

## 13. Camada de Apresentação — Custom Hooks

- [x] 13.1 Criar `src/presentation/hooks/useViagens.ts` consumindo `listarViagensUseCase` do container
- [x] 13.2 Criar `src/presentation/hooks/useDetalheViagem.ts` consumindo `buscarViagemUseCase` e `criarReservaUseCase`
- [x] 13.3 Criar `src/presentation/hooks/useLogin.ts` consumindo `loginUseCase`
- [x] 13.4 Criar `src/presentation/hooks/useCadastro.ts` consumindo `cadastrarUseCase`
- [x] 13.5 Criar `src/presentation/hooks/usePainelAdmin.ts` consumindo `listarViagensUseCase` e `criarViagemUseCase`
- [x] 13.6 Criar `src/presentation/hooks/useAuthUser.ts` consumindo `LocalStorageTokenStorage` para ler usuário do storage
- [x] 13.7 Criar `src/presentation/hooks/useReservaDetalhe.ts` consumindo `listarReservasUseCase`

## 14. Refatoração das Páginas (app/)

- [x] 14.1 Refatorar `app/page.tsx` para consumir `useViagens()` — remover `useState`, `useEffect`, `apiClient` direto
- [x] 14.2 Refatorar `app/viagens/[id]/page.tsx` para consumir `useDetalheViagem(id)` — remover fetch direto e `API_URL`
- [x] 14.3 Refatorar `app/login/page.tsx` para consumir `useLogin()` — remover fetch direto e `API_URL`
- [x] 14.4 Refatorar `app/cadastro/page.tsx` para consumir `useCadastro()`
- [x] 14.5 Refatorar `app/painel/page.tsx` para consumir `usePainelAdmin()` — remover toda lógica inline
- [x] 14.6 Refatorar `src/components/Header.tsx` para consumir `useAuthUser()` — remover import de `src/lib/auth`

## 15. Limpeza e Verificação Final

- [x] 15.1 Remover `src/lib/auth.ts` após confirmar que nenhum arquivo o importa
- [x] 15.2 Remover `src/lib/services/apiClient.ts` após confirmar que nenhum arquivo o importa
- [x] 15.3 Remover `src/types/viagem.ts` após confirmar que todos os imports apontam para `src/domain/entities/Viagem.ts`
- [x] 15.4 Verificar que `npx tsc --noEmit` passa sem erros na pasta `frontend/`
- [x] 15.5 Executar `npm run test` e validar que todos os testes passam

## 16. Refatoração Adicional

- [x] 16.1 Adicionar `buscarPerfil` e `atualizarPerfil` em `IAuthRepository` e `AuthHttpRepository`
- [x] 16.2 Criar `src/application/use-cases/BuscarPerfilUseCase.ts` e `AtualizarPerfilUseCase.ts` e adicionar no `container.ts`
- [x] 16.3 Criar `src/presentation/hooks/usePerfil.ts` e refatorar `app/perfil/page.tsx` para consumir e remover uso de `apiClient`/`auth`
- [x] 16.4 Adicionar métodos necessários em `IReservaRepository` / `ReservaHttpRepository` e seus use cases (ex: atualizarPassageiro) se preciso.
- [x] 16.5 Refatorar `app/reservas/[id]/page.tsx` usando novo repositório/hook de reservas.
- [x] 16.6 Refatorar páginas do Kanban para não usarem `auth.ts` / `apiClient.ts`.
- [x] 16.7 Remover finalmente `src/lib/auth.ts` e `src/lib/services/apiClient.ts`

