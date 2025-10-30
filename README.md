# Empora

A modern, full-stack e-commerce platform built with Next.js 15 and Nest.js using a **microservices architecture**, monorepo setup, and Test-Driven Development (TDD).

## Tech Stack

### Frontend

- **Next.js 15** with App Router
- **TypeScript**
- **Tailwind CSS 4**
- **React 19**

### Backend (Microservices)

- **Nest.js 11** - Microservices framework
- **Prisma ORM** - Database per service
- **PostgreSQL 16** - Main database
- **Redis 7** - Caching and sessions
- **RabbitMQ 3** - Message broker for async communication
- **TypeScript**

### Architecture

- **API Gateway** - HTTP reverse proxy, request routing
- **Microservices** - Independent, scalable services
- **Database per Service** - Using PostgreSQL schemas
- **Event-Driven** - RabbitMQ for async events

## Project Structure

```
empora/
├── apps/
│   ├── frontend/                    # Next.js application (Port 3000)
│   └── backend/
│       ├── gateway/                 # API Gateway (Port 3001)
│       ├── auth-service/            # Authentication & Users (Port 3002)
│       ├── product-service/         # Products & Categories (Port 3003)
│       ├── cart-service/            # Shopping Cart (Port 3004)
│       ├── order-service/           # Orders & Payments (Port 3005)
│       └── notification-service/    # Emails & Notifications (Port 3006)
├── packages/
│   ├── common/                      # Shared utilities, DTOs, interfaces
│   ├── config/                      # Configuration utilities
│   └── database/                    # Database abstractions
├── docs/                            # Project documentation
├── scripts/                         # Development scripts
├── docker-compose.yml               # Infrastructure services
└── pnpm-workspace.yaml              # pnpm workspace configuration
```

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 8
- Docker and Docker Compose

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd e-commerce
```

2. Install dependencies

```bash
pnpm install
```

3. Start Docker services (PostgreSQL and Redis)

```bash
pnpm docker:up
```

4. Set up environment variables

```bash
# Backend
cp apps/backend/.env.example apps/backend/.env

# Frontend
cp apps/frontend/.env.example apps/frontend/.env.local
```

5. Run database migrations

```bash
# Auth service
pnpm db:migrate:auth

# Product service
pnpm db:migrate:product
```

6. Start development servers

```bash
# Quick start (Windows)
.\scripts\dev.bat

# Quick start (Linux/Mac)
./scripts/dev.sh

# Or start services individually:
pnpm dev:gateway          # API Gateway (Port 3001)
pnpm dev:auth             # Auth Service (Port 3002)
pnpm dev:product          # Product Service (Port 3003)
pnpm dev:frontend         # Frontend (Port 3000)
```

**Service URLs:**

- Frontend: `http://localhost:3000`
- API Gateway: `http://localhost:3001/api`
- Auth Service: `http://localhost:3002`
- Product Service: `http://localhost:3003`
- RabbitMQ Management: `http://localhost:15672` (user: ecommerce, pass: ecommerce123)

## Available Scripts

### Development

- `pnpm dev:gateway` - Start API Gateway
- `pnpm dev:auth` - Start Auth Service
- `pnpm dev:product` - Start Product Service
- `pnpm dev:cart` - Start Cart Service
- `pnpm dev:order` - Start Order Service
- `pnpm dev:notification` - Start Notification Service
- `pnpm dev:frontend` - Start Frontend

### Build

- `pnpm build` - Build all services
- `pnpm build:gateway` - Build API Gateway
- `pnpm build:auth` - Build Auth Service
- `pnpm build:product` - Build Product Service
- `pnpm build:packages` - Build shared packages

### Testing

- `pnpm test` - Run all tests
- `pnpm test:auth` - Test Auth Service
- `pnpm test:product` - Test Product Service
- `pnpm test:e2e` - Run E2E tests

### Database

- `pnpm db:migrate:auth` - Run Auth Service migrations
- `pnpm db:migrate:product` - Run Product Service migrations
- `pnpm db:generate:auth` - Generate Auth Service Prisma client
- `pnpm db:generate:product` - Generate Product Service Prisma client
- `pnpm db:studio:auth` - Open Prisma Studio for Auth Service
- `pnpm db:studio:product` - Open Prisma Studio for Product Service

### Docker

- `pnpm docker:up` - Start Docker services
- `pnpm docker:down` - Stop Docker services
- `pnpm docker:logs` - View Docker logs

### Code Quality

- `pnpm lint` - Lint all code
- `pnpm format` - Format code with Prettier

## Microservices

### API Gateway (Port 3001)

HTTP reverse proxy that routes requests to appropriate microservices.

- Health check aggregation
- Request/response logging
- CORS configuration
- Global validation

### Auth Service (Port 3002)

Handles authentication and user management.
**Database Schema:** Users, RefreshTokens

- JWT authentication (login, register, refresh)
- Password hashing
- Role-based access control
- Email verification (planned)

### Product Service (Port 3003)

Manages products and categories.
**Database Schema:** Products, Categories

- Product CRUD operations
- Hierarchical categories
- SKU and inventory tracking
- Product search and filtering (planned)

### Cart Service (Port 3004)

Shopping cart functionality.
**Database Schema:** Carts, CartItems (planned)

- Add/remove/update cart items
- Cart persistence
- Stock validation

### Order Service (Port 3005)

Order processing and payments.
**Database Schema:** Orders, OrderItems (planned)

- Order creation
- Payment integration
- Order status management
- Invoice generation

### Notification Service (Port 3006)

Multi-channel notifications.

- Email notifications
- SMS notifications (planned)
- In-app notifications (planned)

## Development

### Adding Dependencies

```bash
# Add to a specific service
pnpm --filter auth-service add <package>
pnpm --filter product-service add <package>
pnpm --filter gateway add <package>

# Add to frontend
pnpm --filter frontend add <package>

# Add to shared packages
pnpm --filter @empora/common add <package>

# Add to root (dev dependencies)
pnpm add -D -w <package>
```

### Database Changes

```bash
# Auth Service
cd apps/backend/auth-service
npx prisma migrate dev --name <migration-name>
npx prisma generate

# Product Service
cd apps/backend/product-service
npx prisma migrate dev --name <migration-name>
npx prisma generate

# View database in Prisma Studio
pnpm db:studio:auth
pnpm db:studio:product
```

### Creating a New Microservice

1. Create service directory in `apps/backend/<service-name>/`
2. Add `package.json` with service dependencies
3. Create `src/` directory with main.ts and module file
4. Add Prisma schema in `prisma/schema.prisma`
5. Add `.env` file with service configuration
6. Add health check controller
7. Register in workspace and update root scripts

## Docker Services

The `docker-compose.yml` includes:

- **PostgreSQL 16** - Main database with schemas per service (port 5432)
- **Redis 7** - Caching and sessions (port 6379)
- **RabbitMQ 3** - Message broker with management UI (ports 5672, 15672)

## Shared Packages

### @empora/common

Shared utilities, DTOs, interfaces, decorators, and constants used across all services.

### @empora/config

Configuration management utilities and interfaces.

### @empora/database

Database abstractions and Prisma utilities.

## License

UNLICENSED
