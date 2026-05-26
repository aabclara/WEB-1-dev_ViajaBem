## ADDED Requirements

### Requirement: Custom Hooks como Controladores de Estado
O sistema SHALL possuir em `src/presentation/hooks/` um hook dedicado por página: `useViagens`, `usePainelAdmin`, `useDetalheViagem`, `useLogin`, `useCadastro`, `useReservaDetalhe`. Cada hook SHALL encapsular: estados React, chamadas aos Casos de Uso via container DI, e handlers de formulário/interação.

#### Scenario: Hook useViagens expõe dados e estado de carregamento
- **WHEN** `useViagens()` é chamado em um componente
- **THEN** SHALL retornar `{ viagens: Viagem[], isLoading: boolean, erro: string | null }`

#### Scenario: Hook useLogin executa caso de uso e redireciona
- **WHEN** `useLogin().handleSubmit(email, senha)` é chamado com credenciais válidas
- **THEN** SHALL invocar `loginUseCase.execute()` do container e redirecionar para `/painel` em caso de sucesso

### Requirement: Componentes de Página São Magros
Cada `page.tsx` da camada `app/` SHALL conter apenas JSX de renderização e chamadas ao hook correspondente — sem `useState`, `useEffect`, `fetch`, `apiClient` ou lógica de negócio diretamente no corpo do componente. O limite de linhas SHALL ser inferior a 80 linhas por página.

#### Scenario: Página Home não importa apiClient
- **WHEN** `app/page.tsx` é inspecionado
- **THEN** não SHALL conter imports de `apiClient`, `auth`, `fetch` ou qualquer lógica de estado

#### Scenario: Página de Detalhes delega lógica para hook
- **WHEN** `app/viagens/[id]/page.tsx` é inspecionado
- **THEN** SHALL importar e chamar apenas `useDetalheViagem(id)` para obter dados e handlers
