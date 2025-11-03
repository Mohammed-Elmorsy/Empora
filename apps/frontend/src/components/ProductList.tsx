import { ProductCard } from './ProductCard';
import type { Product } from '@/lib/api/products';

interface ProductListProps {
  products: Product[];
  isLoading?: boolean;
}

function ProductSkeleton() {
  return (
    <div
      data-testid="product-skeleton"
      className="animate-pulse rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
    >
      <div className="aspect-square mb-4 bg-gray-200 dark:bg-gray-700 rounded-md" />
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
      <svg
        className="w-24 h-24 text-gray-300 dark:text-gray-600 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        No products found
      </h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-sm">
        Try adjusting your filters or search to find what you&apos;re looking for.
      </p>
    </div>
  );
}

export function ProductList({ products, isLoading = false }: ProductListProps) {
  if (isLoading) {
    return (
      <div>
        <p className="sr-only">Loading products...</p>
        <div
          data-testid="product-grid"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div data-testid="product-grid" className="grid grid-cols-1">
        <EmptyState />
      </div>
    );
  }

  return (
    <div
      data-testid="product-grid"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
