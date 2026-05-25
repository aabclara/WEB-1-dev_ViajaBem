## Context

O frontend do Viaje Bem (Next.js 15 / React 19 / TypeScript) está estruturado de forma procedural em duas camadas informais: `src/` (tipos e helpers) e `app/` (páginas). Toda a lógica reside nas páginas — fetch direto, autenticação via `localStorage`, estado e renderização misturados. O professor exige Clean Architecture em quatro camadas com DDD, injeção de dependência e suite de testes. A apresentação é iminente.

**Estado atual confirmado pela análise de código:**
- `src/types/viagem.ts` — interface TypeScript simples, não é uma Entidade com comportamento
- `src/lib/auth.ts` — acessa `localStorage` e `window` diretamente, inclui a URL base da API (acoplamento infrastructure-auth)
- `src/lib/services/apiClient.ts` — objeto `fetch` wrapper com token injetado; chama `getAuthToken()` do `src/lib/auth` (coupling infrastructure-infraestrutura)
- `app/page.tsx` — 195 linhas, importa `apiClient` diretamente, gerencia estado com `useState`/`useEffect`
- `app/painel/page.tsx` — 538 linhas, lógica de autenticação, autorização, criação de viagem e renderização misturadas
- `app/viagens/[id]/page.tsx` — 290 linhas, faz `fetch` direto com `API_URL` importado de `auth.ts`
- `app/login/page.tsx` — 139 linhas, chama API REST diretamente
- Sem pasta `domain/`, `application/`, `infrastructure/` — as camadas não existem
- Sem testes (`vitest` e `@testing-library` não estão em `package.json`)
- `axios` está em `package.json` mas não é usado (foi substituído pelo `fetch` manual)

## Goals / Non-Goals

**Goals:**
- Criar as quatro camadas Clean Architecture no `src/` do frontend: `domain/`, `application/`, `infrastructure/`, `presentation/`
- Garantir isolamento absoluto do Domínio: sem imports de React, Next.js, fetch ou qualquer dependência externa
- Extrair toda a lógica de estado e API calls das páginas para Custom Hooks em `presentation/hooks/`
- Implementar container de Injeção de Dependência em `infrastructure/di/container.ts`
- Instalar e configurar Vitest + RTL e escrever testes unitários de domínio, casos de uso (com mocks) e componentes
- Zero mudança visual na UI — as páginas continuarão idênticas para o usuário final

**Non-Goals:**
- Migrar para Axios (o `fetch` nativo será mantido e encapsulado na camada de infraestrutura)
- Instalar shadcn/ui nesta refatoração (a UI atual em Tailwind será mantida)
- Refatorar o backend Python/FastAPI
- Implementar server-side rendering ou React Server Components nas páginas refatoradas

## Decisions

### Decisão 1: Estrutura de pastas dentro de `src/`

**Escolha:** Quatro diretórios de primeiro nível espelhando as camadas arquiteturais:
```
src/
  domain/
    entities/
    value-objects/
    errors/
    repositories/        ← interfaces puras (contratos)
  application/
    use-cases/
  infrastructure/
    http/                ← apiClient.ts movido aqui
    repositories/        ← implementações concretas
    storage/             ← abstração de localStorage
    di/                  ← container.ts (wiring)
  presentation/
    hooks/               ← custom hooks (controladores)
  components/            ← componentes UI reutilizáveis (permanece)
  types/                 ← pode ser absorvido pelo domain/entities/
```

**Alternativa considerada:** Manter `src/lib/` e adicionar sub-pastas. **Rejeitada** — não demonstra separação de camadas de forma explícita para o avaliador.

**Rationale:** A estrutura de pastas é a primeira coisa que o professor verifica. Pastas nomeadas `domain/`, `application/`, `infrastructure/` são auto-documentáveis e demonstram aderência imediata ao padrão.

---

### Decisão 2: Entidades como classes com método `validate()` e construtor

**Escolha:** As Entidades serão classes TypeScript puras (sem decorators, sem frameworks):
```typescript
// src/domain/entities/Viagem.ts
export class Viagem {
  constructor(
    public readonly id: number,
    public readonly titulo: string,
    public readonly status: StatusViagem,
    public readonly vagasTotais: number,
    public readonly vagasDisponiveis: number,
    // ...
  ) {}

  get estaEsgotada(): boolean { ... }
  get percentualOcupacao(): number { ... }
  get ultimasVagas(): boolean { ... }
}
```

**Alternativa considerada:** Manter como interfaces TypeScript simples. **Rejeitada** — interfaces não têm comportamento; sem comportamento não há Entidade (é apenas um DTO).

---

### Decisão 3: Value Objects imutáveis com validação própria

**Escolha:** VOs como classes com construtor privado e factory method `create()` que retorna `Result<VO, Error>`:
```typescript
// src/domain/value-objects/Email.ts
export class Email {
  private constructor(public readonly value: string) {}
  static create(raw: string): Email {
    if (!raw.includes('@')) throw new EmailInvalidoError(raw);
    return new Email(raw.toLowerCase().trim());
  }
}
```

**Rationale:** O padrão `Result` ou `throw` no factory é standard em DDD. O construtor privado garante imutabilidade e que nenhum VO inválido exista em runtime.

---

### Decisão 4: Interfaces de Repositório no Domínio, implementações na Infraestrutura

**Escolha:** O domínio declara apenas o contrato (interface TypeScript):
```typescript
// src/domain/repositories/IViagemRepository.ts
export interface IViagemRepository {
  listarTodas(): Promise<Viagem[]>;
  buscarPorId(id: number): Promise<Viagem>;
}
```
A implementação concreta (`ViagemHttpRepository`) existe apenas em `src/infrastructure/repositories/`.

**Rationale:** Princípio de Inversão de Dependência (DIP). Os Casos de Uso dependem da interface, não da implementação. Isso permite trocar o transporte HTTP por mock nos testes.

---

### Decisão 5: Custom Hooks como "Controladores" da Presentation

**Escolha:** Cada página terá um hook dedicado (ex: `useViagens`, `usePainelAdmin`, `useDetalheViagem`, `useLogin`, `useCadastro`) que:
1. Instancia (via container DI) ou recebe o Caso de Uso
2. Gerencia o estado React (`useState`, `useEffect`)
3. Expõe apenas dados e handlers para o componente

O componente de página fica com menos de ~60 linhas e sem lógica de negócio.

**Alternativa considerada:** Context API ou Zustand para estado global. **Rejeitada para esta refatoração** — adicionar complexidade desnecessária; os hooks por página são suficientes e mais didáticos para avaliação.

---

### Decisão 6: Container de Injeção de Dependência simples (sem biblioteca)

**Escolha:** Um arquivo `src/infrastructure/di/container.ts` que exporta instâncias já configuradas:
```typescript
// Wiring manual — sem frameworks de DI
const httpClient = new FetchHttpClient(API_URL);
const tokenStorage = new LocalStorageTokenStorage();
const viagemRepository = new ViagemHttpRepository(httpClient, tokenStorage);
export const listarViagensUseCase = new ListarViagensUseCase(viagemRepository);
```

**Alternativa considerada:** tsyringe ou InversifyJS. **Rejeitada** — adiciona decorators e complexidade de configuração desnecessária para o tamanho do projeto e o prazo.

---

### Decisão 7: Stack de testes — Vitest + jsdom + RTL

**Escolha:** Vitest (compatível com Vite e Next.js via `vitest.config.ts`), jsdom como ambiente de browser simulado, React Testing Library para componentes.

**Configuração:**
```typescript
// vitest.config.ts (raiz de frontend/)
import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: { environment: 'jsdom', globals: true, setupFiles: ['./vitest.setup.ts'] }
})
```

**Rationale:** Vitest é mais rápido que Jest, tem API compatível, e é o padrão emergente no ecossistema Next.js/TypeScript.

## Risks / Trade-offs

- **[Risco] Quebra de imports durante a refatoração** → Migração deve ocorrer arquivo por arquivo, mantendo o servidor Next.js rodando; usar aliases `@/src/domain/`, `@/src/application/` já configurados no `tsconfig.json`
- **[Risco] TypeScript strict — cláusula `any` proibida** → O `apiClient.ts` atual usa `any` em 4 lugares; durante a migração para `infrastructure/http/`, todos os tipos devem ser explicitados com generics `<T>`
- **[Trade-off] Wiring manual no container.ts cria acoplamento na infra** → Aceitável — é exatamente o que o padrão DI manual prevê; o domínio permanece puro
- **[Risco] `axios` no `package.json` sem uso** → Manter como está para não arriscar quebra de lock; pode ser removido em sprint posterior
- **[Trade-off] Custom Hooks não são testáveis com RTL diretamente** → Usar `renderHook()` do `@testing-library/react` para testar hooks isolados

## Migration Plan

1. Instalar dependências de teste (`vitest`, `@testing-library/react`, `jsdom`, `@testing-library/jest-dom`, `@testing-library/user-event`) e criar `vitest.config.ts` + `vitest.setup.ts`
2. Criar estrutura de pastas vazia em `src/` (domain, application, infrastructure, presentation)
3. Criar camada Domain: Entidades, VOs, Erros, Interfaces de Repositório — sem tocar nas páginas
4. Criar testes unitários de domínio (validar que compilam e passam antes de avançar)
5. Criar camada Application: Casos de Uso (uma classe por use case)
6. Criar testes de Casos de Uso com mocks dos repositórios
7. Criar camada Infrastructure: `FetchHttpClient`, implementações de repositório, `LocalStorageTokenStorage`, `container.ts`
8. Criar Presentation Hooks (`useViagens`, `usePainelAdmin`, etc.) consumindo o container
9. Refatorar páginas para consumir apenas os hooks (substituição cirúrgica)
10. Criar testes de componente com RTL para as páginas refatoradas
11. Verificar que `next build` passa sem erros de TypeScript

**Rollback:** O git permite revert em qualquer etapa. As páginas originais ficam preservadas até a etapa 9.
