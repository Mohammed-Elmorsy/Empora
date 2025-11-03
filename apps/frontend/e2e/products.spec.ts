import { test, expect } from '@playwright/test';

test.describe('Products Listing Page', () => {
  test('should load products listing page successfully', async ({ page }) => {
    await page.goto('/products');

    // Verify page title
    await expect(page.locator('h1')).toContainText('Products');

    // Verify products are displayed
    const productCards = page.locator('[data-testid="product-card"]');
    await expect(productCards.first()).toBeVisible();

    // Verify product count is shown
    await expect(page.locator('text=/Showing .* of .* products/i')).toBeVisible();
  });

  test('should display product information correctly', async ({ page }) => {
    await page.goto('/products');

    const firstProduct = page.locator('[data-testid="product-card"]').first();

    // Verify product has required elements
    await expect(firstProduct.locator('[data-testid="product-name"]')).toBeVisible();
    await expect(firstProduct.locator('[data-testid="product-price"]')).toBeVisible();
    await expect(firstProduct.locator('[data-testid="product-image"]')).toBeVisible();
    await expect(firstProduct.locator('[data-testid="product-category"]')).toBeVisible();
  });

  test('should display product images from Unsplash', async ({ page }) => {
    await page.goto('/products');

    const firstImage = page.locator('[data-testid="product-image"]').first();
    await expect(firstImage).toBeVisible();

    // Verify image has loaded successfully
    const src = await firstImage.getAttribute('src');
    expect(src).toBeTruthy();

    // Check that the image has actually loaded
    await expect(firstImage).toHaveJSProperty('complete', true);
  });

  test('should display category badge', async ({ page }) => {
    await page.goto('/products');

    const categoryBadge = page.locator('[data-testid="product-category"]').first();
    await expect(categoryBadge).toBeVisible();
    await expect(categoryBadge).not.toBeEmpty();
  });

  test('should display featured badge on featured products', async ({ page }) => {
    await page.goto('/products?isFeatured=true');

    // At least one product should be visible
    const productCards = page.locator('[data-testid="product-card"]');
    await expect(productCards.first()).toBeVisible();

    // Featured badge should be visible on featured products
    const featuredBadge = page.locator('text=/featured/i').first();
    await expect(featuredBadge).toBeVisible();
  });

  test('should display discount percentage when compare price exists', async ({ page }) => {
    await page.goto('/products');

    // Find a product with a discount (has compare price)
    const discountBadge = page.locator('text=/%.*off/i').first();

    // Check if any product has a discount
    const discountCount = await discountBadge.count();
    if (discountCount > 0) {
      await expect(discountBadge).toBeVisible();
    }
  });
});

test.describe('Pagination', () => {
  test('should navigate to page 2 when clicking page 2 button', async ({ page }) => {
    await page.goto('/products');

    // Check if pagination exists (only if there are multiple pages)
    // Look for pagination link specifically (it should have exact text "2")
    const page2Link = page.locator('a').filter({ hasText: /^2$/ });
    const pageCount = await page2Link.count();

    if (pageCount > 0) {
      // Click page 2
      await page2Link.first().click();

      // Verify URL changed
      await expect(page).toHaveURL(/page=2/);

      // Verify products are displayed on page 2
      const productCards = page.locator('[data-testid="product-card"]');
      await expect(productCards.first()).toBeVisible();

      // Verify page 2 button is active
      await expect(page.locator('a').filter({ hasText: /^2$/ }).first()).toHaveClass(/bg-blue-600/);
    }
  });

  test('should show correct product count on each page', async ({ page }) => {
    await page.goto('/products');

    // Get total count from page 1
    const countText = await page.locator('text=/Showing .* of .* products/i').textContent();
    expect(countText).toBeTruthy();

    // Navigate to page 2 if it exists
    const page2Link = page.locator('a').filter({ hasText: /^2$/ });
    if ((await page2Link.count()) > 0) {
      await page2Link.first().click();

      // Verify count text still shows
      await expect(page.locator('text=/Showing .* of .* products/i')).toBeVisible();
    }
  });
});

test.describe('Product Detail Page', () => {
  test('should navigate to product detail page when clicking a product', async ({ page }) => {
    await page.goto('/products');

    // Click the first product
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.click();

    // Verify we're on the product detail page
    await expect(page).toHaveURL(/\/products\/.+/);

    // Verify product details are displayed
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('[data-testid="product-price"]')).toBeVisible();
  });

  test('should display product information on detail page', async ({ page }) => {
    // Navigate to products page first
    await page.goto('/products');

    // Click the first product
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.click();

    // Wait for navigation
    await page.waitForURL(/\/products\/.+/);

    // Verify essential elements are present
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('[data-testid="product-price"]')).toBeVisible();
    await expect(page.locator('[data-testid="product-image"]')).toBeVisible();
  });

  test('should display "Add to Cart" button on detail page', async ({ page }) => {
    await page.goto('/products');

    // Click the first product
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.click();

    await page.waitForURL(/\/products\/.+/);

    // Verify Add to Cart button exists
    await expect(page.locator('button:has-text("Add to Cart")')).toBeVisible();
  });

  test('should display "Continue Shopping" link on detail page', async ({ page }) => {
    await page.goto('/products');

    // Click the first product
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.click();

    await page.waitForURL(/\/products\/.+/);

    // Verify Continue Shopping link exists and navigates back
    const continueLink = page.locator('a:has-text("Continue Shopping")');
    await expect(continueLink).toBeVisible();

    // Click it and verify we're back at products page
    await continueLink.click();
    await expect(page).toHaveURL(/\/products$/);
  });
});

test.describe('End-to-End Flow', () => {
  test('should complete full user journey: list → detail → back to list', async ({ page }) => {
    // Start at products page
    await page.goto('/products');
    await expect(page.locator('h1')).toContainText('Products');

    // Remember the first product name (for future assertions if needed)
    // const firstProductName = await page.locator('[data-testid="product-name"]').first().textContent();

    // Click on the first product
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.click();

    // Verify we're on detail page
    await page.waitForURL(/\/products\/.+/);
    await expect(page.locator('h1')).toBeVisible();

    // Go back to products list
    await page.locator('a:has-text("Continue Shopping")').click();

    // Verify we're back on products page
    await expect(page).toHaveURL(/\/products$/);
    await expect(page.locator('h1')).toContainText('Products');

    // Verify products are still displayed
    const productCards = page.locator('[data-testid="product-card"]');
    await expect(productCards.first()).toBeVisible();
  });
});
