# Product Catalog Feature

**Status:** ✅ Completed
**Date:** November 1, 2025
**Development Approach:** Test-Driven Development (TDD)

## Overview

The Product Catalog feature enables users to browse products, view detailed product information, filter by categories, search, and navigate through paginated results. This feature was built using Test-Driven Development with comprehensive test coverage across the entire stack.

---

## Architecture

### Backend (Product Service)

**Technology Stack:**

- NestJS 11.1.8
- Prisma ORM 6.18.0
- PostgreSQL 16
- TypeScript
- Jest for testing

**Port:** 3003

**Database Schema:**

```prisma
model Product {
  id            String      @id @default(uuid())
  name          String
  slug          String      @unique
  description   String?
  price         Decimal     @db.Decimal(10, 2)
  comparePrice  Decimal?    @db.Decimal(10, 2)
  sku           String      @unique
  stock         Int         @default(0)
  images        String[]
  categoryId    String
  category      Category    @relation(fields: [categoryId], references: [id])
  isActive      Boolean     @default(true)
  isFeatured    Boolean     @default(false)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}

model Category {
  id          String      @id @default(uuid())
  name        String      @unique
  slug        String      @unique
  description String?
  image       String?
  parentId    String?
  parent      Category?   @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children    Category[]  @relation("CategoryHierarchy")
  products    Product[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}
```

### Frontend

**Technology Stack:**

- Next.js 16.0.1 (App Router)
- React 19.2.0
- TypeScript
- Tailwind CSS 4
- Jest + Testing Library for testing

**Port:** 3000

---

## API Endpoints

### Product Service (http://localhost:3003)

#### `GET /products`

List products with filtering, search, and pagination.

**Query Parameters:**

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10, max: 100)
- `categoryId` (UUID): Filter by category
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `search` (string): Search in name and description
- `isFeatured` (boolean): Filter featured products
- `sortBy` (enum): Sort field (createdAt, price, name)
- `sortOrder` (enum): Sort direction (asc, desc)

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Product Name",
      "slug": "product-name",
      "description": "Description",
      "price": "99.99",
      "comparePrice": "129.99",
      "sku": "SKU-001",
      "stock": 10,
      "images": ["url1", "url2"],
      "categoryId": "uuid",
      "category": {
        "id": "uuid",
        "name": "Category Name",
        "slug": "category-name",
        "image": "url"
      },
      "isActive": true,
      "isFeatured": false,
      "createdAt": "2025-11-01T00:00:00Z",
      "updatedAt": "2025-11-01T00:00:00Z"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

#### `GET /products/:id`

Get a single product by ID.

**Response:** Product object (see above)

#### `GET /products/slug/:slug`

Get a single product by slug.

**Response:** Product object (see above)

#### `POST /products`

Create a new product (Admin only - to be implemented).

#### `PATCH /products/:id`

Update a product (Admin only - to be implemented).

#### `DELETE /products/:id`

Delete a product (Admin only - to be implemented).

---

## Frontend Pages

### `/products` - Product Listing Page

- Grid layout with responsive columns (1/2/3/4 columns)
- Pagination controls
- Product count display
- Loading states with skeleton UI
- Server-side rendering for SEO

### `/products/[slug]` - Product Detail Page

- Large product image gallery
- Product information (name, description, price)
- Category breadcrumb navigation
- Stock status indicators
- Discount badges
- Featured badge
- "Add to Cart" button (placeholder for future cart feature)
- Continue Shopping link

---

## Components

### `ProductCard`

Displays product information in a compact card format.

**Props:**

- `product` (Product): Product data

**Features:**

- Product image with fallback
- Product name, price, and compare price
- Discount percentage calculation
- Category badge
- Featured badge
- Out of stock indicator
- Hover effects
- Keyboard accessible
- Links to product detail page

**Tests:** 14 passing tests

### `ProductList`

Grid container for displaying multiple products.

**Props:**

- `products` (Product[]): Array of products
- `isLoading` (boolean): Loading state

**Features:**

- Responsive grid layout
- Loading skeleton UI
- Empty state with helpful message
- Automatic layout adjustments

**Tests:** 10 passing tests

---

## Test Coverage

### Backend Tests (28 tests passing)

**ProductService** (20 tests):

- Pagination and filtering
- Search functionality
- Category filtering
- Price range filtering
- Featured product filtering
- CRUD operations
- Error handling
- Unique constraint validation

**ProductController** (8 tests):

- All endpoint handlers
- Parameter passing
- Response formatting

### Frontend Tests (33 tests passing)

**API Client** (9 tests):

- Product fetching with filters
- Single product retrieval
- Product by slug
- Error handling

**ProductCard** (14 tests):

- Rendering all product information
- Conditional rendering (badges, compare price)
- Image handling
- Discount calculation
- Keyboard accessibility

**ProductList** (10 tests):

- Multiple products rendering
- Empty state
- Loading state
- Skeleton UI

**Total Test Coverage:** 61 tests passing

---

## Seed Data

The database includes sample data:

- **6 Categories**: Electronics (Laptops, Smartphones), Clothing (Men's, Women's)
- **10 Products**: Various laptops, phones, and clothing items
- Real product images from Unsplash

To reseed the database:

```bash
cd apps/backend/product-service
npx ts-node prisma/seed.ts
```

---

## Running the Feature Locally

### 1. Start Docker Services

```bash
docker-compose up -d
```

### 2. Start Backend (Product Service)

```bash
cd apps/backend/product-service
pnpm dev
```

Service runs on: http://localhost:3003

### 3. Start Frontend

```bash
cd apps/frontend
pnpm dev
```

Frontend runs on: http://localhost:3000

### 4. Access the Application

- Products page: http://localhost:3000/products
- Product detail: http://localhost:3000/products/[slug]
- API endpoint: http://localhost:3003/products

---

## Testing

### Run Backend Tests

```bash
cd apps/backend/product-service
pnpm test
```

### Run Frontend Tests

```bash
cd apps/frontend
pnpm test
```

### Run All Tests

```bash
# From project root
pnpm test
```

---

## Future Enhancements

1. **Category Service**: Separate microservice for category management
2. **Advanced Filtering**: More filter options (brand, rating, color, size)
3. **Sort Options**: User-selectable sort options
4. **Product Reviews**: Rating and review system
5. **Related Products**: Show similar products on detail page
6. **Wishlist**: Save favorite products
7. **Product Variants**: Size, color variants
8. **Inventory Alerts**: Low stock notifications
9. **Image Gallery**: Interactive product image viewer
10. **SEO Optimization**: Dynamic meta tags and structured data

---

## Implementation Notes

### TDD Approach

This feature was built following strict Test-Driven Development:

1. **Red**: Write failing tests first
2. **Green**: Implement minimal code to pass tests
3. **Refactor**: Improve code quality while keeping tests green

### Design Decisions

**Backend:**

- Used Prisma for type-safe database access
- Implemented pagination to handle large product catalogs
- Created reusable DTOs with class-validator
- Separated concerns (Service → Controller → Module)

**Frontend:**

- Server Components for SEO and performance
- Client Components only where needed (future interactivity)
- Tailwind CSS for rapid, consistent styling
- Next.js Image optimization for product images
- Responsive design mobile-first approach

**Database:**

- UUID for product IDs (security, scalability)
- Decimal type for prices (accuracy)
- Slug for SEO-friendly URLs
- Hierarchical categories support

---

## Known Issues

None currently.

---

## Documentation Last Updated

November 1, 2025
