# -----------------------------
# Stage 1: Prune monorepo
# -----------------------------
FROM node:22-alpine AS pruner

WORKDIR /app

RUN corepack enable

COPY . .

RUN pnpm dlx turbo prune admin --docker


# -----------------------------
# Stage 2: Install dependencies
# -----------------------------
FROM node:22-alpine AS installer

WORKDIR /app

RUN corepack enable

COPY --from=pruner /app/out/json/ .

RUN pnpm install --frozen-lockfile


# -----------------------------
# Stage 3: Build application
# -----------------------------
FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY --from=installer /app/ .

COPY --from=pruner /app/out/full/ .

RUN pnpm turbo build --filter=admin


# -----------------------------
# Stage 4: Production runner
# -----------------------------
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=development

COPY --from=builder /app/apps/admin/.next/standalone ./
COPY --from=builder /app/apps/admin/.next/static ./apps/admin/.next/static
COPY --from=builder /app/apps/admin/public ./apps/admin/public

EXPOSE 3001

CMD ["node", "apps/admin/server.js"]