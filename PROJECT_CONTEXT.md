# Líriou — Landing Page Lista VIP (Next.js)

Landing page de pré-venda dos **scrunchies de cetim Líriou**. Objetivo único: captar cadastros para a lista VIP ("Club de Lirious Lovers"), que recebe o link da pré-venda pelo WhatsApp antes da abertura pública. Os cadastros ficam num PostgreSQL e são consultados no **dashboard** interno (`/dashboard`).

Design: [Figma · Líriou - Layout](https://www.figma.com/proto/zWR73kpD6YxHXHffVGZC94/L%C3%ADriou---Layout?node-id=52-1377&page-id=38%3A6) — página **04 Protótipo**. O dashboard não tem frame no Figma: segue os tokens da marca.

## Stack

| Tecnologia               | Versão   | Uso                                            |
| ------------------------ | -------- | ---------------------------------------------- |
| Next.js                  | ^16.2.4  | Framework React (App Router, Turbopack)        |
| React                    | ^19.2.4  | UI                                             |
| TypeScript               | ^5       | Tipagem estática                               |
| Tailwind CSS             | ^4       | Estilização utility-first (tokens em `@theme`) |
| PostgreSQL               | 17       | Banco (local via `docker-compose.yml`)         |
| Drizzle ORM + drizzle-kit| ^0.45 / ^0.31 | Schema, queries tipadas e migrations      |
| postgres (postgres-js)   | ^3.4     | Driver                                         |
| sonner                   | ^2.0.7   | Toasts (erro de envio, "Link copiado")         |
| clsx + tailwind-merge    | —        | `cn()`                                         |
| React Compiler           | 1.0.0    | Otimização de re-renders                       |

Sem biblioteca de animação nem de gráficos: CSS (keyframes em `globals.css`) e HTML puro.

---

## Rodando localmente

```bash
npm install
npm run db:up        # sobe o Postgres no Docker (Docker Desktop precisa estar aberto)
npm run db:migrate   # cria a tabela leads
npm run dev          # http://localhost:3000  ·  painel em /dashboard
```

| Script            | O que faz                                              |
| ----------------- | ------------------------------------------------------ |
| `db:up`           | `docker compose up -d` (usa as variáveis do `.env`)    |
| `db:generate`     | Gera migration em `drizzle/` a partir de `src/db/schema.ts` |
| `db:migrate`      | Aplica as migrations no `DATABASE_URL`                 |
| `db:studio`       | Drizzle Studio (navegar no banco)                      |

---

## Deploy (Vercel + Neon)

- Banco de produção: **Neon** (`neondb`). Na Vercel, `DATABASE_URL` = URL **com `-pooler`**.
- `src/db/index.ts` cria a conexão no primeiro uso (`getDb()`), nunca na importação: o build roda sem `DATABASE_URL`.
- A conexão remove `channel_binding` da URL (o postgres-js o repassaria ao servidor) e desliga prepared statements quando o host é `-pooler` (PgBouncer).
- Migrations rodam da máquina local, pela conexão direta:
  `DATABASE_URL_UNPOOLED='<url sem -pooler>' npm run db:migrate`
- Variáveis obrigatórias na Vercel: `DATABASE_URL`, `ADMIN_PASSWORD`, `SESSION_SECRET`, `NEXT_PUBLIC_SITE_URL`.

---

## Breaking Changes do Next.js 16

- **`middleware.ts` → `proxy.ts`** — função exportada: `proxy` (não default)
- **`searchParams`** em pages é `Promise<...>` — usar `await searchParams`
- **React Compiler** ativo (`reactCompiler: true` em `next.config.ts`)

---

## Estrutura de Diretórios

```
docker-compose.yml                  # Postgres local
drizzle.config.ts                   # drizzle-kit (lê DATABASE_URL do .env)
drizzle/                            # Migrations SQL geradas (versionar)
public/figma/                       # SVGs exportados do Figma
src/
├── app/
│   ├── actions/
│   │   ├── auth.ts                 # loginAction, logoutAction (dashboard)
│   │   └── leads.ts                # joinVipListAction → INSERT em leads
│   ├── dashboard/
│   │   ├── layout.tsx              # Fundo claro + noindex
│   │   ├── page.tsx                # Painel (Server Component, força dinâmico)
│   │   ├── login/page.tsx          # Login por senha
│   │   └── export/route.ts         # GET → CSV dos cadastros (mesmos filtros)
│   ├── privacidade/page.tsx
│   ├── termos/page.tsx
│   ├── globals.css                 # Tokens, tipografia, keyframes, pausa de animações
│   ├── layout.tsx                  # Fontes, metadata, boot script, Toaster
│   └── page.tsx                    # Landing page
├── components/
│   ├── dashboard/
│   │   ├── dashboard-header.tsx    # Logo + "Ver site" + Sair
│   │   ├── stat-tiles.tsx          # Total (número principal), hoje, 7 dias, % que respondeu
│   │   ├── daily-chart.tsx         # Colunas: cadastros por dia (14 dias), tooltip
│   │   ├── pain-breakdown.tsx      # Barras: respostas do "pesadelo ao acordar"
│   │   ├── leads-filters.tsx       # Busca + filtro (form GET) + Exportar CSV
│   │   ├── leads-table.tsx         # Tabela de cadastros
│   │   ├── pagination.tsx          # 50 por página
│   │   ├── login-form.tsx
│   │   └── logout-button.tsx
│   ├── landing/                    # Blocos da landing (hero, vip-form/, benefits, faq…)
│   ├── legal/legal-page.tsx
│   └── ui/                         # Design system (Button, Field, SelectField, Logo…)
├── db/
│   ├── schema.ts                   # Tabela leads
│   └── index.ts                    # getDb(): cliente Drizzle criado no 1º uso (server-only)
├── lib/
│   ├── leads-query.ts              # listLeads, listAllLeads, getLeadStats (server-only)
│   ├── session.ts                  # Cookie de sessão assinado (HMAC) do dashboard
│   ├── lead.ts                     # Tipos, opções do select e validação (cliente + servidor)
│   ├── format.ts                   # Datas (America/Sao_Paulo), telefone, rótulos
│   ├── masks.ts · analytics.ts · motion.ts · site.ts · utils.ts
└── proxy.ts                        # Protege /dashboard/**
```

---

## Rotas

| Tela                  | Rota                 | Acesso   |
| --------------------- | -------------------- | -------- |
| Landing + lista VIP   | `/`                  | Público  |
| Termos de Uso         | `/termos`            | Público  |
| Aviso de Privacidade  | `/privacidade`       | Público  |
| Login do painel       | `/dashboard/login`   | Público (redireciona se já logado) |
| Dashboard             | `/dashboard`         | Sessão   |
| Exportar CSV          | `/dashboard/export`  | Sessão   |

---

## Banco de dados

Tabela `leads` (`src/db/schema.ts`):

| Coluna       | Tipo          | Observação                                  |
| ------------ | ------------- | ------------------------------------------- |
| `id`         | uuid          | `gen_random_uuid()`                         |
| `name`       | text          |                                             |
| `email`      | text          | minúsculo, **único** (`leads_email_key`)    |
| `whatsapp`   | text          | só dígitos, com DDD                         |
| `pain`       | text \| null  | valor de `PAIN_OPTIONS` (opcional)          |
| `consent_at` | timestamptz   | momento do aceite LGPD                      |
| `utm`        | jsonb \| null | só chaves `utm_*`, saneadas                 |
| `created_at` | timestamptz   | `now()`, indexado                           |

Mudou o schema? `npm run db:generate` → revisar o SQL em `drizzle/` → `npm run db:migrate`.

---

## Fluxo do formulário

```
VipForm (Client)
  → validação local (lib/lead.ts): só no blur ou após o 1º envio com erro
  → joinVipListAction(values, utm)          (Server Action)
      → validateLead() de novo no servidor
      → INSERT … ON CONFLICT (email) DO NOTHING   (e-mail repetido = sucesso, mantém o 1º)
  → mínimo 900ms de loading → SuccessCard
```

Eventos (`track()` → `dataLayer`): `lead_form_start`, `lead_form_error`, `generate_lead`, `lead_form_submit_error`, `cta_click {cta}`, `share_whatsapp`, `copy_link`.

---

## Dashboard

```
proxy.ts            → sem sessão válida em /dashboard/** → /dashboard/login
dashboard/page.tsx  (Server, async)
  → await searchParams { q, pain, page }
  → getLeadStats() + listLeads(filtros)   (lib/leads-query.ts, em paralelo)
  → StatTiles · DailyChart · PainBreakdown · LeadsFilters · LeadsTable · Pagination
```

- **Autenticação**: uma senha (`ADMIN_PASSWORD`). Login cria cookie httpOnly `liriou_admin` = `expiração.HMAC` (8h), assinado com `SESSION_SECRET`. Senha errada tem atraso fixo de 800ms.
- `logoutAction()` apaga o cookie **sem** `redirect()`; no cliente: `await logoutAction(); window.location.replace('/dashboard/login')`
- `/dashboard/export` confere a sessão de novo (sai dado pessoal), gera CSV com `;` + BOM (abre direto no Excel) e neutraliza fórmulas (`=`, `+`, `-`, `@`).
- Filtros são `<form method="GET">`: funcionam sem JS e a URL é compartilhável.
- Datas e "hoje" sempre no fuso `America/Sao_Paulo` (no SQL o fuso é literal, não parâmetro: o `GROUP BY` precisa da expressão idêntica à do `SELECT`).
- Gráficos com uma série só (sem legenda), barras ≤ 24px, uma cor (`folha`), grade fina, tooltip por coluna e tabela acessível escondida.

---

## Variáveis de ambiente (`.env`, fora do git; modelo em `.env.example`)

| Variável               | Uso                                                             |
| ---------------------- | --------------------------------------------------------------- |
| `POSTGRES_USER/PASSWORD/DB/PORT` | Criação do banco local pelo docker-compose            |
| `DATABASE_URL`         | Conexão da app (no Neon, a URL `-pooler`; `?sslmode=require` se o provedor exigir) |
| `DATABASE_URL_UNPOOLED`| Opcional: conexão direta, usada só pelo drizzle-kit (migrations) |
| `DATABASE_POOL_MAX`    | Opcional, tamanho do pool (padrão 10; use 1 em serverless/PGlite) |
| `ADMIN_PASSWORD`       | Senha do dashboard                                              |
| `SESSION_SECRET`       | Chave HMAC do cookie (≥ 32 caracteres; trocar derruba as sessões) |
| `NEXT_PUBLIC_SITE_URL` | URL pública (link de compartilhamento e metadados)              |

---

## Design system

- **Cores** (`@theme`): `noite-900` #0b2e1f (fundo), `noite-800`, `noite-950`, `leite` #fbf3ec, `petala` #ffcfdd, `folha` #008037, `rubor` #b03a62, `musgo` #5c6e63, `linho` #eadfd2, `tinta` #10231a
- **Fontes**: Instrument Sans (`font-sans`, texto/UI/números) e Instrument Serif (`font-serif`, títulos; itálico nos destaques)
- **Utilitários de texto**: `eyebrow` e `display-s`. Não usar prefixo `text-` em utilitários próprios: o `twMerge` os confunde com cor e descarta.
- **Curvas**: `ease-cetim`, `ease-mare`, `ease-petala`; durações `--t-base` 320ms, `--t-slow` 900ms, `--t-hero` 1.1s
- **Botões**: `primary` (verde-noite, sobre claro) · `rosa` (sobre escuro) · `verde` (compartilhar)
- **Breakpoint** `lg` = 960px · conteúdo máx. 1280px, gutter 20px / 40px

## Animação e acessibilidade (landing)

- `[data-reveal]` entra ao aparecer; `--i` escalona 90ms e `--d` atrasa. Só esconde com a classe `js` no `<html>`.
- **Pausar animações (WCAG 2.2.2)**: botão na fita + link no rodapé; grava `liriou:motion` no localStorage e aplica `data-motion="paused"` antes da pintura. `prefers-reduced-motion` desliga os loops.
- FAQ com `<details name="faq">` nativo; altura anima com `::details-content` + `interpolate-size`.

---

## Padrões de Código

- **Server Actions** em `src/app/actions/`: `'use server'`, validam de novo no servidor e retornam `{ ok } | { ok: false, errors?, message? }`, sem lançar erro para o cliente
- **`db/`, `leads-query.ts` e `session.ts`** são server-only: nunca importar em `'use client'`
- **Constantes usadas em Server Components não podem vir de módulo `'use client'`**: ficam em `lib/site.ts`
- **Páginas do dashboard**: Server Component busca os dados; Client Component só onde há interação (gráfico com tooltip, login, sair)
- **Assets do Figma** em `public/figma/`, usados como `<img>` nas posições do design
- **`id` de entidades**: sempre `string` (UUID)

## Pendências

- Validar com a cliente: opções do select, respostas do FAQ, íntegra de Termos/Privacidade, data de atualização e e-mail de contato (`lib/site.ts`)
- Selo de prova social no hero (só com ≥ 50 cadastros reais; o total já sai de `getLeadStats()`)
- Favicon (usar o Logo/Símbolo)
- Dashboard tem um único acesso por senha compartilhada; se a equipe crescer, trocar por usuários individuais
