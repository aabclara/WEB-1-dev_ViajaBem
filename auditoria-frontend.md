# Relatório de Auditoria Frontend

**Critérios Base:** Next.js 16 + React 19 + Vitest + Clean Architecture

## 1. DOMÍNIO
✅ **[O QUE JÁ ESTÁ OK]**: 
- Os arquivos de Entidades (`Reserva.ts`, `Usuario.ts`, `Viagem.ts`), Value-Objects (`Email.ts`, `StatusReserva.ts`, etc), Erros Customizados (`CredenciaisInvalidasError.ts`, etc) e as Interfaces/Contratos dos Repositórios (`IAuthRepository.ts`, etc) estão devidamente mapeados na camada `frontend/src/domain`.
- O domínio possui acoplamento zero. Foram realizadas verificações de imports e não há dependências externas (como Axios, Zod, React) ou de hooks. Toda a lógica depende apenas de elementos do próprio domínio.

❌ **[O QUE FALTA]**: 
- Nenhum item ausente.

⚠️ **[O QUE PRECISA DE AJUSTES]**: 
- Nenhum ajuste necessário.

## 2. APLICAÇÃO
✅ **[O QUE JÁ ESTÁ OK]**:
- Os Casos de Uso (Use Cases) estão centralizados em `frontend/src/application/use-cases` (ex: `LoginUseCase.ts`, `CriarReservaUseCase.ts`).
- Eles recebem as interfaces dos repositórios estritamente via Injeção de Dependência através dos construtores.
- Eles orquestram as regras de negócio de forma isolada, não possuindo conhecimento sobre bibliotecas externas como React ou Axios.

❌ **[O QUE FALTA]**: 
- Nenhum item ausente.

⚠️ **[O QUE PRECISA DE AJUSTES]**: 
- Nenhum ajuste necessário.

## 3. INFRAESTRUTURA
✅ **[O QUE JÁ ESTÁ OK]**:
- Arquivos de implementação do HTTP (`FetchHttpClient.ts`), Repositórios Concretos (`AuthHttpRepository.ts`, etc.) e Storage (`LocalStorageTokenStorage.ts`) estão bem localizados em `frontend/src/infrastructure`.
- O projeto possui um container de Injeção de Dependências (DI) bem definido em `frontend/src/infrastructure/di/container.ts` (arquivo de Wiring), responsável por instanciar as classes da infraestrutura, injetá-las nos Casos de Uso e exportar os Casos de Uso prontos para consumo na Presentation Layer.

❌ **[O QUE FALTA]**: 
- Nenhum item ausente.

⚠️ **[O QUE PRECISA DE AJUSTES]**: 
- Nenhum ajuste necessário.

## 4. APRESENTAÇÃO
✅ **[O QUE JÁ ESTÁ OK]**:
- Os componentes e a UI (`app/page.tsx`, `components/ViagemCard.tsx`) estão focados apenas em renderização.
- O isolamento de estado e lógicas de chamadas aos Use Cases estão extraídos em Custom Hooks (`frontend/src/presentation/hooks`), mantendo a UI "magra" e limpa de lógicas de negócio.
- O projeto já utiliza a biblioteca React na versão exigida (`19.0.0`).

❌ **[O QUE FALTA]**:
- O professor irá cobrar **Next.js 16**, porém o `package.json` aponta o uso de `Next.js 15.1.3`.
- O professor irá cobrar **Tailwind v4**, porém o projeto atualmente utiliza `Tailwind v3.4.17`.
- Falta a implementação do **Shadcn/ui**. Não há pasta de componentes UI (`components/ui`) baseada no Shadcn, e dependências como Radix UI não constam no projeto no momento.

⚠️ **[O QUE PRECISA DE AJUSTES]**:
- É necessário atualizar as dependências do Next.js e do Tailwind.
- É necessário inicializar e configurar o Shadcn/ui para refatorar e construir os componentes primitivos atuais.

## 5. TESTES
✅ **[O QUE JÁ ESTÁ OK]**:
- Suite de testes configurada rodando com Vitest (`vitest.config.ts` existente e pacote configurado).
- Os Testes Unitários de Domínio (`domain/**/__tests__`) não possuem mocks, testando as regras da entidade e value-objects isoladamente.
- Os Testes de Casos de Uso (`application/use-cases/__tests__`) utilizam perfeitamente o padrão de mock (`vi.fn()`) para os repositórios injetados, garantindo a orquestração sem bater em serviços reais.

❌ **[O QUE FALTA]**:
- Faltam os **Testes de Integração de Componentes** usando React Testing Library (RTL). Não foram encontrados arquivos que renderizam a UI virtualmente (`render()` do `@testing-library/react`) nas camadas de Apresentação/Componentes para simular a interação do usuário na interface visual.

⚠️ **[O QUE PRECISA DE AJUSTES]**:
- Apesar de os componentes estarem lógicamente limpos, a suíte de testes ainda deve contemplar uma cobertura de UI (verificando interações de clique, acessibilidade e montagem visual correta).
