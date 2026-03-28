# Design: Inicialização do Frontend Viaje Bem

## Context

O frontend da plataforma "Viaje Bem" precisa ser inicializado para que a build do Docker de desenvolvimento funcione. O projeto utiliza Next.js com App Router, TypeScript e Tailwind CSS. Esta change foca na fundação técnica necessária para os próximos passos de desenvolvimento de UI.

## Goals / Non-Goals

**Goals:**
- Criar `package.json` com dependências fundamentais (`next`, `react`, `react-dom`, `tailwindcss`, `axios`, `lucide-react`).
- Configurar TypeScript com um `tsconfig.json` padrão Next.js.
- Configurar Tailwind CSS para estilização utilitária.
- Implementar o Layout Raiz (`layout.tsx`) com suporte a fontes e metadados.
- Implementar uma Página Inicial (`page.tsx`) básica em Português.
- Garantir que a build do Docker (`npm run dev`) seja bem-sucedida.

**Non-Goals:**
- Implementar lógica de autenticação complexa (apenas a estrutura).
- Criar componentes de UI detalhados (apenas a base).
- Integrar com o backend nesta fase (apenas preparar o `axios`).

---

## Technical Details

### Configuração de Dependências

O arquivo `package.json` deve incluir:
- **Scripts**: `dev`, `build`, `start`, `lint`.
- **Dependencies**: 
    - `next`, `react`, `react-dom` (Core)
    - `axios` (API)
    - `lucide-react` (Ícones)
    - `clsx`, `tailwind-merge` (Utilidades CSS para componentes shadcn futuro)
- **DevDependencies**: `typescript`, `tailwindcss`, `postcss`, `autoprefixer`, `@types/*`.

### Estrutura de Pastas (App Router)

```
frontend/
├── app/
│   ├── layout.tsx      # Layout Global (Provedores, Fontes)
│   ├── page.tsx        # Home Page (Vitrine)
│   └── globals.css     # Diretivas Tailwind
├── components/         # Pasta para componentes reutilizáveis (inicialmente vazia)
├── lib/
│   └── api.ts          # Instância do Axios para o backend
├── public/             # Arquivos estáticos
├── tailwind.config.ts
└── tsconfig.json
```

---

## Decisions

| Decisão | Rationale |
|---|---|
| Next.js App Router | Padrão moderno requisitado e melhor suporte a Server Components. |
| Axios para API | Preferência por interceptores e configuração centralizada de BaseURL. |
| Lucide React | Biblioteca de ícones leve e padrão do ecossistema shadcn/ui. |
| Português no Código | Cláusula obrigatória do projeto para manter a Linguagem Ubíqua. |
| Tailwind CSS | Requisito da stack técnica definida no `openspec/config.yaml`. |

## Risks / Trade-offs

| Risco | Mitigação |
|---|---|
| Incompatibilidade de versões entre Next.js e React | Utilizar versões estáveis (`latest`) e `npm ci` no Docker. |
| Configuração incorreta do Tailwind impedindo estilos | Seguir o guia oficial de instalação do Next.js + Tailwind. |
| Porta 3000 em conflito no host | Mapeamento de porta já definido no `docker-compose.yml`. |
