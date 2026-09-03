# Order Management System

Monorepo for an Order Management System following the ED Microservices Monorepo pattern.
See docs/architecture/ and ADRs.

## Structure

- apps/ — deployable services
- packages/ — shared libraries (only after proven reuse)
- tooling/ — eslint / prettier / typescript configs
- docs/ — architecture + domain

## Current service

order-service — owns order lifecycle, API and data.

## Local development

1. Postgres:

   docker compose up -d postgres

2. Env:

   cp apps/order-service/.env.example apps/order-service/.env

3. Install and migrate:

   pnpm install
   pnpm --filter @repo/order-service exec prisma migrate dev --name init

4. Run:

   pnpm --filter @repo/order-service dev

Health: GET http://localhost:3000/health

## Root scripts

- pnpm build
- pnpm test
- pnpm lint
- pnpm typecheck

## Architecture principles

1. Ownership
2. Boundary
3. Direction
4. Evolution (local first, extract when justified)

See docs/architecture/README.md and docs/domain/.
