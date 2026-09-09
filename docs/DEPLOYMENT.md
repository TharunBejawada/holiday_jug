# Deployment plan (AWS)

## Hosting — AWS Amplify Hosting

- Connect this repo to Amplify Hosting; it auto-detects `amplify.yml` at the repo root and builds the `apps/web` Next.js app (App Router, SSR + API routes run as Amplify-managed Lambda@Edge/Lambda functions).
- Create one Amplify app with branch deployments:
  - `main` → production
  - `develop` → staging
  - PR branches → ephemeral preview environments (enable "Pull request previews")
- Set environment variables per branch in Amplify Console (Hosting → Environment variables): `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `API_INTERNAL_SECRET`. Store the actual secret values in **AWS Secrets Manager** and reference them from Amplify (or inject via Amplify's built-in env var encryption) — never commit real secrets.

## Database — Aurora PostgreSQL (Serverless v2)

Why Aurora over DynamoDB: the domain (destinations, hotels, packages, departures, bookings, reviews) is highly relational — search/filter by destination + price + dates + board type, joins across packages/hotels/bookings, and transactional integrity on booking + payment. That's a natural fit for SQL; DynamoDB would require pre-designing every access pattern and makes ad-hoc filtering/search painful. Aurora Serverless v2 scales capacity (ACUs) up/down automatically with load, so it stays cheap at low traffic and scales for peak booking season without manual resizing.

- Create an Aurora PostgreSQL Serverless v2 cluster in a private VPC subnet.
- Amplify SSR compute needs VPC access to reach it — use Amplify's VPC connectivity (via a Lambda execution role + security group allowing the Amplify compute to reach Aurora's security group on 5432), or front the DB with the **RDS Data API** if you want a VPC-less HTTP path.
- One cluster, multiple logical databases/schemas for `dev`, `staging`, `prod`, or a separate small cluster per environment if budget allows — either way, each environment gets its own `DATABASE_URL` value, same variable name.
- Prisma migrations (`packages/db`) run via `npm run db:deploy` in CI/CD (or as an Amplify build step) against the target environment's `DATABASE_URL`.

## API security

- All routes under `apps/web/src/app/api/**` are gated by `src/middleware.ts` (rate limiting + baseline security headers) on every request.
- User-facing endpoints (bookings, profile) additionally require a NextAuth session — see `src/lib/api-auth.ts#requireSession`.
- Server-to-server/admin endpoints use a shared secret header (`x-internal-api-key`) validated by `requireInternalSecret`, backed by `API_INTERNAL_SECRET` in Secrets Manager.
- Put **AWS WAF** in front of the Amplify domain (CloudFront distribution Amplify creates) with managed rule groups (common OWASP rules, rate-based rule) for defense in depth beyond app-level rate limiting.
- Enforce HTTPS only (Amplify does this by default) and set `NEXTAUTH_URL` to the HTTPS domain per environment.

## Scaling notes

- Aurora Serverless v2 autoscales read/write capacity; add an Aurora Read Replica if read traffic (search/browse) starts to dominate write traffic (bookings).
- Amplify SSR scales horizontally automatically (Lambda-based) — no manual capacity planning needed for the app tier.
- The in-memory rate limiter in `src/lib/rate-limit.ts` is per-instance; if you outgrow it, move to a shared store (DynamoDB single-table or ElastiCache/Redis) so limits apply across all concurrent Lambda instances.
