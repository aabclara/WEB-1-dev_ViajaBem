## MODIFIED Requirements

### Requirement: Estrutura de Pastas do Frontend Segue Clean Architecture
O sistema SHALL reorganizar `src/` do frontend para conter as quatro camadas arquiteturais explicitamente nomeadas: `domain/`, `application/`, `infrastructure/`, `presentation/`. As pastas `src/lib/` e `src/types/` existentes SHALL ser absorvidas pelas novas camadas.

#### Scenario: Pasta src/ contém exatamente as quatro camadas
- **WHEN** o diretório `frontend/src/` é listado
- **THEN** SHALL conter `domain/`, `application/`, `infrastructure/`, `presentation/` e `components/`

#### Scenario: src/types/viagem.ts é substituído pela Entidade de Domínio
- **WHEN** `src/types/viagem.ts` é removido
- **THEN** todos os imports SHALL apontar para `src/domain/entities/Viagem.ts`

#### Scenario: src/lib/ é removido após migração
- **WHEN** as responsabilidades de `src/lib/auth.ts` e `src/lib/services/apiClient.ts` são migradas para infra
- **THEN** a pasta `src/lib/` SHALL não existir mais
