# Build Plan — Multi-Brand Platform

Phased plan for building the platform described in the system design doc. Each phase ends with something deployed and verifiable. No phase starts until the previous phase's exit criteria pass.

**Legend**
- 🧑 **Person** — must be done by Karsten (accounts, billing, secrets, design/content decisions, approvals, anything irreversible or tied to identity).
- 🤖 **Agent** — done by the coding agent in the repo, gated by `pnpm verify`.
- ✅ **Exit criteria** — objective checks; the phase is not done until all pass.

Placeholders: brands are `brand-a` and `brand-b` until named. Locales are `en-CA` (source) and `fr-CA`.

---

## Accounts to create (all 🧑, before Phase 1)

| Account | Plan | Used for | Notes |
| --- | --- | --- | --- |
| GitHub | Free | Repo, CI, scheduled jobs | Keep the repo **public** (unlimited Actions minutes) |
| Vercel | Hobby | Hosting `apps/web`, preview deploys | Connect to the GitHub repo |
| Contentful | Free | CMS | 1 space, 2 locales, 2 roles |
| AWS | **Paid plan** (not Free plan) | Lambda, SQS, CloudWatch | Free plan account closes after 6 months. Enable root MFA. Create a $1 budget alert immediately |
| Sentry | Developer | Errors for web + worker | 1 user, 5K errors/mo |
| Google AI Studio | Free | Gemini API key (the one LLM) | Free tier: Flash models only, inputs may be used by Google |
| Claude | Pro | Claude Code (the agent) | Only paid item (~$20/mo) |
| Domain registrar | Optional | Subdomain per brand | Skip for now; use path-prefix brand routing as the fallback |

## Secrets and where they live (all 🧑 to create and paste)

The agent writes `.env.example` documenting every variable; it never sees real values in chat.

| Variable | Created in | Stored in |
| --- | --- | --- |
| `CONTENTFUL_SPACE_ID` | Contentful | Vercel, GitHub Actions, local `.env` |
| `CONTENTFUL_DELIVERY_TOKEN` | Contentful (CDA key) | Vercel, local |
| `CONTENTFUL_PREVIEW_TOKEN` | Contentful (CPA key) | Vercel, local |
| `CONTENTFUL_MANAGEMENT_TOKEN` | Contentful (personal access token) | Local + GitHub Actions (migrations), AWS Secrets/SSM (worker) |
| `CONTENTFUL_WEBHOOK_SECRET` | Generated (random string) | Vercel + Contentful webhook config |
| `SENTRY_DSN` / `SENTRY_AUTH_TOKEN` | Sentry | Vercel, GitHub Actions (source maps) |
| `GEMINI_API_KEY` | Google AI Studio | AWS SSM (worker), local |
| AWS deploy access | AWS IAM (GitHub OIDC role) | GitHub Actions |
| AWS send-to-queue access | AWS IAM (user scoped to `sqs:SendMessage` on one queue) | Vercel |

---

## Phase 0 — Foundations

**Goal:** accounts exist, repo exists, nothing is built yet.

🧑 Person
- Create every account in the table above; enable MFA on all of them.
- Create the empty GitHub repo; install Claude Code locally.
- AWS: switch to Paid plan, create budget alert, create the GitHub OIDC deploy role (the agent can provide the exact policy JSON).
- Decide brand names, one-paragraph voice guide per brand, and a primary colour + font pair for each.

🤖 Agent
- Draft the IAM policy JSON for the OIDC role and the scoped SQS-send user.
- Draft the brand voice guide template for the person to fill in.

✅ Exit
- Every account logs in; AWS budget alert is active; repo is cloned locally.

---

## Phase 1 — Repo scaffold and the quality gate

**Goal:** an empty-but-strict monorepo where the agent cannot finish work without passing checks.

🤖 Agent
- pnpm + Turborepo monorepo: `apps/web`, `packages/ui`, `packages/tokens`, `packages/content`, `workers/content-qa`, `infra`.
- TypeScript strict, ESLint (ban `any`, `@ts-ignore`, disabled tests, hard-coded hex), Prettier.
- Vitest configured across packages.
- `pnpm verify` = typecheck + lint + unit tests (grows each phase).
- `CLAUDE.md` / `AGENTS.md`: conventions, commands, "not done until `pnpm verify` passes".
- `.claude/settings.json` hooks: PostToolUse typecheck, Stop hook runs `verify` (max attempts), PreToolUse blocks edits to test files and fixtures unless unlocked.
- GitHub Actions: `verify` on every PR; branch protection documented.
- `.env.example`, README skeleton, `docs/adr/` folder with ADR template.

🧑 Person
- Enable branch protection on `main` (require CI).
- Review and merge the scaffold PR.

✅ Exit
- `pnpm verify` passes locally and in CI on an empty project.
- A deliberately failing test blocks the agent's Stop hook (tested once by hand).

---

## Phase 2 — Content model and a one-brand vertical slice

**Goal:** an editor changes something in Contentful and it appears on a live `brand-a` page.

🤖 Agent
- Contentful migrations as code (`contentful-migration` / CLI scripts in `packages/content/migrations`): `brand`, `page`, `seo`, `sectionHero`, `sectionCta`.
- Script to create the `fr-CA` locale with fallback to `en-CA` (unused until Phase 4).
- Generated TypeScript types + Zod schemas; typed Contentful client.
- Seed script: `brand-a` + one home page with Hero and CTA (placeholder copy).
- Component registry; `<Hero>` and `<CtaBanner>` in `packages/ui` with Storybook stories fed by Contentful-shaped fixtures.
- Tokens for `brand-a` compiled to CSS variables.
- `app/[brand]/[...slug]` route, `generateMetadata`, preview/draft mode route.
- Webhook route: signature verification, Zod parse, `revalidateTag`. (No queue yet.)
- Sentry wired into `apps/web` (client, server, edge), release = commit SHA, source maps in CI, `beforeSend` scrubbing.
- Script to register the Contentful webhook via the Management API.

🧑 Person
- Paste Contentful, Sentry secrets into Vercel and GitHub (per the secrets table).
- Run the migration and seed scripts against the real space the first time (they write to a live account).
- Import the repo into Vercel; confirm the first production deploy.
- Edit the seeded copy in Contentful to confirm the editor experience.

✅ Exit
- Editing the Hero heading in Contentful updates the live page within seconds, with no redeploy.
- A broken required field logs a Sentry warning and does not crash the page.
- Fresh clone + `pnpm migrate && pnpm seed` reproduces the space.

---

## Phase 3 — Second brand, theming and visual regression

**Goal:** one deploy serves two brands; a component change shows its effect on both in a PR.

🤖 Agent
- Remaining section types: `sectionFeatureGrid` (+ `featureItem`), `sectionTestimonial` — migrations, components, stories.
- Tokens for `brand-b`; semantic token naming enforced by lint.
- Middleware brand resolution (hostname, or path prefix if no domain); unknown host → 404.
- Storybook toolbar brand switcher.
- Visual regression: Playwright screenshots of a static Storybook build, every story × both brands, baselines committed.
- Seed content for `brand-b`.
- Playwright smoke test per brand against preview deploys.

🧑 Person
- Approve the visual direction of both brands (tokens, type) in Storybook.
- Optional: buy a domain and configure DNS + Vercel domains.
- Review and approve the first visual baselines.

✅ Exit
- Both brands render from one deploy with distinct themes.
- Changing one token produces a failing visual diff in CI that shows both brands.

---

## Phase 4 — Localization and the language selector

**Goal:** every page exists in English and French, switchable from the UI.

🤖 Agent
- Locale routing: `/...` = `en-CA`, `/fr/...` = `fr-CA`; middleware rewrites to `/[brand]/[locale]/[...slug]`.
- Localized fields fetched by locale, with Contentful fallback to `en-CA`.
- `LocaleProvider` context: current locale, UI string dictionary, `switchLocale()` (navigates + cookie).
- Language selector component in `packages/ui` with stories.
- `<html lang>`, `hreflang` alternates, `app/sitemap.ts` covering both brands and locales.
- Unit tests for fallback; Playwright test for the selector (URL, `lang`, translated heading).

🧑 Person
- Spot-check French UI strings in the dictionary (or accept machine output for now).

✅ Exit
- Selector switches language on every page and keeps the user on the same page.
- Untranslated fields show English, never blank.
- Sitemap lists every page in both locales.

---

## Phase 5 — The async worker (queue, Lambda, translation)

**Goal:** publishing in English produces a French draft automatically; duplicate webhooks do nothing.

🤖 Agent
- CDK stack in `infra`: SQS queue + DLQ (`maxReceiveCount` 3–5), Lambda with reserved concurrency 1–2, SSM parameters, CloudWatch alarms on DLQ depth and Lambda errors, SNS email topic.
- GitHub Actions deploy job using the OIDC role.
- Webhook route extended: enqueue `{ entryId, version, locale, task }` with dedup key.
- Worker: re-fetch entry, superseded-version check, translate via Gemini with a glossary, structured JSON output validated by Zod, write `fr-CA` as unpublished change, skip fields edited manually (hash of last machine write), partial batch responses.
- Sentry in the worker with the same release SHA.
- Worker tests: duplicate job, superseded version, manual-edit protection, LLM failure, partial batch failure.

🧑 Person
- Run `cdk bootstrap` and approve the **first** `cdk deploy` (it creates billable resources).
- Put `GEMINI_API_KEY` and `CONTENTFUL_MANAGEMENT_TOKEN` into SSM; add the SQS-send credentials to Vercel.
- Confirm the SNS email subscription.
- Review a few real French drafts and publish them by hand.

✅ Exit
- Publish an English change → French draft appears in Contentful, unpublished.
- Re-send the same webhook → no second write (visible in logs).
- A poison message lands in the DLQ and the alarm email arrives.

---

## Phase 6 — Quality automation

**Goal:** accessibility, performance and content quality are checked automatically, not by memory.

🤖 Agent
- Accessibility crawl: Playwright + `@axe-core/playwright` over every sitemap URL (both brands, both locales); runs on preview deploys and weekly on production via scheduled Action.
- Lighthouse CI (`@lhci/cli`) with per-brand budgets: performance, accessibility, SEO scores, LCP, CLS.
- Worker QA task on `Entry.save`: alt-text check, SEO checks (deterministic first), brand-voice lint via Gemini; findings written back as a comment.
- AI eval set: 20–30 fixture entries with expected flags, run in CI when prompts change.
- Storybook interaction tests + a11y addon on every section component.

🧑 Person
- Set the initial Lighthouse budget thresholds (agent proposes from a baseline run).
- Write or approve the expected flags for the eval fixtures.
- Fix or accept the first crawl's findings.

✅ Exit
- Removing alt text from an image fails the crawl in CI.
- A heavy image that breaks the LCP budget fails Lighthouse CI.
- Saving an entry with no alt text produces a QA comment in Contentful.

---

## Phase 7 — Outer loop, documentation and demo

**Goal:** the project explains itself to a reviewer in two minutes.

🤖 Agent
- Sentry MCP workflow documented in `docs/ai-workflow.md`, with at least two real examples (issue → reproducing test → fix PR).
- PR review step in CI (agent comments, human approves).
- `pnpm reset` script: re-run migrations and seed for a clean demo state.
- README: architecture diagram first, setup steps, links to ADRs.
- ADRs: one app vs. many, queue-driven worker, locale in URL over context, tokens in code not CMS.

🧑 Person
- Record a 90-second demo video: publish → French draft → duplicate webhook ignored → crawl catches missing alt.
- Write the "what I'd change at scale" section in your own words (interview material; don't delegate it).
- Pin the repo and add it to your resume and LinkedIn.

✅ Exit
- A stranger can clone, read the README, and understand the system without asking.
- The demo video exists and is linked from the README.

---

## Later (optional, in order of interview value)

- Contentful sidebar app showing QA results before publish.
- Editor-only preview toggle for French drafts (Next.js draft mode).
- Localized slugs.
- Python version of the worker (if a target role makes it worth it).

---

## Standing rules for the agent (copy into `CLAUDE.md`)

1. Never commit secrets; read them only from env vars.
2. Never run a command that writes to a live account (Contentful migrations, seed, `cdk deploy`) without the person's explicit go-ahead in that session.
3. Never edit test files or fixtures unless the task says so.
4. Work in small PRs, one phase deliverable each; `pnpm verify` must pass before saying done.
5. Every new architectural choice gets a short ADR.
