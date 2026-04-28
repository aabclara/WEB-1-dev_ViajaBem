## Context

Atualmente, as classes que representam o banco de dados (`Usuario`, `Viagem`, `ReservaGrupo`) são as mesmas que circulam por todo o sistema. Isso significa que as regras de negócio estão "presas" às propriedades do SQLAlchemy. Para seguir o Clean Architecture "a risca", as Entidades (Domain Layer) devem ser o centro do sistema e não devem ter conhecimento de detalhes técnicos como chaves primárias autoincrementais, tipos de dados de banco específicos ou ORMs.

## Goals / Non-Goals

**Goals:**
- Criar a camada `app/dominio/entidades.py` com classes puras.
- Isolar o SQLAlchemy em `app/infra/modelos.py` apenas para persistência.
- Implementar a lógica de conversão (Mappers).
- Garantir que `casos_uso` e `servicos` utilizem apenas as Entidades.

**Non-Goals:**
- Mudar a estrutura da API (Schemas Pydantic continuarão existindo e serão mapeados a partir das Entidades).
- Alterar a lógica do banco de dados (tabelas e colunas permanecem iguais).

## Decisions

1. **Entidades como Dataclasses**: Utilizaremos `dataclasses` nativas do Python para definir as entidades de domínio, garantindo que sejam objetos leves e sem dependências.
2. **Separação de Identidade**: As entidades de domínio usarão UUIDs ou IDs genéricos, enquanto os modelos de infraestrutura manterão os IDs de banco necessários pelo PostgreSQL.
3. **Padrão Repository**: Os repositórios serão responsáveis por receber uma Entidade, convertê-la para o Modelo SQLAlchemy e persistir, ou vice-versa na leitura.
4. **Mapeadores em `app/infra/mapeadores.py`**: Centralizaremos a lógica de tradução entre "Mundo do Domínio" e "Mundo da Persistência".

## Risks / Trade-offs

- **Duplicação de Código**: Teremos classes muito parecidas (ex: `Usuario` Entidade e `Usuario` Modelo). No entanto, este é o custo necessário para a independência de camadas.
- **Esforço de Refatoração**: Precisaremos atualizar todos os `imports` e assinaturas de métodos nos `casos_uso`.
