# Empora API Documentation

## Base URL

- Development: `http://localhost:3001/api/v1`
- Production: `https://api.empora.com/api/v1`

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Response Format

### Success Response

```json
{
  "data": {
    // Response data
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "requestId": "req_123"
  }
}
```

### Error Response

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "requestId": "req_123"
  }
}
```

## Endpoints

### Authentication

#### Register User

```http
POST /auth/register
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response** (201):
```json
{
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "CUSTOMER"
    },
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc...",
      "expiresIn": 3600
    }
  }
}
```

#### Login

```http
POST /auth/login
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response** (200):
```json
{
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "role": "CUSTOMER"
    },
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc...",
      "expiresIn": 3600
    }
  }
}
```

#### Refresh Token

```http
POST /auth/refresh
```

**Request Body**:
```json
{
  "refreshToken": "eyJhbGc..."
}
```

### Users

#### Get Current User

```http
GET /users/me
```

**Headers**: `Authorization: Bearer <token>`

**Response** (200):
```json
{
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "role": "CUSTOMER",
    "isVerified": true
  }
}
```

#### Update User Profile

```http
PATCH /users/me
```

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "firstName": "Jane",
  "phone": "+1234567890"
}
```

### Products

#### List Products

```http
GET /products?page=1&limit=20&category=electronics&sort=price&order=asc
```

**Query Parameters**:
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 20, max: 100)
- `category` (string, optional): Filter by category slug
- `search` (string, optional): Search term
- `minPrice` (number, optional): Minimum price
- `maxPrice` (number, optional): Maximum price
- `sort` (string, optional): Sort field (price, name, createdAt)
- `order` (string, optional): Sort order (asc, desc)

**Response** (200):
```json
{
  "data": {
    "products": [
      {
        "id": "prod_123",
        "name": "Wireless Headphones",
        "slug": "wireless-headphones",
        "description": "High-quality wireless headphones",
        "price": 99.99,
        "comparePrice": 129.99,
        "images": [
          "https://cdn.empora.com/products/img1.jpg"
        ],
        "category": {
          "id": "cat_123",
          "name": "Electronics",
          "slug": "electronics"
        },
        "stock": 50,
        "isActive": true,
        "isFeatured": true
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

#### Get Product by Slug

```http
GET /products/:slug
```

**Response** (200):
```json
{
  "data": {
    "id": "prod_123",
    "name": "Wireless Headphones",
    "slug": "wireless-headphones",
    "description": "High-quality wireless headphones with noise cancellation...",
    "price": 99.99,
    "comparePrice": 129.99,
    "sku": "WH-1000XM4",
    "images": [
      "https://cdn.empora.com/products/img1.jpg",
      "https://cdn.empora.com/products/img2.jpg"
    ],
    "category": {
      "id": "cat_123",
      "name": "Electronics",
      "slug": "electronics"
    },
    "stock": 50,
    "reviews": {
      "average": 4.5,
      "count": 128
    }
  }
}
```

### Categories

#### List Categories

```http
GET /categories
```

**Response** (200):
```json
{
  "data": [
    {
      "id": "cat_123",
      "name": "Electronics",
      "slug": "electronics",
      "image": "https://cdn.empora.com/categories/electronics.jpg",
      "children": [
        {
          "id": "cat_456",
          "name": "Headphones",
          "slug": "headphones"
        }
      ]
    }
  ]
}
```

### Cart

#### Get Cart

```http
GET /cart
```

**Headers**: `Authorization: Bearer <token>`

**Response** (200):
```json
{
  "data": {
    "id": "cart_123",
    "items": [
      {
        "id": "item_123",
        "product": {
          "id": "prod_123",
          "name": "Wireless Headphones",
          "price": 99.99,
          "image": "https://cdn.empora.com/products/img1.jpg"
        },
        "quantity": 2
      }
    ],
    "subtotal": 199.98,
    "tax": 16.00,
    "total": 215.98
  }
}
```

#### Add to Cart

```http
POST /cart/items
```

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "productId": "prod_123",
  "quantity": 1
}
```

**Response** (201):
```json
{
  "data": {
    "id": "item_123",
    "product": {
      "id": "prod_123",
      "name": "Wireless Headphones",
      "price": 99.99
    },
    "quantity": 1
  }
}
```

#### Update Cart Item

```http
PATCH /cart/items/:itemId
```

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "quantity": 3
}
```

#### Remove from Cart

```http
DELETE /cart/items/:itemId
```

**Headers**: `Authorization: Bearer <token>`

**Response** (204): No content

### Orders

#### Create Order

```http
POST /orders
```

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "shippingAddressId": "addr_123",
  "paymentMethod": "stripe"
}
```

**Response** (201):
```json
{
  "data": {
    "id": "order_123",
    "orderNumber": "ORD-2024-001",
    "status": "PENDING",
    "paymentStatus": "PENDING",
    "items": [
      {
        "product": {
          "name": "Wireless Headphones"
        },
        "quantity": 2,
        "price": 99.99,
        "total": 199.98
      }
    ],
    "subtotal": 199.98,
    "tax": 16.00,
    "shipping": 5.00,
    "total": 220.98,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### List Orders

```http
GET /orders?page=1&limit=10
```

**Headers**: `Authorization: Bearer <token>`

**Response** (200):
```json
{
  "data": {
    "orders": [
      {
        "id": "order_123",
        "orderNumber": "ORD-2024-001",
        "status": "DELIVERED",
        "total": 220.98,
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

#### Get Order Details

```http
GET /orders/:orderId
```

**Headers**: `Authorization: Bearer <token>`

**Response** (200):
```json
{
  "data": {
    "id": "order_123",
    "orderNumber": "ORD-2024-001",
    "status": "DELIVERED",
    "paymentStatus": "PAID",
    "items": [
      {
        "product": {
          "name": "Wireless Headphones",
          "image": "https://cdn.empora.com/products/img1.jpg"
        },
        "quantity": 2,
        "price": 99.99,
        "total": 199.98
      }
    ],
    "shippingAddress": {
      "address1": "123 Main St",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "USA"
    },
    "subtotal": 199.98,
    "tax": 16.00,
    "shipping": 5.00,
    "total": 220.98,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-05T00:00:00Z"
  }
}
```

### Reviews

#### Create Review

```http
POST /products/:productId/reviews
```

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "rating": 5,
  "title": "Excellent product!",
  "comment": "These headphones are amazing. Great sound quality!"
}
```

**Response** (201):
```json
{
  "data": {
    "id": "review_123",
    "rating": 5,
    "title": "Excellent product!",
    "comment": "These headphones are amazing.",
    "user": {
      "firstName": "John",
      "lastName": "D."
    },
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `UNAUTHORIZED` | 401 | Missing or invalid authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

## Rate Limiting

- **Default**: 100 requests per 15 minutes per IP
- **Authenticated**: 1000 requests per 15 minutes per user
- **Exceeded**: Returns 429 with `Retry-After` header

## Webhooks (Future)

Subscribe to events:
- `order.created`
- `order.paid`
- `order.shipped`
- `order.delivered`

## Pagination

All list endpoints support pagination:

```
GET /products?page=2&limit=20
```

Response includes pagination meta:
```json
{
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrevious": true
  }
}
```

## Filtering & Searching

### Search

```
GET /products?search=wireless+headphones
```

### Filtering

```
GET /products?category=electronics&minPrice=50&maxPrice=200
```

### Sorting

```
GET /products?sort=price&order=desc
```

## SDK & Libraries

Coming soon:
- JavaScript/TypeScript SDK
- Python SDK
- OpenAPI/Swagger specification
