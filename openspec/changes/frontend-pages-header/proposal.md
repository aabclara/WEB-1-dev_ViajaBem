## Why

O frontend atual possui apenas a rota Home (`app/page.tsx`) com estilos genéricos (azul) que não seguem o Design System Viaje Bem. Faltam as rotas essenciais de Login, Cadastro e Painel do Líder, além de um componente de navegação global. Sem essas páginas-esqueleto, não é possível avançar na implementação das funcionalidades de autenticação e gestão.

## What Changes

- Atualizar a Home (`app/page.tsx`) para utilizar as cores do Design System Viaje Bem (`viaje-primary`, `viaje-secondary`, `viaje-neutral`), removendo os estilos genéricos azuis.
- Criar a página de Login em `app/login/page.tsx` com layout esqueleto usando cores neutras do Tailwind.
- Criar a página de Cadastro em `app/cadastro/page.tsx` com layout esqueleto usando cores neutras do Tailwind.
- Criar a página do Painel do Líder em `app/painel/page.tsx` com layout esqueleto usando cores neutras do Tailwind.
- Criar o componente `Header.tsx` em `frontend/src/components/Header.tsx` com links de navegação para Home, Login, Cadastro e Painel.
- Integrar o `Header` ao `layout.tsx` para que seja exibido em todas as rotas.

## Capabilities

### New Capabilities
- `frontend-routing`: Estrutura de rotas do App Router com as páginas Home, Login, Cadastro e Painel do Líder.
- `navigation-header`: Componente Header reutilizável com links de navegação global integrado ao layout principal.

### Modified Capabilities
_(nenhuma capacidade existente é modificada a nível de especificação)_

## Impact

- **Código afetado**: `frontend/app/page.tsx` (reescrita), `frontend/app/layout.tsx` (integração do Header), novos arquivos em `frontend/app/login/`, `frontend/app/cadastro/`, `frontend/app/painel/`, e `frontend/src/components/Header.tsx`.
- **Dependências**: Utiliza `lucide-react` para ícones e o Design System já configurado no `tailwind.config.ts` (cores `viaje-*`, fonte Montserrat).
- **APIs**: Nenhuma integração com backend nesta etapa (páginas esqueleto apenas).
