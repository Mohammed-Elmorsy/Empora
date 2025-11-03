# System Architecture

## Overview

This e-commerce platform follows a modern monorepo architecture with separate frontend and backend applications.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          Next.js 16 Frontend (Port 3000)             │  │
│  │                                                       │  │
│  │  - React 19 with TypeScript                          │  │
│  │  - Tailwind CSS 4 for styling                        │  │
│  │  - Server Components & Client Components             │  │
│  │  - TanStack Query for data fetching                  │  │
│  │  - Zustand for state management                      │  │
│  │  - Shadcn UI utilities                               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                         API Layer                            │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Nest.js 11 Backend (Port 3001)               │  │
│  │                                                       │  │
│  │  - RESTful API endpoints                             │  │
│  │  - Authentication & Authorization                     │  │
│  │  - Business Logic Layer                              │  │
│  │  - Data Validation (class-validator)                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
│                                                              │
│  ┌─────────────────┐    ┌──────────────────┐              │
│  │   PostgreSQL    │    │      Redis       │              │
│  │                 │    │                  │              │
│  │  - User Data    │    │  - Sessions      │              │
│  │  - Products     │    │  - Cache         │              │
│  │  - Orders       │    │  - Rate Limiting │              │
│  │  - Reviews      │    └──────────────────┘              │
│  └─────────────────┘                                       │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Shadcn UI utilities (class-variance-authority, clsx, tailwind-merge)
- **State Management**: Zustand with persist middleware
- **Data Fetching**: TanStack Query (React Query) with DevTools
- **Forms**: React Hook Form + Zod

### Backend

- **Framework**: Nest.js 11
- **Language**: TypeScript
- **ORM**: Prisma
- **Validation**: class-validator + class-transformer
- **Authentication**: JWT + Passport (planned)

### Database

- **Primary DB**: PostgreSQL 16
- **Caching**: Redis 7
- **ORM**: Prisma

### Infrastructure

- **Container**: Docker & Docker Compose
- **Package Manager**: pnpm
- **Monorepo**: pnpm workspaces
- **CI/CD**: GitHub Actions
- **Testing**: Jest, Playwright

## Design Patterns

### Backend

- **Repository Pattern**: Data access abstraction through Prisma
- **Service Layer**: Business logic separated from controllers
- **DTO Pattern**: Data Transfer Objects for validation
- **Dependency Injection**: Native Nest.js DI container

### Frontend

- **Component Composition**: Reusable UI components
- **Server Components**: For data fetching and SEO
- **Client Components**: For interactivity
- **Layout System**: Shared layouts using Next.js App Router

## Security

- **Authentication**: JWT tokens with refresh token rotation
- **Authorization**: Role-based access control (RBAC)
- **Data Validation**: Input validation on both frontend and backend
- **SQL Injection Prevention**: Parameterized queries via Prisma
- **XSS Protection**: Content Security Policy headers
- **CORS**: Configured for frontend-backend communication

## Scalability Considerations

- **Horizontal Scaling**: Stateless backend services
- **Caching Strategy**: Redis for session and data caching
- **Database Optimization**: Indexed queries, connection pooling
- **CDN**: Static assets served via CDN (future)
- **Load Balancing**: Ready for load balancer integration
