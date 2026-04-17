## ADDED Requirements

### Requirement: Desacoplamento Lógico entre Modelos do DB e Domínio
A arquitetura MUST garantir que a leitura de entidades transacionais ou analíticas a nível de ORM (Modelos SQLAlchemy hoje encontrados em `infra/modelos.py`) funcione sem invadir as preocupações puras de `casos_uso`. Caso seja inviável construir domínio 100% puro devido ao padrão comum no FastAPI, o encapsulamento de acessos se dará via `repositorios`.

#### Scenario: Utilização de objetos em Casos de Uso
- **WHEN** o `Caso de Uso` interagir com objetos de origem relacional.
- **THEN** ele não deve emitir comandos que desrespeitem o escopo da infraestrutura diretamente (se possível mediado por interfaces ou Repositories).
