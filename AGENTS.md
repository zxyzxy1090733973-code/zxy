# AGENTS.md

## Project Overview

This repository implements a web application that converts concept artwork into separate 3D models.

The main workflow is:

1. The user uploads one concept artwork.
2. OpenAI analyzes the artwork and produces a structured list of parts.
3. The user reviews and edits the part list.
4. The system generates an isolated reference image for each approved part.
5. The system generates front, left, and back views for each part.
6. The system sends the multiview images to Tripo.
7. Tripo generates a 3D model for each part.
8. The system downloads and permanently stores the GLB model.
9. The system analyzes triangle count, vertex count, mesh count, materials, textures, bounding box, and file size.
10. The user previews the GLB model in the browser.
11. The user approves or rejects the model.
12. After approval, the system creates OBJ and FBX exports.
13. The user downloads validated OBJ and FBX files.

The application does not assemble the generated parts into one model.

## Technology Stack

- Language: TypeScript
- Monorepo: pnpm workspace and Turborepo
- Frontend: Next.js
- API: NestJS
- Background jobs: BullMQ
- Queue and cache: Redis
- Database: PostgreSQL
- ORM: Prisma
- File storage: S3-compatible storage, with MinIO for local development
- 3D preview: Three.js, React Three Fiber, and Drei
- Runtime validation: Zod
- Unit and integration testing: Vitest
- End-to-end testing: Playwright
- Local infrastructure: Docker Compose

## Repository Structure

- `apps/web`: Next.js frontend
- `apps/api`: NestJS HTTP API
- `apps/worker`: asynchronous BullMQ workers
- `packages/domain`: framework-independent domain rules
- `packages/application`: use cases and provider ports
- `packages/contracts`: shared Zod schemas, DTOs, jobs, and events
- `packages/integrations/openai`: OpenAI adapters
- `packages/integrations/tripo`: Tripo adapters
- `packages/infrastructure`: Prisma, Redis, queue, storage, and logging adapters
- `packages/prompts`: versioned AI prompts
- `docs`: product and architecture documentation
- `tests`: shared fixtures, integration tests, and end-to-end tests

## Architecture Rules

1. Domain code must not depend on NestJS, Next.js, Prisma, BullMQ, Redis, OpenAI, Tripo, or AWS SDK packages.
2. Application use cases depend on interfaces defined as ports.
3. OpenAI and Tripo API details must remain inside integration packages.
4. Provider response types must not be exposed to the frontend or domain layer.
5. All external provider responses must be validated and mapped into internal contracts.
6. Long-running operations must run in workers, not inside HTTP controllers.
7. Every paid external operation must use an idempotency key.
8. Every generated image and model must be versioned.
9. Previous model versions must not be overwritten.
10. Provider temporary URLs must be downloaded into the application's own object storage.
11. API keys must never be sent to the browser.
12. Download authorization must be enforced by the backend.
13. Models must not be downloadable before user approval.
14. OBJ and FBX exports must be validated before download is enabled.
15. Do not implement part assembly, rigging, animation, or scene composition.

## Coding Rules

- Use TypeScript strict mode.
- Avoid `any` unless there is a documented reason.
- Validate untrusted runtime data with Zod.
- Prefer small modules with one clear responsibility.
- Do not place business logic in controllers or React components.
- Do not call OpenAI or Tripo directly from frontend code.
- Do not hardcode model versions, API URLs, credentials, or storage locations.
- Use dependency injection for provider implementations.
- Handle errors explicitly.
- Log provider request IDs and task IDs without logging API keys.
- Add tests for status transitions, permissions, paid operations, and retries.

## State and Workflow Rules

- Each project has an overall project status.
- Each part has its own independent processing status.
- Each generated model has a separate version and review status.
- Failed processing for one part must not stop unrelated parts.
- User approval must reference a specific generated model ID.
- Rejected models must create a new version when regenerated.
- Export jobs must only be created for approved model versions.

## Security Rules

- Never commit `.env` files or real credentials.
- Never expose OpenAI or Tripo keys in browser bundles.
- Validate upload type, size, and ownership.
- Store generated files in private object storage.
- Generate short-lived signed download URLs.
- Validate user permissions before model review, export, or download.
- Add rate limits and per-project usage limits.
- Use timeouts for all external requests.
- Do not log full provider authorization headers.

## Commands

- Install dependencies: `pnpm install`
- Start development: `pnpm dev`
- Build all packages: `pnpm build`
- Lint: `pnpm lint`
- Type check: `pnpm typecheck`
- Run unit tests: `pnpm test`
- Run end-to-end tests: `pnpm test:e2e`
- Start local infrastructure: `docker compose up -d`
- Stop local infrastructure: `docker compose down`
- Create Prisma migration: `pnpm db:migrate`
- Generate Prisma client: `pnpm db:generate`

## Definition of Done

A task is complete only when:

1. The requested functionality is implemented.
2. Relevant types and contracts are updated.
3. Runtime input is validated where required.
4. Error handling is implemented.
5. Relevant unit or integration tests are added.
6. `pnpm lint` passes.
7. `pnpm typecheck` passes.
8. `pnpm test` passes.
9. `pnpm build` passes.
10. Documentation is updated.
11. No secrets are included in the changes.
12. The complete Git diff has been reviewed.
13. Remaining risks or untested cases are reported.

## Git Rules

- Make small, focused commits.
- Do not mix unrelated refactoring with feature work.
- Do not commit generated secrets or local runtime data.
- Do not rewrite shared history without explicit permission.
- Before completing a task, show changed files and test results.
- Use descriptive commit messages such as:
  - `feat: add project creation flow`
  - `fix: prevent duplicate Tripo submissions`
  - `test: cover model approval permissions`
  - `docs: update model export workflow`