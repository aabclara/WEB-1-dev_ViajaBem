## 1. Tratamento Global de Exceções

- [x] 1.1 Criar módulo central de exceções de domínio (ex: `core/excecoes.py`) com as classes `ReservaLotadaException`, `PassageiroDuplicadoException`, etc.
- [x] 1.2 Implementar `.add_exception_handler()` no `main.py` do FastAPI para interceptar exceções de domínio e retornar JSON padrão (HTTP 400, 404, etc).
- [x] 1.3 Substituir lances diretos de `HTTPException` na lógica central pelos novos erros customizados.

## 2. Pydantic OpenAPI e Metadados

- [x] 2.1 Enriquecer todos os modelos em `app/schemas/viagem_schemas.py` adicionando `Field(..., description="x", examples=[])`.
- [x] 2.2 Enriquecer todos os modelos em `app/schemas/usuario_schemas.py` com as mesmas anotações OpenAPI.

## 3. Desacoplamento e Use Cases (Casos de Uso)

- [x] 3.1 Revisar os modelos SQLAlchemy do banco de dados em `infra/modelos.py` (ou delegar acesso puro via repositórios) garantindo isolamento da regra de negócio.
- [x] 3.2 Criar `app/casos_uso/viagens_service.py` e extrair o cálculo de limites de vagas hoje atrelado às rotas de `/viagens`.
- [x] 3.3 Criar `app/casos_uso/reservas_service.py` e extrair lógicas de trava de 7 dias e criação de slots das rotas de reservas.
- [x] 3.4 Refatorar APIRouter (`endpoints`) em `viagens.py` e `reservas.py` para instanciar (via `Depends`) os serviços de caso de uso limpos.

## 4. Atualização de Documentação Externa

- [x] 4.1 Atualizar manuais root (se houver, como `README.md` ou nos arquvios sob `docs/`) confirmando a transição permanente de Vite para Next.js (App Router).
- [x] 4.2 Rodar os testes do pytest e garantir que todas as refatorações mantêm os assertions e edge cases operantes perfeitamente.
