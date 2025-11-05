# Core Architecture & Entry Points

## Backend (NestJS)

- **Entry point**: `backend/src/main.ts`
  - Creates Nest application with `NestFactory.create(AppModule)`.
  - Sets global API prefix `api`.
  - Enables CORS (origin from `process.env.FRONTEND_URL` or `http://localhost:3000`).
  - Registers global validation pipe (`whitelist`, `transform`, `forbidNonWhitelisted`).
  - Registers global exception filter `AllExceptionsFilter`.
  - Sets up Swagger UI at `/api/docs`.
  - Listens on `process.env.PORT` (default **3001**).

- **Root module**: `backend/src/app.module.ts`
  - Imports:
    - `ConfigModule` (global, loads `database.config.ts` & `jwt.config.ts`).
    - Feature modules:
      - `AuthModule` (`backend/src/modules/auth/`).
      - `PostsModule` (`backend/src/modules/posts/`).
      - `TagsModule` (`backend/src/modules/tags/`).
  - Exposes `AppModule` as the application container.

- **Feature modules** (example: Auth)
  - **Structure**: `application` (use‑cases), `domain` (entities, repositories, value objects), `infrastructure` (adapters, persistence, strategies), `presentation` (controllers, DTOs, mappers).
  - **Auth** uses JWT strategy (`jwt.strategy.ts`) and Prisma for persistence (`prisma-user.repository.ts`).

- **Configuration**
  - `backend/src/config/database.config.ts` – Prisma DB connection.
  - `backend/src/config/jwt.config.ts` – JWT secret & expiration.

- **Error handling**
  - Global filter `AllExceptionsFilter` returns JSON with `statusCode`, `timestamp`, `path`, `message`.

- **Testing**
  - Unit tests under `src/**/*.spec.ts` executed by Jest (`npm run test`).

## Frontend (Next.js with i18n)

- **Entry point**: `app/layout.tsx`
  - Wraps the whole app with providers (`ThemeProvider`, `AuthProvider`, `BlogProvider`, etc.).
  - Sets up global HTML metadata.

- **Internationalization**
  - Plugin `next-intl` via `next.config.mjs` (`createNextIntlPlugin('./i18n/request.ts')`).
  - Locale‑aware pages under `app/[locale]/` (e.g., `about`, `admin`, `contact`, `posts`).

- **Routing**
  - Dynamic route for posts: `app/[locale]/posts/[id]/page.tsx`.
  - Default locale handling via Next.js built‑in routing.

- **API client**
  - `lib/api-client.ts` provides a thin wrapper around `fetch` with base URL from `process.env.NEXT_PUBLIC_API_URL`.

- **State & Context**
  - `lib/blog-context.tsx`, `lib/auth-context.tsx`, `components/theme-provider.tsx` manage global state.

- **Styling**
  - Tailwind CSS (`tailwind.config.js` not shown) with utility‑first classes.
  - Helper `cn` in `lib/utils.ts` merges Tailwind class strings (`clsx` + `tailwind-merge`).

## Shared Utilities

- **Formatting**: `backend/.prettierrc` enforces single quotes and trailing commas.
- **TypeScript configs**:
  - Root `tsconfig.json` – Next.js compiler options.
  - `backend/tsconfig.json` – NestJS compiler options, path aliases (`@/*`, `@common/*`, etc.).

## Build / Run Overview

| Layer      | Build Command | Run Command | Notes |
|------------|---------------|-------------|-------|
| Frontend   | `npm run build` (Next.js) | `npm run start` | Serves on default port **3000**. |
| Backend    | `npm run build` (Nest)   | `npm run start:prod` | Produces compiled files in `dist/`; runs on **3001**. |
| Both       | `npm run dev` (frontend) & `npm run start:dev` (backend) | Parallel dev servers. |
