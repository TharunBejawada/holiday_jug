# Deployment plan (AWS)

## Hosting — AWS Amplify Hosting

- Connect this repo to Amplify Hosting; it auto-detects `amplify.yml` at the repo root and builds the `apps/web` Next.js app (App Router, SSR + API routes run as Amplify-managed Lambda@Edge/Lambda functions).
- Create one Amplify app with branch deployments:
  - `main` → production
  - `develop` → staging
  - PR branches → ephemeral preview environments (enable "Pull request previews")
- Set environment variables per branch in Amplify Console (Hosting → Environment variables): `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `API_INTERNAL_SECRET`, `SES_REGION`, `SES_FROM_EMAIL`, `S3_REGION`, `S3_BUCKET_NAME`. Store the actual secret values in **AWS Secrets Manager** and reference them from Amplify (or inject via Amplify's built-in env var encryption) — never commit real secrets.
- **Important**: Amplify injects these console-configured variables into the *build* shell, but the deployed SSR Lambda's *runtime* doesn't automatically inherit them — server code (like Prisma) would see `undefined` for `process.env.DATABASE_URL` at request time even though the build succeeded. `amplify.yml`'s build phase works around this by writing the injected vars into `.env.production` before `next build` runs, so Next.js bundles them into the server output. **Any new env var used at runtime must be added to both** the Amplify Console *and* the `echo` list in `amplify.yml`'s build phase, or it'll silently be `undefined` in production while working fine locally.

## Database — Aurora PostgreSQL (Serverless v2)

Why Aurora over DynamoDB: the domain (destinations, hotels, packages, departures, bookings, reviews) is highly relational — search/filter by destination + price + dates + board type, joins across packages/hotels/bookings, and transactional integrity on booking + payment. That's a natural fit for SQL; DynamoDB would require pre-designing every access pattern and makes ad-hoc filtering/search painful. Aurora Serverless v2 scales capacity (ACUs) up/down automatically with load, so it stays cheap at low traffic and scales for peak booking season without manual resizing.

### Console setup

1. **RDS Console → Create database**
   - Engine: **Aurora (PostgreSQL Compatible)**
   - Templates: **Production** (or Dev/Test for a non-prod cluster)
   - Capacity type: **Serverless v2** — set min 0.5 ACU, max 2 ACU to start (adjust once you see real load)
   - DB cluster identifier: `holiday-jug-prod` (or `-dev`/`-staging`)
   - Master username/password: generate and store in **AWS Secrets Manager** (RDS offers to do this automatically — take that option)
   - Region: **eu-west-2 (London)** — co-locate with your UK-primary audience
2. **Connectivity**:
   - For a quick start: set **Public access = Yes**, but lock the security group's inbound rule to port 5432 from `0.0.0.0/0` only temporarily while testing, then tighten it. Require SSL (`sslmode=require`, already in the connection string in `.env.example`).
   - For the hardened setup (recommended before real customer data flows): **Public access = No**, and configure Amplify Hosting's VPC connectivity so the SSR compute can reach the cluster privately. This is more setup work — fine to do as a follow-up once the basic flow is proven.
3. Once created, copy the cluster's **writer endpoint** into `DATABASE_URL` (format already in `.env.example`) and set it in Amplify Console → Environment variables for each branch.
4. Run migrations against it: `npm run db:migrate` (first time, creates the schema) or `npm run db:deploy` (CI-style, applies existing migrations without prompting).

- One cluster, multiple logical databases/schemas for `dev`, `staging`, `prod`, or a separate small cluster per environment if budget allows — either way, each environment gets its own `DATABASE_URL` value, same variable name.
- Prisma migrations (`packages/db`) run via `npm run db:deploy` in CI/CD (or as an Amplify build step) against the target environment's `DATABASE_URL`.

## Email — AWS SES

Sends the passwordless sign-in link (`apps/web/src/lib/ses.ts`). Production access is assumed already approved (no more sandbox restriction).

1. **SES Console → Verified identities → Create identity**
   - Identity type: **Domain**
   - Domain: `holidayjug.com`
   - Enable **Easy DKIM**
2. SES gives you 3 **CNAME records** for DKIM — add them in GoDaddy's DNS panel the same way you added the earlier validation CNAME (Name = the prefix only, GoDaddy appends the domain automatically — see the earlier domain-verification troubleshooting in this project's history if that trips you up again).
3. Also add an **SPF** record (`TXT` on `holidayjug.com`): `v=spf1 include:amazonses.com ~all` — if a TXT record already exists there, merge the `include:amazonses.com` into it rather than adding a second TXT record (only one SPF TXT record is allowed per domain).
4. Optionally add a **DMARC** record (`TXT` on `_dmarc.holidayjug.com`): `v=DMARC1; p=none; rua=mailto:dmarc-reports@holidayjug.com` — start with `p=none` (monitor only) before tightening to `p=quarantine`/`p=reject` once you've confirmed legitimate mail isn't failing.
5. Wait for the domain identity to show **Verified** in SES Console (DNS propagation, usually well under an hour).
6. Set `SES_FROM_EMAIL=no-reply@holidayjug.com` and `SES_REGION=eu-west-2` in Amplify's environment variables.
7. **IAM permission** (no static access keys needed): attach a policy to Amplify's compute/service role granting:
   ```json
   { "Effect": "Allow", "Action": ["ses:SendEmail", "ses:SendRawEmail"], "Resource": "*" }
   ```
   Find the role under Amplify Console → App settings → General, or IAM → Roles (search for the Amplify app's auto-created role).

## File storage — AWS S3

Stores destination/hotel images and promo videos, uploaded via the admin asset library (`/api/assets/upload-url` → direct browser-to-S3 PUT → `/api/assets` records it).

1. **S3 Console → Create bucket**
   - Bucket name: `holidayjug-assets-prod` (globally unique — adjust if taken)
   - Region: **eu-west-2 (London)**
   - Block Public Access: keep **on** for the bucket-level settings that block ACLs; instead make objects readable via a **bucket policy** scoped to `GetObject` only (below), not by disabling all public-access blocking
2. **Bucket policy** (Permissions tab → Bucket policy) — allows anyone to *view* uploaded images/videos, nobody to list or write without auth:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [{
       "Sid": "PublicReadOnly",
       "Effect": "Allow",
       "Principal": "*",
       "Action": "s3:GetObject",
       "Resource": "arn:aws:s3:::holidayjug-assets-prod/*"
     }]
   }
   ```
3. **CORS configuration** (Permissions tab → CORS) — required so the browser can PUT directly to S3 from `www.holidayjug.com`:
   ```json
   [{
     "AllowedOrigins": ["https://www.holidayjug.com", "http://localhost:3000"],
     "AllowedMethods": ["PUT"],
     "AllowedHeaders": ["*"]
   }]
   ```
4. Set `S3_BUCKET_NAME=holidayjug-assets-prod` and `S3_REGION=eu-west-2` in Amplify's environment variables.
5. **IAM permission**: attach a policy to the same Amplify compute role granting:
   ```json
   { "Effect": "Allow", "Action": ["s3:PutObject"], "Resource": "arn:aws:s3:::holidayjug-assets-prod/*" }
   ```
6. Uploads are currently gated to users with the `ADMIN` role (`requireAdmin` in `src/lib/api-auth.ts`) — this is a content-management tool for the team, not a public user-upload feature.

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
