## ADDED Requirements

### Requirement: Rotas do App Router
O sistema SHALL fornecer as seguintes rotas via Next.js App Router:
- `/` (Home)
- `/login` (Login)
- `/cadastro` (Cadastro)
- `/painel` (Painel do Lider)

Cada rota MUST renderizar um componente de pagina com conteudo esqueleto e usar as cores do Design System Viaje Bem.

#### Scenario: Navegacao para a Home
- **WHEN** o usuario acessa a rota `/`
- **THEN** o sistema exibe a pagina Home com o titulo "Viaje Bem", descricao do sistema e botoes de acao usando as cores `viaje-primary` e `viaje-secondary`

#### Scenario: Navegacao para Login
- **WHEN** o usuario acessa a rota `/login`
- **THEN** o sistema exibe a pagina de Login com titulo, campos placeholder para email e senha, e botao de entrar

#### Scenario: Navegacao para Cadastro
- **WHEN** o usuario acessa a rota `/cadastro`
- **THEN** o sistema exibe a pagina de Cadastro com titulo, campos placeholder para nome, email e senha, e botao de cadastrar

#### Scenario: Navegacao para Painel do Lider
- **WHEN** o usuario acessa a rota `/painel`
- **THEN** o sistema exibe a pagina do Painel do Lider com titulo e conteudo esqueleto indicando area de gestao

### Requirement: Design System nas paginas
Todas as paginas MUST utilizar a fonte Montserrat (configurada via `--font-montserrat`) e as cores do Design System definidas no `tailwind.config.ts`: `viaje-primary` (#FFA914), `viaje-secondary` (#97703A), `viaje-tertiary` (#00CBFF), e `viaje-neutral` (#817569).

#### Scenario: Consistencia visual
- **WHEN** qualquer pagina e renderizada
- **THEN** a fonte Montserrat e aplicada ao corpo do texto e os elementos de destaque utilizam as cores `viaje-*`

### Requirement: Icones via lucide-react
Os icones exibidos nas paginas e no Header MUST ser provenientes exclusivamente da biblioteca `lucide-react`. Emojis estao proibidos.

#### Scenario: Uso de icones
- **WHEN** um icone e necessario na interface
- **THEN** o sistema utiliza um componente da biblioteca `lucide-react`
