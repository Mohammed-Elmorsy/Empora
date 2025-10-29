/**
 * Test Helper Utilities
 * Reusable functions and utilities for testing
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';

/**
 * Create a test application instance with common configuration
 */

export async function createTestApp(module: any): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [module],
  }).compile();

  const app = moduleFixture.createNestApplication();

  // Apply global pipes (same as production)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.init();
  return app;
}

/**
 * Generate mock user data for testing
 */

export function createMockUser(overrides?: Partial<any>) {
  return {
    id: 'test-user-id',
    email: 'test@example.com',
    role: 'CUSTOMER',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

/**
 * Generate mock product data for testing
 */

export function createMockProduct(overrides?: Partial<any>) {
  return {
    id: 'test-product-id',
    name: 'Test Product',
    slug: 'test-product',
    description: 'Test product description',
    price: 99.99,
    stock: 10,
    categoryId: 'test-category-id',
    images: ['image1.jpg'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

/**
 * Sleep utility for testing async operations
 */
export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
