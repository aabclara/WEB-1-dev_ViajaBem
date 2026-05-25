## Why

O frontend do Viaje Bem está funcional, mas estruturado de forma monolítica — toda a lógica de negócio, acesso a dados, estado e renderização convivem nos mesmos arquivos de página. Isso viola os princípios de Clean Architecture e DDD exigidos pelo professor para a apresentação final, expondo o projeto a penalização por "vazamento de camadas" e acoplamento proibido. A refatoração precisa ocorrer agora, antes da apresentação, para garantir nota máxima na avaliação arquitetural.

## What Changes

- **[NEW]** Criação da camada `domain/` com Entidades (`Viagem`, `Reserva`, `Usuario`), Value Objects (`Email`, `StatusViagem`, `StatusReserva`), erros customizados (`ViagemNaoEncontradaError`, `ReservaNaoAutorizadaError`, `CredenciaisInvalidasError`) e interfaces de repositório puras (`IViagemRepository`, `IReservaRepository`, `IAuthRepository`)
- **[NEW]** Criação da camada `application/` com Casos de Uso encapsulados em classes com método `execute()`: `ListarViagensUseCase`, `BuscarViagemUseCase`, `CriarReservaUseCase`, `LoginUseCase`, `CriarViagemUseCase`, `ListarReservasUseCase`
- **[NEW]** Criação da camada `infrastructure/` com implementações concretas dos repositórios (`ViagemHttpRepository`, `ReservaHttpRepository`, `AuthHttpRepository`) que encapsulam o `apiClient`, abstração limpa do `localStorage` em `LocalStorageTokenStorage`, e um container de Injeção de Dependência (`container.ts`) centralizando o wiring
- **[MODIFY]** Refatoração das páginas da camada de `presentation/` (app/) para se tornarem componentes "magros" que apenas renderizam e delegam toda a lógica para Custom Hooks (`useViagens`, `usePainelAdmin`, `useReserva`, `useLogin`, `useCadastro`)
- **[NEW]** Criação de testes unitários com Vitest para Entidades e VOs do domínio (sem mocks, sem rede)
- **[NEW]** Criação de testes de Casos de Uso com mocks dos repositórios (sem bater na rede)
- **[NEW]** Instalação e configuração de `vitest` + `@testing-library/react` para testes de componente

## Capabilities

### New Capabilities

- `domain-layer`: Entidades, Value Objects, erros de domínio e contratos de repositório totalmente isolados — sem qualquer importação de React, Next.js, Axios ou fetch
- `application-layer`: Casos de Uso injetáveis com método `execute()` dependendo apenas do Domínio e recebendo repositórios via construtor
- `infrastructure-layer`: Implementações HTTP concretas dos repositórios, abstração de `localStorage`, container de DI centralizando o wiring
- `presentation-hooks`: Custom Hooks (controladores) que encapsulam todo o estado, chamadas aos Use Cases e lógica de formulário, deixando os componentes de página apenas para renderização
- `automated-tests`: Suite de testes com Vitest (unitários de domínio + use cases com mock + RTL para componentes)

### Modified Capabilities

- `refatoracao-frontend`: A estrutura de pastas do frontend muda radicalmente — as páginas em `app/` perdem toda lógica interna e passam a consumir hooks; o `src/` ganha as quatro camadas arquiteturais
- `navigation-header`: O componente `Header.tsx` deve ser refatorado para consumir o hook `useAuthUser` em vez de chamar `getAuthUser()` diretamente na renderização

## Impact

- **Arquivos impactados**: todos os `page.tsx` de `app/` (login, cadastro, painel, viagens/[id], reservas/[id], perfil), `src/lib/auth.ts`, `src/lib/services/apiClient.ts`, `src/types/viagem.ts`, `src/components/Header.tsx`
- **Novas dependências de dev**: `vitest`, `@vitejs/plugin-react`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`
- **Estrutura de pastas nova** em `src/`: `domain/entities/`, `domain/value-objects/`, `domain/errors/`, `domain/repositories/`, `application/use-cases/`, `infrastructure/repositories/`, `infrastructure/storage/`, `infrastructure/di/`, `presentation/hooks/`
- **Sem breaking changes** na interface visual — o usuário final não percebe nenhuma mudança na UI
- **Sem mudanças no backend** — o contrato de API REST permanece idêntico
