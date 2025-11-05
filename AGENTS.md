# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Project Stack
- **Frontend**: Next.js 15 (React 19) with TypeScript, Tailwind CSS, `next-intl` for i18n.
- **Backend**: NestJS 11 (TypeScript) with Prisma ORM, JWT authentication.
- **Package Manager**: npm (both frontend and backend use `package.json`).

## Build / Lint / Test Commands (Non‑Standard)
- **Frontend**
  - `npm run build` – builds the Next.js app.
  - `npm run dev` – starts the dev server (port 3000).
  - `npm run lint` – runs `eslint .`.
  - `npm run start` – starts the production server (port 3000).
- **Backend**
  - `npm run build` – `nest build` (produces `dist/`).
  - `npm run start:dev` – `nest start --watch`.
  - `npm run start:debug` – `nest start --debug --watch`.
  - `npm run start:prod` – `node dist/main` (port 3001).
  - `npm run lint` – `eslint "{src,apps,libs,test}/**/*.ts" --fix`.
  - `npm run test` – runs Jest unit tests (`src/**/*.spec.ts`).
  - `npm run test:e2e` – runs end‑to‑end tests (`test/jest-e2e.json`).

## Core Architecture & Entry Points
- **Backend entry point**: `backend/src/main.ts` – creates Nest app, sets global prefix `api`, enables CORS, registers global validation pipe, exception filter, Swagger UI at `/api/docs`, listens on `process.env.PORT || 3001`.
- **Root module**: `backend/src/app.module.ts` – imports `ConfigModule` (loads DB & JWT configs) and feature modules `AuthModule`, `PostsModule`, `TagsModule`.
- **Feature modules** follow clean architecture: `application` (use‑cases), `domain` (entities, repositories), `infrastructure` (adapters, persistence), `presentation` (controllers, DTOs).
- **Frontend entry point**: `app/layout.tsx` – wraps app with providers (`ThemeProvider`, `AuthProvider`, `BlogProvider`).
- **i18n**: `next.config.mjs` uses `next-intl/plugin` with `i18n/request.ts`; locale‑aware pages live under `app/[locale]/`.

## Project‑Specific Utilities & Patterns
- **Class name helper** (`lib/utils.ts`):
  ```ts
  export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
  }
  ```
  – merges Tailwind class strings safely.
- **API client** (`lib/api-client.ts`):
  - Reads JWT token from `localStorage` (client side) and adds `Authorization: Bearer <token>` header.
  - Centralised error handling: throws `Error(message)` with server‑provided message or HTTP status.
  - Provides `get`, `post`, `put`, `delete` methods returning typed JSON.
- **Backend global filter** (`backend/src/common/filters/http-exception.filter.ts`):
  - Formats all errors as JSON `{statusCode, timestamp, path, message}`.
- **Swagger** is auto‑generated in `backend/src/main.ts` and served at `/api/docs`.

## Code‑Style Conventions (Non‑Obvious)
- **Prettier** (`backend/.prettierrc`): single quotes, trailing commas.
- **ESLint** (`backend/eslint.config.mjs`):
  - `@typescript-eslint/no-explicit-any` is **off**.
  - `@typescript-eslint/no-floating-promises` and `@typescript-eslint/no-unsafe-argument` are **warn**.
  - Prettier integration enforces `endOfLine: "auto"`.
- **TSConfig**:
  - Root `tsconfig.json` uses `module: "esnext"`, `moduleResolution: "bundler"`, path alias `@/*` → `./*`.
  - Backend `tsconfig.json` uses `module: "commonjs"`, `outDir: "./dist"`, path aliases `@/*`, `@common/*`, `@config/*`, `@modules/*`, `@shared/*`.
- **Naming**: Files use kebab‑case for components (`*.tsx`), PascalCase for classes/modules, snake_case for API fields (e.g., `featured_image`).

## Testing Setup & Single‑Test Command
- **Jest** (backend) configuration is in `backend/package.json` under `"jest"` and `backend/jest-e2e.json`.
- Unit tests live in `src/**/*.spec.ts`; run all with `npm run test`.
- To run a single test file: `npm run test -- src/modules/auth/application/use-cases/login.use-case.spec.ts`.
- End‑to‑end tests are in `backend/test/`; run with `npm run test:e2e`.

## Gotchas & Hidden Requirements
- **CORS origin** defaults to `process.env.FRONTEND_URL` or `http://localhost:3000`; ensure the env var matches the frontend URL in production.
- **Global validation pipe** strips unknown properties (`whitelist: true`) – payloads must match DTOs exactly.
- **Swagger UI** is only available when the server is running; path is `/api/docs`.
- **API base URL** for the frontend defaults to `http://localhost:3001/api`; override with `NEXT_PUBLIC_API_URL` in `.env`.
- **Tailwind class merging** must use the `cn` helper to avoid duplicate utilities.