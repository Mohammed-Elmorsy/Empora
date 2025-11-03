import { Suspense } from 'react';
import Link from 'next/link';
import { getProducts, getCategory } from '@/lib/api/products';
import { ProductList } from '@/components/ProductList';

interface ProductsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    categoryId?: string;
    minPrice?: string;
    maxPrice?: string;
    isFeatured?: string;
  }>;
}

async function ProductsContent({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;
  const search = params.search;
  const categoryId = params.categoryId;
  const minPrice = params.minPrice ? parseFloat(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : undefined;
  const isFeatured = params.isFeatured === 'true' ? true : undefined;

  const response = await getProducts({
    page,
    limit: 12,
    search,
    categoryId,
    minPrice,
    maxPrice,
    isFeatured,
  });

  // Fetch category details if filtering by category
  let category = null;
  let categoryError = false;
  if (categoryId) {
    try {
      category = await getCategory(categoryId);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Failed to fetch category ${categoryId}:`, error);
      categoryError = true;
      // Continue rendering page even if category fetch fails
    }
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <Link href="/" className="hover:text-gray-900 dark:hover:text-gray-100">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-gray-900 dark:hover:text-gray-100">
          Products
        </Link>
        {categoryId && (
          <>
            <span>/</span>
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              {category ? category.name : categoryError ? 'Unknown Category' : 'Loading...'}
            </span>
          </>
        )}
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {category ? category.name : 'Products'}
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Showing {response.data.length} of {response.meta.total} products
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <ProductList products={response.data} />

      {/* Pagination */}
      {response.meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: response.meta.totalPages }, (_, i) => i + 1).map((pageNum) => {
            const isActive = pageNum === response.meta.page;
            const paginationParams = new URLSearchParams(params as Record<string, string>);
            paginationParams.set('page', pageNum.toString());

            return (
              <a
                key={pageNum}
                href={`/products?${paginationParams.toString()}`}
                className={`
                  px-4 py-2 rounded-md text-sm font-medium
                  ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                  }
                `}
              >
                {pageNum}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Suspense fallback={<ProductList products={[]} isLoading={true} />}>
        <ProductsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
