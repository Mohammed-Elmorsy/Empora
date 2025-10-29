/**
 * Example E2E Test
 * This demonstrates how to write end-to-end tests with Playwright
 */

import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');

    // Check that the page loaded
    await expect(page).toHaveTitle(/Empora/i);
  });

  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/');

    // Check meta description
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveCount(1);
  });

  test('should be responsive', async ({ page }) => {
    await page.goto('/');

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page).toHaveScreenshot('desktop-homepage.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page).toHaveScreenshot('mobile-homepage.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });
});

test.describe('Navigation', () => {
  test('should navigate between pages', async ({ page }) => {
    await page.goto('/');

    // This is a placeholder test - update when actual navigation is implemented
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');

    // Check for h1
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
  });

  test('should have keyboard navigation', async ({ page }) => {
    await page.goto('/');

    // Tab through focusable elements
    await page.keyboard.press('Tab');

    // Check that something received focus
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });
});
