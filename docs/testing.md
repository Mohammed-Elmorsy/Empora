# Testing Strategy

## Overview

This project follows Test-Driven Development (TDD) with comprehensive test coverage across all layers.

**Coverage Target**: 80%+

## Testing Pyramid

```
        /\
       /  \
      / E2E \          ← Playwright (Critical User Flows)
     /______\
    /        \
   / Integration \     ← API Tests, Database Tests
  /______________\
 /                \
/   Unit Tests     \   ← Services, Components, Utils
____________________
```

## Test Types

### 1. Unit Tests

**Purpose**: Test individual functions, methods, and components in isolation.

**Tools**:
- Jest (test runner)
- React Testing Library (frontend components)
- @nestjs/testing (backend services)

**Location**:
- Backend: `*.spec.ts` files next to source
- Frontend: `*.test.tsx` files next to components

**Example - Backend Unit Test**:
```typescript
// user.service.spec.ts
describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a user', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'hashedPassword',
    };

    jest.spyOn(prisma.user, 'create').mockResolvedValue({
      id: '1',
      ...userData,
    } as any);

    const result = await service.create(userData);
    expect(result.email).toBe(userData.email);
  });
});
```

**Example - Frontend Unit Test**:
```typescript
// ProductCard.test.tsx
import { render, screen } from '@testing-library/react';
import { ProductCard } from './ProductCard';

describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    price: 29.99,
    image: '/test.jpg',
  };

  it('should render product information', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
  });

  it('should call onAddToCart when button clicked', async () => {
    const onAddToCart = jest.fn();
    render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />);

    const button = screen.getByRole('button', { name: /add to cart/i });
    await userEvent.click(button);

    expect(onAddToCart).toHaveBeenCalledWith(mockProduct.id);
  });
});
```

### 2. Integration Tests

**Purpose**: Test interaction between multiple components/modules.

**Tools**:
- Supertest (API testing)
- Test database (PostgreSQL with Docker)

**Location**: `test/` folder in backend

**Example - API Integration Test**:
```typescript
// products.e2e-spec.ts
describe('Products API (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('GET /api/v1/products', () => {
    it('should return all products', () => {
      return request(app.getHttpServer())
        .get('/api/v1/products')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should filter products by category', () => {
      return request(app.getHttpServer())
        .get('/api/v1/products?category=electronics')
        .expect(200)
        .expect((res) => {
          expect(res.body.every(p => p.category === 'electronics')).toBe(true);
        });
    });
  });
});
```

### 3. E2E Tests (Playwright)

**Purpose**: Test complete user flows from browser perspective.

**Tools**: Playwright

**Location**: `e2e/` folder at root

**Critical User Flows**:
1. User Registration & Login
2. Product Search & Browse
3. Add to Cart
4. Checkout Process
5. Order Management

**Example - E2E Test**:
```typescript
// checkout.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();
  });

  test('should complete checkout successfully', async ({ page }) => {
    // Add product to cart
    await page.goto('/products/test-product-slug');
    await page.getByRole('button', { name: 'Add to Cart' }).click();

    // Go to cart
    await page.getByRole('link', { name: 'Cart' }).click();
    await expect(page.getByText('1 item')).toBeVisible();

    // Proceed to checkout
    await page.getByRole('button', { name: 'Checkout' }).click();

    // Fill shipping info
    await page.getByLabel('Address').fill('123 Main St');
    await page.getByLabel('City').fill('New York');
    await page.getByLabel('Postal Code').fill('10001');

    // Submit order
    await page.getByRole('button', { name: 'Place Order' }).click();

    // Verify success
    await expect(page.getByText('Order Confirmed')).toBeVisible();
  });
});
```

## TDD Workflow

### Red-Green-Refactor Cycle

```
1. RED: Write a failing test
   ↓
2. GREEN: Write minimum code to pass
   ↓
3. REFACTOR: Improve code quality
   ↓
4. Repeat
```

### Development Process

1. **Before writing any code**:
   ```bash
   # Create test file
   touch src/features/user/user.service.spec.ts

   # Write failing test
   describe('UserService', () => {
     it('should create user', () => {
       // Test implementation
     });
   });
   ```

2. **Run tests** (should fail):
   ```bash
   pnpm test
   ```

3. **Implement feature** (make test pass):
   ```typescript
   // user.service.ts
   async create(userData) {
     return await this.prisma.user.create({ data: userData });
   }
   ```

4. **Run tests again** (should pass):
   ```bash
   pnpm test
   ```

5. **Refactor** if needed while keeping tests green

6. **Check coverage**:
   ```bash
   pnpm test:cov
   ```

## Running Tests

### Backend Tests

```bash
# Unit tests
pnpm --filter backend test

# Watch mode
pnpm --filter backend test:watch

# Coverage
pnpm --filter backend test:cov

# E2E tests
pnpm --filter backend test:e2e
```

### Frontend Tests

```bash
# Unit tests
pnpm --filter frontend test

# Watch mode
pnpm --filter frontend test:watch

# Coverage
pnpm --filter frontend test:cov
```

### E2E Tests (Playwright)

```bash
# Run all E2E tests
pnpm test:e2e

# Run in headed mode (see browser)
pnpm test:e2e --headed

# Run specific test
pnpm test:e2e checkout.spec.ts

# Debug mode
pnpm test:e2e --debug
```

## CI/CD Integration

Tests run automatically on:
- Every pull request
- Every push to main branch
- Before deployment

**PR Requirements**:
- ✅ All tests must pass
- ✅ Coverage must be ≥ 80%
- ✅ No linting errors

## Test Data Management

### Test Database

```bash
# Start test database
docker-compose -f docker-compose.test.yml up -d

# Run migrations
DATABASE_URL="postgresql://test:test@localhost:5433/test_db" npx prisma migrate deploy

# Seed test data
pnpm --filter backend test:seed
```

### Fixtures

Store reusable test data in `test/fixtures/`:
```typescript
// test/fixtures/users.ts
export const testUsers = {
  admin: {
    email: 'admin@test.com',
    password: 'hashedPassword',
    role: 'ADMIN',
  },
  customer: {
    email: 'customer@test.com',
    password: 'hashedPassword',
    role: 'CUSTOMER',
  },
};
```

## Mocking

### External Services

```typescript
// Mock payment provider
jest.mock('@/lib/stripe', () => ({
  createPaymentIntent: jest.fn().mockResolvedValue({
    id: 'pi_test123',
    status: 'succeeded',
  }),
}));
```

### Database

```typescript
// Mock Prisma
const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};
```

## Best Practices

1. **Test Behavior, Not Implementation**: Focus on what the code does, not how
2. **Arrange-Act-Assert**: Structure tests clearly
3. **One Assertion Per Test**: Keep tests focused
4. **Descriptive Names**: Use clear, descriptive test names
5. **Independent Tests**: Tests should not depend on each other
6. **Fast Tests**: Keep unit tests fast (< 1s each)
7. **Clean Up**: Always clean up resources in `afterEach`/`afterAll`
8. **Mock External Dependencies**: Don't hit real APIs/databases in unit tests

## Coverage Reports

View coverage reports at:
- Backend: `apps/backend/coverage/lcov-report/index.html`
- Frontend: `apps/frontend/coverage/lcov-report/index.html`

## Context7 Integration

Context7 (Upstash) will be used for:
- Managing semantic context across tests
- Storing test execution context
- Tracking test dependencies
- Optimizing test runs

Configuration coming in Phase 2.
