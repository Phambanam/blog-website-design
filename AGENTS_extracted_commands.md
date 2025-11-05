# Extracted Build, Lint, and Test Commands (Non‑Standard)

## Frontend (Next.js) – `package.json`
- **build**: `next build`
- **dev**: `next dev`
- **lint**: `eslint .`
- **start**: `next start`

*All commands are standard for a Next.js project.*

## Backend (NestJS) – `backend/package.json`
- **build**: `nest build` (non‑standard for NestJS, usually `npm run build` runs this)
- **format**: `prettier --write "src/**/*.ts" "test/**/*.ts"` (code formatting)
- **start**: `nest start`
- **start:dev**: `nest start --watch` (development mode with hot‑reload)
- **start:debug**: `nest start --debug --watch` (debug mode)
- **start:prod**: `node dist/main` (run compiled production build)
- **lint**: `eslint "{src,apps,libs,test}/**/*.ts" --fix` (lint with auto‑fix)
- **test**: `jest` (run all unit tests)
- **test:watch**: `jest --watch` (watch mode)
- **test:cov**: `jest --coverage` (coverage report)
- **test:debug**: `node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand` (debug individual tests)
- **test:e2e**: `jest --config ./test/jest-e2e.json` (end‑to‑end tests)

*Non‑standard aspects*: custom `test:debug`, `test:e2e`, and the use of `nest` CLI for building and starting the server.