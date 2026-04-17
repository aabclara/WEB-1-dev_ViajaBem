## 1. Implementação da Camada de Domínio

- [ ] 1.1 Criar o arquivo `backend/app/dominio/entidades.py`.
- [ ] 1.2 Definir as Entidades (`Usuario`, `Viagem`, `ReservaGrupo`, `Passageiro`) usando `@dataclass`.
- [ ] 1.3 Mover Enums de domínio (ex: `TipoUsuario`, `StatusReserva`) para `app/dominio/enums.py`.

## 2. Implementação da Camada de Persistência (Infra)

- [ ] 2.1 Criar o arquivo `backend/app/infra/mapeadores.py`.
- [ ] 2.2 Implementar lógica de mapeamento bidirecional para todas as entidades/modelos.
- [ ] 2.3 Refatorar `backend/app/infra/modelos.py` para remover heranças desnecessárias ou lógicas de domínio.

## 3. Refatoração dos Casos de Uso e Serviços

- [ ] 3.1 Atualizar `backend/app/casos_uso/viagens_service.py` para receber e retornar Entidades.
- [ ] 3.2 Atualizar as rotas da API em `backend/app/api/rotas/` para converter o output das Entidades para Schemas Pydantic.
- [ ] 3.3 Garantir que a injeção de dependência e sessões do banco continuem isoladas na camada de infra/api.

## 4. Verificação e Testes

- [ ] 4.1 Criar testes unitários para validar os Mapeadores (Mappers).
- [ ] 4.2 Executar suite de testes existente para garantir que não houve regressão funcional.
