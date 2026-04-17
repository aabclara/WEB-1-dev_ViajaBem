## ADDED Requirements

### Requirement: Independência da Camada de Domínio
As entidades de domínio localizadas em `app/dominio/entidades.py` MUST ser classes puras (POPOs) e não podem importar ou derivar de nenhuma classe da camada de infraestrutura (`sqlalchemy`, `pydantic`, etc.).

#### Scenario: Instanciação de Entidade de Domínio
- **WHEN** um Caso de Uso criar ou manipular um objeto `Usuario` ou `Viagem`.
- **THEN** esse objeto deve ser uma instância da classe de Domínio e não um Modelo SQLAlchemy.

### Requirement: Persistência via Repositórios e Mapeadores
A camada de persistência MUST gerenciar a conversão de/para Entidades de forma transparente para as camadas superiores.

#### Scenario: Persistência de Viagem
- **WHEN** o método `salvar` de um Repositório receber uma Entidade.
- **THEN** o Repositório deve convertê-la para o Modelo SQLAlchemy correspondente antes de interagir com a sessão do banco.
