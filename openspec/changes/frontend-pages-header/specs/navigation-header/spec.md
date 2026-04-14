## ADDED Requirements

### Requirement: Componente Header com navegacao global
O sistema SHALL fornecer um componente `Header.tsx` reutilizavel que exibe a marca "Viaje Bem" e links de navegacao para todas as rotas principais: Home (`/`), Login (`/login`), Cadastro (`/cadastro`) e Painel (`/painel`).

#### Scenario: Exibicao do Header em todas as paginas
- **WHEN** qualquer pagina do sistema e renderizada
- **THEN** o Header e exibido no topo da tela com a marca e os links de navegacao

#### Scenario: Navegacao via Header
- **WHEN** o usuario clica em um link do Header
- **THEN** o sistema navega para a rota correspondente sem recarregar a pagina (navegacao client-side via `next/link`)

### Requirement: Integracao do Header no layout raiz
O componente Header MUST ser importado e renderizado no `app/layout.tsx` para que apareca em todas as rotas da aplicacao.

#### Scenario: Header persistente entre rotas
- **WHEN** o usuario navega entre diferentes paginas
- **THEN** o Header permanece visivel e consistente sem re-renderizacao completa

### Requirement: Estilizacao do Header com Design System
O Header MUST utilizar as cores do Design System Viaje Bem: fundo com tom neutro, texto com contraste adequado, e destaques usando `viaje-primary` para a marca. Links MUST usar `viaje-neutral` como cor base com efeito hover usando `viaje-primary`.

#### Scenario: Identidade visual do Header
- **WHEN** o Header e renderizado
- **THEN** o fundo utiliza cores neutras, a marca "Viaje Bem" esta destacada com `viaje-primary`, e os links de navegacao apresentam efeito hover visual
