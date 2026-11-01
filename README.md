# onurravli.com

Personal site and portfolio of Onur Ravli: experience, projects, skills, blog,
and a contact form, with an admin panel for editing all content live and a
self-hosted, privacy-friendly analytics dashboard.

## Stack

- **Next.js 16** (App Router, Server Components, Server Functions) and **React 19**
- **Tailwind CSS 4**, shadcn/ui primitives for the admin panel
- **PostgreSQL** via **Prisma 7** for content
- **Upstash Redis** (REST) as a read-through cache and for live visitor counts
- **ClickHouse** for page-view and event analytics
- **Auth.js** credentials login for the admin panel
- **Resend** for owner notification emails
- **Biome** for linting and formatting, **pnpm** for packages

## Getting started

### Everything in Docker

```bash
cp .env.example .env          # fill in AUTH_SECRET and the admin login at least
docker compose up --build     # production image at http://localhost:3000
```

Compose starts Postgres, ClickHouse, Redis with an Upstash-compatible REST shim,
runs migrations and seeds an empty database (`migrate` service), then starts the
app. For hot reload, use the development override:

```bash
docker compose -f compose.yaml -f compose.dev.yaml watch
```

### App on the host, services in Docker

```bash
pnpm install
docker compose up -d postgres clickhouse redis-http
pnpm db:deploy && pnpm db:seed
pnpm dev
```

## Configuration

All variables are documented in [`.env.example`](.env.example). Resend and
`GITHUB_TOKEN` are optional locally: without them the contact form reports a
send error, and GitHub data falls back to unauthenticated, rate-limited requests
(no contribution graph).

## Scripts

| Script                      | Purpose                                     |
| --------------------------- | ------------------------------------------- |
| `pnpm dev`                  | Development server                          |
| `pnpm build` / `pnpm start` | Production build and server                 |
| `pnpm lint` / `pnpm format` | Biome check / apply fixes                   |
| `pnpm typecheck`            | TypeScript                                  |
| `pnpm db:migrate`           | Create and apply a migration in development |
| `pnpm db:deploy`            | Apply pending migrations (production)       |
| `pnpm db:seed`              | Fill empty tables with the initial content  |

## Project layout

```
content/blog/          Initial blog posts (MDX), imported by the seed
docker/clickhouse/     Analytics schema, applied on first ClickHouse start
prisma/                Schema, migrations, seed
src/app/(site)/        Public pages: home, blog, privacy
src/app/admin/         Admin panel (one route per section) and its Server Functions
src/app/api/           Analytics ingestion, auth, and the /api/site-data feed
src/components/        Site components, analytics trackers, shadcn/ui primitives
src/lib/               Data access, caching, integrations, shared schemas
```

## Notes

- Content lives in Postgres and is edited in `/admin`. Reads go through Redis
  and are invalidated by every admin change.
- `/api/site-data` is consumed by
  [onurravli/ssh-server](https://github.com/onurravli/ssh-server); keep its
  shape stable.
- `public/Onur_Ravli_CV.pdf` and `public/Onur_Ravli_Resume.pdf` are updated by
  the [onurravli/resume](https://github.com/onurravli/resume) workflow.
