# E-Commerce Platform

A modern, full-stack e-commerce platform built with Next.js 15 and Nest.js using a monorepo architecture.

## Tech Stack

### Frontend
- **Next.js 15** with App Router
- **TypeScript**
- **Tailwind CSS**
- **React 19**

### Backend
- **Nest.js 11**
- **Prisma ORM**
- **PostgreSQL**
- **Redis**
- **TypeScript**

## Project Structure

```
e-commerce/
├── apps/
│   ├── frontend/          # Next.js application
│   └── backend/           # Nest.js application
├── packages/              # Shared packages (future)
├── docker-compose.yml     # PostgreSQL and Redis
└── pnpm-workspace.yaml    # pnpm workspace configuration
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
pnpm db:migrate
```

6. Start development servers
```bash
# Start both frontend and backend
pnpm dev

# Or start individually
pnpm dev:frontend
pnpm dev:backend
```

The frontend will be available at `http://localhost:3000` and the backend API at `http://localhost:3001`.

## Available Scripts

### Root Level
- `pnpm dev` - Start both frontend and backend in development mode
- `pnpm dev:frontend` - Start only the frontend
- `pnpm dev:backend` - Start only the backend
- `pnpm build` - Build all applications
- `pnpm lint` - Lint all applications
- `pnpm format` - Format code with Prettier
- `pnpm docker:up` - Start Docker services
- `pnpm docker:down` - Stop Docker services
- `pnpm db:migrate` - Run Prisma migrations
- `pnpm db:studio` - Open Prisma Studio

## Database Schema

The application includes a comprehensive e-commerce schema with:
- Users and authentication
- Products and categories
- Shopping cart
- Orders and order items
- Addresses
- Reviews

## Development

### Adding Dependencies

```bash
# Add to frontend
pnpm --filter frontend add <package>

# Add to backend
pnpm --filter backend add <package>

# Add to root (dev dependencies)
pnpm add -D -w <package>
```

### Database Changes

```bash
# Create a new migration
cd apps/backend
npx prisma migrate dev --name <migration-name>

# View database in Prisma Studio
pnpm db:studio
```

## Docker Services

The `docker-compose.yml` includes:
- **PostgreSQL 16** - Main database (port 5432)
- **Redis 7** - Caching and sessions (port 6379)

## License

UNLICENSED
