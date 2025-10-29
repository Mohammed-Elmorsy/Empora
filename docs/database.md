# Database Documentation

## Overview

The e-commerce platform uses PostgreSQL as the primary database with Prisma as the ORM.

## Schema Design

### Entity Relationship Diagram

```
User (1) ──────── (*) Order
 │                      │
 │                      └─── (*) OrderItem ─── (*) Product
 │                                                    │
 └── (1) Cart ─── (*) CartItem ─── (*)              │
 │                                                    │
 └── (*) Address                                     │
 │                                                    │
 └── (*) Review ────────────────────────────────────┘
                                                      │
                                                      │
                                    Category (1) ─── (*)
```

## Tables

### Users
Stores user account information including authentication and profile data.

```prisma
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  password      String
  firstName     String?
  lastName      String?
  phone         String?
  role          UserRole  @default(CUSTOMER)
  isVerified    Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

**Roles:**
- CUSTOMER: Regular users who can browse and purchase
- ADMIN: Full system access
- VENDOR: Can manage their products

### Products
Core product information and inventory.

```prisma
model Product {
  id          String   @id @default(uuid())
  name        String
  slug        String   @unique
  description String?
  price       Decimal  @db.Decimal(10, 2)
  comparePrice Decimal? @db.Decimal(10, 2)
  sku         String   @unique
  stock       Int      @default(0)
  images      String[]
  categoryId  String
  isActive    Boolean  @default(true)
  isFeatured  Boolean  @default(false)
}
```

### Categories
Hierarchical product categorization.

```prisma
model Category {
  id          String    @id @default(uuid())
  name        String    @unique
  slug        String    @unique
  description String?
  image       String?
  parentId    String?
  parent      Category? @relation("CategoryToCategory")
  children    Category[] @relation("CategoryToCategory")
}
```

### Orders
Customer orders and their status.

```prisma
model Order {
  id              String      @id @default(uuid())
  orderNumber     String      @unique
  userId          String
  status          OrderStatus @default(PENDING)
  paymentStatus   PaymentStatus @default(PENDING)
  paymentMethod   String?
  subtotal        Decimal     @db.Decimal(10, 2)
  tax             Decimal     @db.Decimal(10, 2)
  shipping        Decimal     @db.Decimal(10, 2)
  total           Decimal     @db.Decimal(10, 2)
}
```

**Order Status:**
- PENDING: Order created, awaiting payment
- PROCESSING: Payment confirmed, preparing order
- SHIPPED: Order shipped to customer
- DELIVERED: Order delivered successfully
- CANCELLED: Order cancelled
- REFUNDED: Order refunded

### Cart
Shopping cart management.

```prisma
model Cart {
  id        String     @id @default(uuid())
  userId    String     @unique
  items     CartItem[]
}

model CartItem {
  id        String   @id @default(uuid())
  cartId    String
  productId String
  quantity  Int      @default(1)
}
```

## Indexes

Key indexes for performance optimization:

```sql
-- User lookups
CREATE INDEX idx_users_email ON users(email);

-- Product queries
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_featured ON products(is_featured);

-- Order queries
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at);

-- Full-text search (future)
CREATE INDEX idx_products_search ON products USING gin(to_tsvector('english', name || ' ' || description));
```

## Migrations

### Running Migrations

```bash
# Create a new migration
pnpm db:migrate

# Apply migrations
cd apps/backend
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

### Migration Strategy

1. **Development**: Use `prisma migrate dev` for schema changes
2. **Production**: Use `prisma migrate deploy` in CI/CD pipeline
3. **Rollback**: Keep migration history, use version control

## Data Seeding

Seed data for development and testing:

```bash
pnpm --filter backend prisma:seed
```

## Backup Strategy

1. **Automated Backups**: Daily PostgreSQL dumps
2. **Point-in-Time Recovery**: WAL archiving enabled
3. **Replication**: Read replicas for scalability
4. **Retention**: 30 days of backups

## Performance Optimization

1. **Connection Pooling**: Prisma connection pool (max 10 connections)
2. **Query Optimization**: Use `select` to limit fields
3. **Eager Loading**: Use `include` judiciously
4. **Caching**: Redis for frequently accessed data
5. **Pagination**: Cursor-based pagination for large datasets

## Security

1. **Encryption**: All sensitive data encrypted at rest
2. **Access Control**: Row-level security (future)
3. **Audit Logging**: Track all data modifications
4. **SQL Injection**: Prevented by Prisma's query builder
