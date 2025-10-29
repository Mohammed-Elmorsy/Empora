# Development Workflow

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Docker Desktop
- Git

### Initial Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd e-commerce
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Start Docker services**:
   ```bash
   pnpm docker:up
   ```

4. **Set up environment variables**:
   ```bash
   # Backend
   cp apps/backend/.env.example apps/backend/.env

   # Frontend
   cp apps/frontend/.env.example apps/frontend/.env.local
   ```

5. **Run database migrations**:
   ```bash
   pnpm db:migrate
   ```

6. **Start development servers**:
   ```bash
   pnpm dev
   ```

   The application will be available at:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## Development Workflow

### Feature Development (TDD Approach)

#### 1. Create Feature Branch

```bash
git checkout -b feature/user-authentication
```

#### 2. Write Tests First (RED)

Before writing any implementation code:

```typescript
// apps/backend/src/auth/auth.service.spec.ts
describe('AuthService', () => {
  describe('register', () => {
    it('should create a new user with hashed password', async () => {
      // Test implementation
    });

    it('should throw error if email already exists', async () => {
      // Test implementation
    });
  });
});
```

Run tests (they should fail):
```bash
pnpm --filter backend test
```

#### 3. Implement Feature (GREEN)

Write minimum code to make tests pass:

```typescript
// apps/backend/src/auth/auth.service.ts
@Injectable()
export class AuthService {
  async register(dto: RegisterDto) {
    // Implementation
  }
}
```

Run tests again (they should pass):
```bash
pnpm --filter backend test
```

#### 4. Refactor (REFACTOR)

Improve code quality while keeping tests green:
- Extract reusable logic
- Improve naming
- Optimize performance
- Add documentation

#### 5. Check Coverage

```bash
pnpm --filter backend test:cov
```

Ensure coverage is ≥ 80% before proceeding.

#### 6. Add E2E Tests

For critical user flows:

```typescript
// e2e/auth.spec.ts
test('user can register and login', async ({ page }) => {
  await page.goto('/register');
  // Test implementation
});
```

Run E2E tests:
```bash
pnpm test:e2e
```

#### 7. Update Documentation

Update relevant docs if API or behavior changes:
- `docs/api.md` - API endpoints
- `docs/architecture.md` - Architecture changes
- `README.md` - User-facing changes

#### 8. Commit Changes

Use conventional commit format:

```bash
git add .
git commit -m "feat(auth): implement user registration

- Add user registration endpoint
- Hash passwords with bcrypt
- Validate email uniqueness
- Add comprehensive tests (85% coverage)

Closes #123"
```

Commit prefixes:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only
- `test:` - Adding/updating tests
- `refactor:` - Code refactoring
- `style:` - Formatting changes
- `perf:` - Performance improvements
- `chore:` - Maintenance tasks

#### 9. Push and Create PR

```bash
git push origin feature/user-authentication
```

Create Pull Request on GitHub with:
- Clear description
- Link to issue
- Screenshots (if UI changes)
- Test coverage report

### Code Review Process

**Before Requesting Review**:
- ✅ All tests pass locally
- ✅ Coverage ≥ 80%
- ✅ No linting errors
- ✅ Documentation updated
- ✅ Commits follow convention

**Review Checklist**:
- Code quality and readability
- Test coverage and quality
- Performance implications
- Security considerations
- Documentation completeness

**After Approval**:
- Squash and merge to main
- Delete feature branch
- Close related issues

## Project Structure

### Monorepo Layout

```
e-commerce/
├── apps/
│   ├── frontend/          # Next.js application
│   │   ├── src/
│   │   │   ├── app/      # App Router pages
│   │   │   ├── components/ # React components
│   │   │   ├── lib/      # Utilities
│   │   │   └── types/    # TypeScript types
│   │   └── public/       # Static assets
│   │
│   └── backend/          # Nest.js application
│       ├── src/
│       │   ├── auth/     # Auth module
│       │   ├── users/    # Users module
│       │   ├── products/ # Products module
│       │   ├── orders/   # Orders module
│       │   └── common/   # Shared code
│       ├── test/         # E2E tests
│       └── prisma/       # Database schema
│
├── packages/             # Shared packages (future)
├── e2e/                 # Playwright tests
├── docs/                # Documentation
└── .github/             # GitHub workflows
```

## Available Scripts

### Root Level

```bash
# Development
pnpm dev                 # Start all apps
pnpm dev:frontend        # Start frontend only
pnpm dev:backend         # Start backend only

# Build
pnpm build              # Build all apps
pnpm build:frontend     # Build frontend
pnpm build:backend      # Build backend

# Testing
pnpm test               # Run all tests
pnpm test:e2e           # Run E2E tests
pnpm test:cov           # Generate coverage report

# Code Quality
pnpm lint               # Lint all code
pnpm format             # Format with Prettier

# Database
pnpm docker:up          # Start Docker services
pnpm docker:down        # Stop Docker services
pnpm db:migrate         # Run Prisma migrations
pnpm db:studio          # Open Prisma Studio
```

### Backend Specific

```bash
cd apps/backend

# Development
pnpm dev                # Start with watch mode
pnpm start:debug        # Start with debugger

# Testing
pnpm test               # Unit tests
pnpm test:watch         # Watch mode
pnpm test:e2e           # Integration tests
pnpm test:cov           # Coverage report

# Database
pnpm prisma:generate    # Generate Prisma client
pnpm prisma:migrate     # Create migration
pnpm prisma:studio      # Open Prisma Studio
```

### Frontend Specific

```bash
cd apps/frontend

# Development
pnpm dev                # Start dev server
pnpm build              # Build for production
pnpm start              # Start production server

# Testing
pnpm test               # Unit tests
pnpm test:watch         # Watch mode
```

## Debugging

### Backend (VS Code)

Add to `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "runtimeExecutable": "pnpm",
      "runtimeArgs": ["--filter", "backend", "start:debug"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### Frontend (Next.js)

```bash
# Enable debug mode
NODE_OPTIONS='--inspect' pnpm dev:frontend
```

Then attach debugger in Chrome DevTools at `chrome://inspect`

## Common Tasks

### Adding a New Feature

1. Create feature branch
2. Write tests first (TDD)
3. Implement feature
4. Ensure 80%+ coverage
5. Add E2E tests for critical flows
6. Update documentation
7. Create PR

### Adding a New Package Dependency

```bash
# Add to specific app
pnpm --filter backend add @nestjs/jwt
pnpm --filter frontend add zustand

# Add dev dependency to workspace
pnpm add -D -w @types/node
```

### Creating Database Migration

```bash
# After modifying schema.prisma
cd apps/backend
npx prisma migrate dev --name add_user_roles
```

### Updating Environment Variables

1. Update `.env.example` with new variable
2. Update local `.env` file
3. Update documentation in `docs/`
4. Update CI/CD secrets if needed

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000

# Kill process on port 3001
npx kill-port 3001
```

### Database Connection Issues

```bash
# Restart Docker services
pnpm docker:down
pnpm docker:up

# Check Docker status
docker ps

# View logs
docker logs ecommerce-postgres
```

### Prisma Client Out of Sync

```bash
cd apps/backend
npx prisma generate
```

### Node Modules Issues

```bash
# Clean install
rm -rf node_modules apps/*/node_modules
pnpm install
```

## Performance Optimization

### Development Build Speed

1. Use pnpm's parallel execution
2. Selective app development (dev:frontend or dev:backend)
3. Enable Next.js Turbopack (experimental)

### Hot Reload

- Frontend: Automatic with Next.js
- Backend: Automatic with Nest.js watch mode

## Code Quality Tools

### Pre-commit Hooks (Husky)

Automatically run before each commit:
- Lint staged files
- Run tests for changed files
- Format code

### VS Code Extensions

Recommended extensions:
- ESLint
- Prettier
- Prisma
- GitLens
- Thunder Client (API testing)

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Nest.js Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Playwright Documentation](https://playwright.dev)
- [pnpm Documentation](https://pnpm.io)
