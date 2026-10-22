# mb-platform — Agent conventions

## Commands
- `pnpm verify` — typecheck + lint + unit tests. Must pass before any task is "done".
- `pnpm test` — run tests only
- `pnpm lint` — run ESLint only
- `pnpm typecheck` — run tsc --noEmit only
- `pnpm format` — run Prettier

## Standing rules
1. Never commit secrets. Read them only from env vars. The only file that mentions secret names is `.env.example`.
2. Never run a command that writes to a live account (Contentful migrations, seed scripts, `cdk deploy`) without the person's explicit go-ahead in the current session.
3. Never edit test files or fixtures unless the task explicitly says to do so.
4. Work in small PRs — one phase deliverable per PR. `pnpm verify` must pass before saying done.
5. Every new architectural choice gets a short ADR in `docs/adr/`.

## Monorepo structure
- `apps/web` — Next.js 15 frontend (Vercel)
- `packages/ui` — Shared React components (Storybook stories live here)
- `packages/tokens` — Design tokens compiled to CSS variables
- `packages/content` — Contentful client, TypeScript types, Zod schemas, migration scripts
- `workers/content-qa` — AWS Lambda worker (SQS → Gemini → Contentful)
- `infra` — AWS CDK stack

## ESLint rules (enforced, do not disable)
- No `any` or `@ts-ignore`
- No disabled tests (`it.skip`, `test.skip`, `describe.skip`)
- No hard-coded hex colors — use tokens from `packages/tokens`
