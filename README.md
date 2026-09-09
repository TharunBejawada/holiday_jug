# Holiday Jug

UK package-holiday booking site (think onthebeach.co.uk) — search, browse and book holidays.

## Stack

| Concern     | Choice                                                       |
| ----------- | ------------------------------------------------------------- |
| Monorepo    | npm workspaces + Turborepo                                    |
| Frontend    | Next.js 15 (App Router) + TypeScript + TailwindCSS            |
| Backend     | Next.js Route Handlers (`apps/web/src/app/api/**`)             |
| Domain/data logic | `packages/core` (zod validation + query logic), shared by API routes |
| Database    | Aurora PostgreSQL (Serverless v2) via Prisma (`packages/db`)  |
| Auth        | NextAuth.js (credentials provider, JWT sessions)               |
| API security| Rate limiting + security headers (`middleware.ts`), session guard, internal shared-secret guard for server-to-server calls |
| Hosting     | AWS Amplify Hosting (SSR + API routes) |

See [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) for the full AWS deployment plan and the reasoning behind Aurora over DynamoDB.

## Monorepo layout

```
apps/
  web/            Next.js app — pages, API routes, UI
packages/
  db/             Prisma schema + generated client, single source of truth for the data model
  core/           Shared query/business logic + validation, used by API routes
```

## Local development

Everyone runs against the **same shared Aurora database** by default (or your own sandbox — same variable, different value).

1. Copy the env file and fill in the real connection string (ask a teammate or check the team's secrets vault for `DATABASE_URL`):
   ```bash
   cp .env.example .env
   ```
2. Install dependencies (from the repo root):
   ```bash
   npm install
   ```
3. Generate the Prisma client and (first time only, or after a schema change) run migrations:
   ```bash
   npm run db:generate
   npm run db:migrate
   ```
4. Optional — seed a couple of example destinations/packages so the home page isn't empty:
   ```bash
   npm run db:seed
   ```
5. Run everything:
   ```bash
   npm run dev
   ```
   The web app comes up at http://localhost:3000.

No Docker, no local database required — `.env`'s `DATABASE_URL` is the only thing that changes between "shared dev DB" and "my own sandbox".

### Useful scripts (run from repo root)

- `npm run dev` — run all apps (Turborepo)
- `npm run build` — build all apps
- `npm run lint` / `npm run typecheck`
- `npm run db:migrate` — create/apply a Prisma migration against `DATABASE_URL`
- `npm run db:studio` — open Prisma Studio to browse the DB
- `npm run db:seed` — insert sample data

## Adding a database field/model

Edit `packages/db/prisma/schema.prisma`, then:

```bash
npm run db:migrate
```

This updates the shared dev DB (if everyone points at the same instance, coordinate schema changes) and regenerates the Prisma client used by both `packages/core` and `apps/web`.

## API security model

- Every request under `/api/**` passes through `apps/web/src/middleware.ts`: rate limiting + baseline security headers.
- User-scoped endpoints call `requireSession()` (`apps/web/src/lib/api-auth.ts`) to require a signed-in NextAuth session.
- Internal/admin endpoints call `requireInternalSecret()` and expect an `x-internal-api-key` header matching `API_INTERNAL_SECRET`.

## Next steps for the team

- Flesh out `/holidays` search results page and `/holidays/[slug]` package detail page (both can reuse `searchPackages` from `packages/core`).
- Build the booking flow (`/api/bookings`) with `requireSession()`.
- Wire up a payments provider (Stripe is a natural fit) behind a webhook route with signature verification.
- Add integration tests against a disposable Postgres (e.g. in CI) once the schema stabilizes.
