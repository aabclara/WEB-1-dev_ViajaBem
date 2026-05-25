## MODIFIED Requirements

### Requirement: Header Consome Hook de Autenticação
O componente `Header.tsx` SHALL consumir o hook `useAuthUser()` de `src/presentation/hooks/useAuthUser.ts` em vez de chamar `getAuthUser()` diretamente — eliminando o acoplamento direto com `localStorage` na camada de apresentação.

#### Scenario: Header renderiza nome do usuário via hook
- **WHEN** `useAuthUser()` retorna `{ nome: "Maria", tipo: "LIDER" }`
- **THEN** o Header SHALL exibir o nome sem importar `src/lib/auth` ou acessar `localStorage` diretamente

#### Scenario: Header renderiza botões de login quando usuário é null
- **WHEN** `useAuthUser()` retorna `null`
- **THEN** o Header SHALL exibir os links de Login e Cadastro

#### Scenario: Header não importa src/lib/auth diretamente
- **WHEN** `src/components/Header.tsx` é inspecionado
- **THEN** não SHALL conter import de `src/lib/auth` ou `localStorage`
