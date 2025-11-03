const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  comparePrice: string | null;
  sku: string;
  stock: number;
  images: string[];
  categoryId: string;
  category?: Category;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parentId: string | null;
}

export interface ProductsResponse {
  data: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GetProductsParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  isFeatured?: boolean;
  sortBy?: 'createdAt' | 'price' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export async function getProducts(params: GetProductsParams = {}): Promise<ProductsResponse> {
  const { page = 1, limit = 12, ...rest } = params;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  Object.entries(rest).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString());
    }
  });

  const response = await fetch(`${API_BASE_URL}/products?${queryParams}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    // eslint-disable-next-line no-console
    console.error('Failed to fetch products:', response.status, errorText);
    throw new Error(`Failed to fetch products: ${response.status} - ${errorText}`);
  }

  return response.json();
}

export async function getProduct(id: string): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, { cache: 'no-store' });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Failed to fetch product: ${response.status} - ${errorText}`);
  }

  return response.json();
}

export async function getProductBySlug(slug: string): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products/slug/${slug}`, { cache: 'no-store' });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Failed to fetch product by slug: ${response.status} - ${errorText}`);
  }

  return response.json();
}

export async function getCategory(id: string): Promise<Category> {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch category');
  }

  return response.json();
}
