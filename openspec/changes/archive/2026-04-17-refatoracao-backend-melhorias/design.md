## Context

A arquitetura do backend do **ViajaBem** atual organiza seu código separando infraestrutura, rotas HTTP e schemas (Pydantic). Contudo, a lógica de negócio principal está misturada dentro de `app/api/rotas` (os controllers). Além disso, não há uma tratativa central de exceções (usando chamadas rasas a `HTTPException` repetidamente) e os modelos do ORM estão mesclados sem uma representação de domínio pura. A integração dessas melhorias eleva a resiliência, coesão e a autodocumentação via Swagger usando as melhores práticas da Stack (FastAPI/SQLAlchemy 2.0).

## Goals / Non-Goals

**Goals:**
- **Separação de Preocupações:** Extrair a lógica computacional, validadora e regras de turismo (limiar de vagas na viagem, regras de reservas) dos arquivos em `/rotas/` para classes especializadas em `casos_uso`.
- **Tratamento Global de Erros:** Definir e capturar centralmente exceções personalizadas como `ViagemLotadaException` ou `PassageiroDuplicadoException` no `main.py`.
- **Swagger Inteligente:** Adicionar anotações `Field(...)` completas dentro da raiz dos Schemas para facilitar adoção externa do ecossistema e visualização interativa do payload da API.
- **Isolamento de Infraestrutura:** Afastar o roteamento de conhecer o SQLAlchemy (idealmente usando o padrão Repository ou encapsulando em Use Cases) e isolar o Domínio o máximo possível.

**Non-Goals:**
- **Alterações de Front-end:** As requisições HTTP e cargas não mudarão; a UI (Next.js) em nada sofrerá com essa refatoração.
- **Mudanças no Banco de Dados:** Não haverá implementações do tipo Alembic alterando colunas ou constraints, a camada de banco fica intacta.

## Decisions

1. **Camada de Casos de Uso (Use Cases):** 
   - **Por quê:** O FastAPI incentiva dependências injetadas. Criaremos services (UseCases) injetáveis (via `Depends`) na qual a sessão de banco será repassada, garantindo total cobertura de testes unitários para as regras sem mockar requisições web.
2. **Global Exception Handling:** 
   - **Por quê:** Ficar retornando `HTTPException(400)` obscurece a regra de erro. Criaremos `app.core.excecoes` definindo exceções de domínio, com captura via `@app.exception_handler()` no arquivo `main.py`.
3. **Pydantic Documentation Standards:** 
   - **Por quê:** Enriquecer com `description=""` e `examples=[]` faz o auto-schema documentar automaticamente.
4. **Desacoplamento de Domínio e ORM:**
   - **Por quê:** O feedback pediu para mover as classes de infra para o domínio. Como os modelos SQLAlchemy herdam do DB base (`Base`), a decisão será extrair puras regras estruturais dentro de `dominio` ou abstrair a persistência através da pasta `repositorios` que fará a ponte entre os Modelos e os Casos de Uso, alcançando o "Hexagonal Architecture" purista.

## Risks / Trade-offs

- **[Risk] Quebra de testes integrados ou endpoints:** Mudar muitas peças de lugar simultaneamente pode perder referências internas e derrubar o serviço.
  - **Mitigação:** TDD - refatorar recurso a recurso (primeiro `viagens.py`, depois `reservas.py`) e garantir via pytest contínuo.
- **[Risk] Over-engineering (Complicar demais o código):** O uso rigoroso de injetores complexos de rotas com repositórios e Clean Architecture pode aumentar a verbosidade.
  - **Mitigação:** Vamos manter repositórios magros, injetando sessões diretamente pelo FastAPI `Depends` sempre que coerente.
