# mb-platform

Multi-brand content platform — one Next.js deploy serves multiple brand identities with Contentful CMS, async AI translation, and automated quality checks.

> Architecture diagram and setup guide coming in Phase 7.

## Quick start

```bash
cp .env.example .env   # fill in your values
pnpm install
pnpm verify            # typecheck + lint + tests
```

## Project structure

| Path | Purpose |
|---|---|
| `apps/web` | Next.js 15 frontend (deployed to Vercel) |
| `packages/ui` | Shared React components |
| `packages/tokens` | Design tokens → CSS variables |
| `packages/content` | Contentful client, types, migrations |
| `workers/content-qa` | AWS Lambda translation worker |
| `infra` | AWS CDK infrastructure |

## Build plan

See [BUILD_PLAN.md](./BUILD_PLAN.md) for the phased delivery plan.

## ADRs

Architecture decisions are documented in [`docs/adr/`](./docs/adr/).
