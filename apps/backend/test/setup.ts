/**
 * Test Setup File
 * This file runs before all tests to set up the test environment
 */

// Set test environment variables
process.env.NODE_ENV = 'test';

// Extend Jest timeout for E2E tests
jest.setTimeout(30000);

// Mock console methods to reduce noise in test output

global.console = {
  ...console,
  log: jest.fn(), // Mock console.log
  debug: jest.fn(), // Mock console.debug
  info: jest.fn(), // Mock console.info
  warn: jest.fn(), // Mock console.warn
  error: console.error, // Keep console.error for debugging
};

// Global test utilities
global.afterEach(() => {
  jest.clearAllMocks();
});
