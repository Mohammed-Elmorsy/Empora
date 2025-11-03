import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProductBySlug } from '@/lib/api/products';

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  let product;

  try {
    product = await getProductBySlug(slug);
  } catch (error) {
    notFound();
  }

  const numericPrice = parseFloat(product.price);
  const numericComparePrice = product.comparePrice ? parseFloat(product.comparePrice) : null;

  const discountPercentage =
    numericComparePrice && numericComparePrice > numericPrice
      ? Math.round(((numericComparePrice - numericPrice) / numericComparePrice) * 100)
      : null;

  const isOutOfStock = product.stock === 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <Link href="/" className="hover:text-gray-900 dark:hover:text-gray-100">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-gray-900 dark:hover:text-gray-100">
          Products
        </Link>
        {product.category && (
          <>
            <span>/</span>
            <Link
              href={`/products?categoryId=${product.category.id}`}
              className="hover:text-gray-900 dark:hover:text-gray-100"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-gray-900 dark:text-gray-100 font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
            <Image
              src={product.images[0] || '/placeholder-product.png'}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              data-testid="product-image"
            />

            {/* Badges */}
            <div className="absolute left-4 top-4 flex flex-col gap-2">
              {product.isFeatured && (
                <span className="rounded-full bg-yellow-500 px-4 py-2 text-sm font-semibold text-white">
                  Featured
                </span>
              )}
              {isOutOfStock && (
                <span className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white">
                  Out of Stock
                </span>
              )}
            </div>

            {discountPercentage && (
              <div className="absolute right-4 top-4">
                <span className="rounded-full bg-green-500 px-4 py-2 text-sm font-semibold text-white">
                  {discountPercentage}% off
                </span>
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.slice(0, 4).map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square overflow-hidden rounded-md bg-gray-100 dark:bg-gray-700 border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer"
                >
                  <Image
                    src={image}
                    alt={`${product.name} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="25vw"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Category Badge */}
          {product.category && (
            <div>
              <Link
                href={`/products?categoryId=${product.category.id}`}
                className="inline-block text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                {product.category.name}
              </Link>
            </div>
          )}

          {/* Product Name */}
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">{product.name}</h1>

          {/* Price */}
          <div className="flex items-baseline gap-3" data-testid="product-price">
            <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              ${product.price}
            </span>
            {product.comparePrice && (
              <span className="text-2xl text-gray-500 dark:text-gray-400 line-through">
                ${product.comparePrice}
              </span>
            )}
            {discountPercentage && (
              <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                Save {discountPercentage}%
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div>
            {isOutOfStock ? (
              <p className="text-red-600 font-medium">Out of Stock</p>
            ) : product.stock < 10 ? (
              <p className="text-orange-600 font-medium">Only {product.stock} left in stock</p>
            ) : (
              <p className="text-green-600 font-medium">In Stock</p>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Description
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Product Details */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Product Details
            </h2>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-gray-600 dark:text-gray-400">SKU:</dt>
                <dd className="font-medium text-gray-900 dark:text-gray-100">{product.sku}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600 dark:text-gray-400">Availability:</dt>
                <dd className="font-medium text-gray-900 dark:text-gray-100">
                  {isOutOfStock ? 'Out of Stock' : `${product.stock} units`}
                </dd>
              </div>
              {product.category && (
                <div className="flex justify-between">
                  <dt className="text-gray-600 dark:text-gray-400">Category:</dt>
                  <dd className="font-medium text-gray-900 dark:text-gray-100">
                    {product.category.name}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 pt-6">
            <button
              disabled={isOutOfStock}
              className={`
                w-full py-4 px-6 rounded-lg text-lg font-semibold
                transition-colors
                ${
                  isOutOfStock
                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                }
              `}
            >
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>

            <Link
              href="/products"
              className="block w-full py-4 px-6 rounded-lg text-lg font-semibold text-center border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
