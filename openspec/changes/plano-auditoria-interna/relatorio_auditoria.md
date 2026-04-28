# Relatório de Auditoria Arquitetural - Viaje Bem

Este documento consolida os resultados da auditoria arquitetural realizada nas bases de código do backend (FastAPI) e frontend (Next.js) do projeto Viaje Bem.

## 1. Backend (FastAPI)

### 1.1 Domínio Rico e Isolamento
- **Status:** ❌ NÃO CONFORME
- **Análise:** A pasta `domain/` contém modelos anêmicos (`entidades.py` e `enums.py`). Os modelos são simples `dataclasses` e não possuem métodos ou regras de negócio validadas dentro de si. A lógica de domínio está espalhada em outras camadas.

### 1.2 Classe Abstrata de IA
- **Status:** ❌ NÃO CONFORME
- **Análise:** Não foi encontrada nenhuma classe abstrata no domínio (ou em qualquer outra parte avaliada) definindo as características ou a interface para a IA, conforme requisitado pelas diretrizes do projeto.

### 1.3 Vazamento de Lógica em Controladores (Routers)
- **Status:** ❌ NÃO CONFORME
- **Análise:** Há vazamento severo de lógica de domínio e de negócio nos arquivos de rota. Por exemplo, em `api/rotas/reservas.py`, cálculos financeiros (`sinal = valor * 0.5`) e validações de regras de negócio (`if viagem.status == StatusViagem.ESGOTADO`) estão implementadas diretamente nas funções de controle HTTP (os roteadores FastAPI).

### 1.4 Acoplamento de Repositórios
- **Status:** ❌ NÃO CONFORME
- **Análise:** O arquivo de roteamento `api/rotas/reservas.py` acopla-se fortemente à camada de infraestrutura. Há importação direta de modelos do banco de dados (ORM) (`from app.infra.modelos import Viagem, ...`) e objetos do SQLAlchemy (`select`, `selectinload`) dentro dos métodos da API, violando a Regra de Dependência do Clean Architecture, pois a camada mais externa (API) conhece detalhes da camada de infraestrutura (DB/ORM).

---

## 2. Frontend (Next.js)

### 2.1 SPA e Navegador como Cliente Principal
- **Status:** ❌ NÃO CONFORME
- **Análise:** O projeto utiliza Server Components do Next.js (por exemplo, `app/page.tsx` não declara `"use client"` e realiza fetch SSR). Isso indica que a renderização e o fetch inicial estão ocorrendo no servidor do Next.js, e não no navegador de forma estrita como um cliente SPA consumindo APIs.

### 2.2 Requisições do Frontend
- **Status:** ❌ NÃO CONFORME
- **Análise:** Como o framework está sendo usado em modo SSR/Server Components, as requisições (como as listas em `fetchViagens`) estão saindo do próprio servidor do Next.js (via Docker internal network `http://backend:8000`) em vez de originarem no navegador do usuário final.

### 2.3 Paginação Controlada a Partir do Navegador
- **Status:** ❌ NÃO CONFORME
- **Análise:** A visualização de listas, como na tela de `/painel/page.tsx`, executa um `fetch` generalizado para `/admin/viagens/` sem enviar parâmetros de `limit` e `offset` (paginação), e a renderização traz todos os itens da memória, não havendo paginação implementada.

### 2.4 Clean Architecture no Frontend
- **Status:** ❌ NÃO CONFORME
- **Análise:** O código dos componentes (ex: `painel/page.tsx`) mistura estrutura de apresentação UI, gerenciamento de estado reactivo (useState), busca de dados (fetch) e lógica de formatação. Não há divisões claras em use-cases ou serviços no lado cliente.

---

## 3. Conclusão e Próximos Passos (Sugestões de Refatoração)

A auditoria revelou que a base de código atual **desviou-se substancialmente das diretrizes originais** propostas para o projeto (Clean Architecture em ambos os lados e frontend operando como estritamente SPA).

**Para o Backend:**
1. Mover lógicas de precificação, desconto e regras de negócio para métodos encapsulados nas entidades de `domain/`.
2. Criar a interface abstrata de integração com a IA no `domain/`.
3. Isolar todo o código que importa `sqlalchemy` para dentro de `repositories/`.
4. Os `controllers` (`api/rotas/`) devem apenas invocar Use Cases e receber DTOs/Schemas, jamais instanciar ORM models diretamente.

**Para o Frontend:**
1. Alterar a arquitetura dos componentes de listagem e dados principais para Client Components (`"use client"`), forçando que as requisições API ocorram no navegador.
2. Implementar endpoints paginados no backend e consumi-los via frontend para a correta estrutura de tabelas e listas.
3. Isolar a lógica de chamadas externas em uma camada "Service" ou "Gateway" para não poluir os componentes do React.
