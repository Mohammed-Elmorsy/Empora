import { useQuery } from '@tanstack/react-query';
import {
  getProducts,
  getProduct,
  getProductBySlug,
  getCategory,
  type GetProductsParams,
} from '@/lib/api/products';

export function useProducts(params: GetProductsParams = {}) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => getProducts(params),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id),
    enabled: !!id,
  });
}

export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: ['product', 'slug', slug],
    queryFn: () => getProductBySlug(slug),
    enabled: !!slug,
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => getCategory(id),
    enabled: !!id,
  });
}
