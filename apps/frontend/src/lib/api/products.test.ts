import { getProducts, getProduct, getProductBySlug } from './products';

// Mock fetch globally
global.fetch = jest.fn();

describe('Products API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    it('should fetch products with default parameters', async () => {
      const mockResponse = {
        data: [
          {
            id: '1',
            name: 'Test Product',
            slug: 'test-product',
            price: '99.99',
            images: ['image1.jpg'],
            categoryId: 'cat-1',
            isActive: true,
          },
        ],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getProducts();

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/products?page=1&limit=12',
        { cache: 'no-store' },
      );
      expect(result).toEqual(mockResponse);
    });

    it('should fetch products with custom parameters', async () => {
      const mockResponse = {
        data: [],
        meta: { total: 0, page: 2, limit: 20, totalPages: 0 },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await getProducts({ page: 2, limit: 20, search: 'laptop' });

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/products?page=2&limit=20&search=laptop',
        { cache: 'no-store' },
      );
    });

    it('should filter by category', async () => {
      const mockResponse = {
        data: [],
        meta: { total: 0, page: 1, limit: 12, totalPages: 0 },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await getProducts({ categoryId: 'cat-123' });

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/products?page=1&limit=12&categoryId=cat-123',
        { cache: 'no-store' },
      );
    });

    it('should filter by price range', async () => {
      const mockResponse = {
        data: [],
        meta: { total: 0, page: 1, limit: 12, totalPages: 0 },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await getProducts({ minPrice: 100, maxPrice: 500 });

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/products?page=1&limit=12&minPrice=100&maxPrice=500',
        { cache: 'no-store' },
      );
    });

    it('should handle fetch errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'Internal Server Error',
      });

      await expect(getProducts()).rejects.toThrow(
        'Failed to fetch products: 500 - Internal Server Error',
      );
    });
  });

  describe('getProduct', () => {
    it('should fetch a single product by ID', async () => {
      const mockProduct = {
        id: '123',
        name: 'Test Product',
        slug: 'test-product',
        description: 'Test Description',
        price: '99.99',
        images: ['image1.jpg'],
        stock: 10,
        categoryId: 'cat-1',
        isActive: true,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockProduct,
      });

      const result = await getProduct('123');

      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3001/api/products/123', {
        cache: 'no-store',
      });
      expect(result).toEqual(mockProduct);
    });

    it('should handle 404 errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: async () => 'Not Found',
      });

      await expect(getProduct('non-existent')).rejects.toThrow(
        'Failed to fetch product: 404 - Not Found',
      );
    });
  });

  describe('getProductBySlug', () => {
    it('should fetch a single product by slug', async () => {
      const mockProduct = {
        id: '123',
        name: 'Test Product',
        slug: 'test-product',
        price: '99.99',
        images: ['image1.jpg'],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockProduct,
      });

      const result = await getProductBySlug('test-product');

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/products/slug/test-product',
        { cache: 'no-store' },
      );
      expect(result).toEqual(mockProduct);
    });

    it('should handle errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: async () => 'Not Found',
      });

      await expect(getProductBySlug('not-found')).rejects.toThrow(
        'Failed to fetch product by slug: 404 - Not Found',
      );
    });
  });
});
