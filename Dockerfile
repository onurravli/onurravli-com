# syntax=docker/dockerfile:1

ARG NODE_VERSION=24

# ---- base: Node with pnpm --------------------------------------------------
FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable

# ---- deps: all dependencies + generated Prisma client ----------------------
FROM base AS deps
COPY package.json pnpm-lock.yaml prisma.config.ts ./
COPY prisma ./prisma
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
	pnpm install --frozen-lockfile

# ---- dev: `next dev` with hot reload (see compose.dev.yaml) ----------------
FROM deps AS dev
COPY . .
EXPOSE 3000
CMD ["pnpm", "dev", "--hostname", "0.0.0.0"]

# ---- migrate: one-shot job that applies migrations and seeds empty tables --
FROM deps AS migrate
COPY content ./content
CMD ["sh", "-c", "pnpm db:deploy && pnpm db:seed"]

# ---- build: standalone production bundle -----------------------------------
FROM deps AS build
COPY . .
RUN pnpm build

# ---- runner: minimal production image --------------------------------------
FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
	NEXT_TELEMETRY_DISABLED=1 \
	PORT=3000 \
	HOSTNAME=0.0.0.0

COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public

USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
	CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1
CMD ["node", "server.js"]
