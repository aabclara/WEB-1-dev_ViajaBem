## 1. Componente Header

- [x] 1.1 Criar `frontend/src/components/Header.tsx` com a marca "Viaje Bem" e links de navegacao (`next/link`) para Home (`/`), Login (`/login`), Cadastro (`/cadastro`) e Painel (`/painel`). Usar icones `lucide-react` e cores `viaje-primary`, `viaje-neutral`.
- [x] 1.2 Integrar o componente `Header` no `frontend/app/layout.tsx`, renderizando-o antes do `{children}` dentro do `<main>`.

## 2. Paginas Esqueleto

- [x] 2.1 Atualizar `frontend/app/page.tsx` (Home) para usar as cores do Design System (`viaje-primary`, `viaje-secondary`, `viaje-neutral`) e a fonte Montserrat, removendo os estilos azuis genericos.
- [x] 2.2 Criar `frontend/app/login/page.tsx` com layout esqueleto: titulo "Login", campos placeholder para email e senha, botao de entrar usando cores do Design System.
- [x] 2.3 Criar `frontend/app/cadastro/page.tsx` com layout esqueleto: titulo "Cadastro", campos placeholder para nome, email e senha, botao de cadastrar usando cores do Design System.
- [x] 2.4 Criar `frontend/app/painel/page.tsx` com layout esqueleto: titulo "Painel do Lider", conteudo placeholder indicando area de gestao com cores neutras.

## 3. Verificacao

- [x] 3.1 Executar `next build` e confirmar que todas as rotas compilam sem erros.
- [x] 3.2 Verificar navegacao entre todas as rotas via Header no navegador.
