# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Empora is a modern e-commerce platform built with **microservices architecture** using Next.js 16 and Nest.js 11 in a pnpm monorepo, following **Test-Driven Development (TDD)** principles.

## Commands

### Development

```bash
# Start all services (use scripts for convenience)
.\scripts\dev.bat         # Windows
./scripts/dev.sh          # Linux/Mac

# Start individual services
pnpm dev:frontend         # Next.js frontend (Port 3000)
pnpm dev:gateway          # API Gateway (Port 3001)
pnpm dev:auth             # Auth Service (Port 3002)
pnpm dev:product          # Product Service (Port 3003)
pnpm dev:cart             # Cart Service (Port 3004)
pnpm dev:order            # Order Service (Port 3005)
pnpm dev:notification     # Notification Service (Port 3006)
```

### Testing

```bash
# Run all tests
pnpm test

# Service-specific tests
pnpm test:auth
pnpm test:product
pnpm test:frontend

# Frontend-specific tests
pnpm test:e2e              # Playwright E2E tests
pnpm test:e2e:ui           # Playwright UI mode
pnpm test:e2e:headed       # Playwright headed mode
pnpm test:e2e:report       # View Playwright report

# Coverage
pnpm --filter frontend test:cov
pnpm --filter product-service test:cov
```

### Building

```bash
# Build all services
pnpm build

# Build individual services
pnpm build:frontend
pnpm build:gateway
pnpm build:auth
pnpm build:product
pnpm build:packages
```

### Database Operations

```bash
# Prisma migrations
pnpm db:migrate:auth       # Auth service migrations
pnpm db:migrate:product    # Product service migrations

# Generate Prisma clients
pnpm db:generate:auth
pnpm db:generate:product

# Prisma Studio (database GUI)
pnpm db:studio:auth
pnpm db:studio:product

# Direct Prisma commands (from service directory)
cd apps/backend/product-service
npx prisma migrate dev --name <migration-name>
npx prisma generate
npx prisma studio
```

### Infrastructure

```bash
# Docker services (PostgreSQL, Redis, RabbitMQ)
pnpm docker:up
pnpm docker:down
pnpm docker:logs
```

### Dependencies

```bash
# Add to specific service
pnpm --filter auth-service add <package>
pnpm --filter product-service add <package>
pnpm --filter gateway add <package>
pnpm --filter frontend add <package>

# Add to shared packages
pnpm --filter @empora/common add <package>

# Add dev dependency to root
pnpm add -D -w <package>
```

### Code Quality

```bash
pnpm lint                  # Lint all code
pnpm format                # Format with Prettier
pnpm format --check        # Check formatting (CI)
```

## Architecture

### Microservices Pattern

This project uses a **Database-per-Service** pattern where each microservice:

- Has its own Prisma schema in `apps/backend/<service>/prisma/schema.prisma`
- Connects to PostgreSQL using separate schemas (not separate databases)
- Communicates via the API Gateway for HTTP or RabbitMQ for async events
- Is independently deployable and scalable

**Gateway Pattern**: All frontend requests go through the API Gateway (Port 3001), which proxies to backend microservices. Proxy controllers are in `apps/backend/gateway/src/proxy/`.

### Service Communication

- **Synchronous**: Frontend → API Gateway → Microservices (HTTP/REST)
- **Asynchronous**: Microservices ↔ RabbitMQ ↔ Microservices (Events)
- **Shared Code**: `@empora/common`, `@empora/config`, `@empora/database` packages

### Frontend Architecture

- **Next.js 16 App Router**: Server Components for data fetching, Client Components for interactivity
- **State Management**: Zustand for global state, TanStack Query for server state
- **UI Components**: Shadcn UI utilities (class-variance-authority, clsx, tailwind-merge)
- **Forms**: React Hook Form + Zod validation
- **Styling**: Tailwind CSS 4

### Backend Architecture

Each Nest.js microservice follows:

- **Module Structure**: Feature modules (e.g., ProductModule, CategoriesModule)
- **Prisma Integration**: PrismaModule provides database access
- **Controllers**: HTTP endpoints with validation decorators
- **Services**: Business logic layer
- **DTOs**: Data validation using class-validator and class-transformer

## Database Schemas

### Auth Service (Port 3002)

- **Users**: id, email, password (hashed), firstName, lastName, phone, role (CUSTOMER/ADMIN/VENDOR), isVerified, isActive, lastLoginAt
- **RefreshTokens**: id, userId, token, expiresAt

### Product Service (Port 3003)

- **Categories**: id, name, slug, description, image, parentId (hierarchical), children, products
- **Products**: id, name, slug, description, price, comparePrice, sku, stock, images[], categoryId, isActive, isFeatured

## Testing Strategy

### Unit Tests

- Jest for all backend services and frontend components
- Tests must pass with `--passWithNoTests` flag
- Coverage thresholds currently disabled in CI

### E2E Tests

- Playwright tests in `apps/frontend/e2e/`
- Tests run against full stack (frontend + gateway + microservices)
- Chromium browser in CI, configurable for local development
- Database seeding required before E2E tests (see `apps/backend/product-service/prisma/seed.ts`)

### CI Pipeline

The GitHub Actions workflow includes:

1. **Lint & Format Check**: ESLint + Prettier
2. **Backend Tests**: Jest tests for each service with PostgreSQL + Redis
3. **Frontend Tests**: Jest tests + coverage report (uploaded to Codecov)
4. **E2E Tests**: Full stack integration tests with Playwright
5. **Security Audit**: pnpm audit + TruffleHog secret scanning
6. **Build Check**: Ensures all services build successfully

## Service URLs

- Frontend: `http://localhost:3000`
- API Gateway: `http://localhost:3001/api`
- Auth Service: `http://localhost:3002`
- Product Service: `http://localhost:3003`
- Cart Service: `http://localhost:3004`
- Order Service: `http://localhost:3005`
- Notification Service: `http://localhost:3006`
- RabbitMQ Management: `http://localhost:15672` (user: ecommerce, pass: ecommerce123)

## Creating New Microservices

When adding a new microservice:

1. Create directory structure: `apps/backend/<service-name>/`
2. Add `package.json` with dependencies (`@nestjs/common`, `@nestjs/core`, `@prisma/client`, etc.)
3. Create `src/main.ts` (bootstrap), `src/<service>.module.ts` (root module)
4. Add Prisma schema: `prisma/schema.prisma` with appropriate datasource URL
5. Create health check controller: `src/health/health.controller.ts`
6. Add proxy controller in gateway: `apps/backend/gateway/src/proxy/<service>-proxy.controller.ts`
7. Update root `package.json` scripts for `dev:<service>`, `build:<service>`, `test:<service>`
8. Add CI/CD steps for the new service in `.github/workflows/ci.yml`

## Environment Variables

Each service requires its own `.env` file:

### Backend Services

```
DATABASE_URL=postgresql://user:password@localhost:5432/empora_db
REDIS_HOST=localhost
REDIS_PORT=6379
PORT=<service-port>
```

### Frontend

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### CI/CD

Tests use `postgresql://test:test@localhost:5432/empora_test`

## Key Files

- `pnpm-workspace.yaml`: Workspace configuration
- `docker-compose.yml`: PostgreSQL 16, Redis 7, RabbitMQ 3
- `docs/architecture.md`: Detailed system architecture
- `.github/workflows/ci.yml`: Complete CI/CD pipeline
- `apps/frontend/playwright.config.ts`: E2E test configuration

## Notes

- **Node Version**: Requires Node.js ≥20 (upgraded from 18 for Next.js compatibility)
- **Package Manager**: pnpm ≥8.0.0 (specified in `packageManager` field)
- **Monorepo**: Uses pnpm workspaces with `workspace:*` protocol for internal dependencies
- **Git Hooks**: Husky is configured (run `pnpm prepare` after clone)
- **Database**: All services share one PostgreSQL instance with separate schemas
- **Message Broker**: RabbitMQ integration planned but not yet implemented in all services
- use context7 and playwright MCPs
- use TDD when developing features
- develop one feature in both back and front end at a time to be able to try the whole flow locally
- run tests before commit
- review if any refinements or cleanups are needed
