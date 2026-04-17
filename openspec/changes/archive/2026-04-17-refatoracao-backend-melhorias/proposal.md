## Why

O projeto ViajaBem já alcançou um ótimo nível de maturidade no Backend utilizando as melhores ferramentas (FastAPI, SQLAlchemy, Pydantic). Porém, conforme análise técnica recente, a manutenibilidade e escalabilidade do projeto podem ser potencializadas aderindo melhor aos princípios de Clean Architecture. Adotar essas melhorias agora evita que o débito técnico cresça à medida que a aplicação aumenta.

## What Changes

- Movimentação das regras de negócio que estão nas rotas (como cálculo de travas de seguro) para a camada de `casos_uso`.
- Instalação de Handlers de Exceção globais customizados no aplicativo (ex: substituir os vários `raise HTTPException` dentro das rotas por lançamentos de erros de negócio limpos capturados no `main.py`).
- Desacoplamento arquitetural movendo os modelos da camada de `infra` para representar mais fielmente o `dominio`.
- Enriquecimento dos Schemas Pydantic (`app/schemas/`) com descrições e exemplos para gerar uma documentação OpenAPI (Swagger/ReDoc) de excelência.
- Atualização das documentações legadas do projeto apontando o uso do App Router (Next.js) em detrimento do Vite.

## Capabilities

### New Capabilities
- `use-cases-layer`: Criação de classes/funções especialistas em regras de negócio para retirar o peso da camada de roteamento HTTP.
- `global-exception-handling`: Mapeamento e tratamento de exceções de domínio no nível central do FastAPI.
- `openapi-documentation`: Padronização de esquemas de API para documentação autogerada completa com metadados.
- `domain-model-decoupling`: Reorganização dos modelos do SQLAlchemy e entidades de negócio reforçando a separação entre Domínio e Infraestrutura.

### Modified Capabilities

## Impact

- **Backend (API)**: A maioria das alterações foca no backend de forma transparente. As assinaturas dos endpoints se manterão com contratos idênticos (salvo a nova documentação embutida). O `main.py` será afetado (handlers) assim como as controllers e schemas.
- **Documentação**: Arquivos Markdown `/docs` e `/openspec` deverão ser revisados para consistência de tecnologias listadas.
- **Frontend**: Impacto zero previsto no código fonte da interface.
