import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/api/products';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { name, slug, price, comparePrice, images, stock, isFeatured, category } = product;

  const imageUrl = images.length > 0 ? images[0] : '/placeholder-product.png';
  const numericPrice = parseFloat(price);
  const numericComparePrice = comparePrice ? parseFloat(comparePrice) : null;

  const discountPercentage =
    numericComparePrice && numericComparePrice > numericPrice
      ? Math.round(((numericComparePrice - numericPrice) / numericComparePrice) * 100)
      : null;

  const isOutOfStock = stock === 0;

  return (
    <Link
      href={`/products/${slug}`}
      className="group block rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 transition-shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      data-testid="product-card"
    >
      {/* Image Container */}
      <div className="relative mb-4 aspect-square overflow-hidden rounded-md bg-gray-100 dark:bg-gray-700">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          data-testid="product-image"
        />

        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-2">
          {isFeatured && (
            <span className="rounded-full bg-yellow-500 px-3 py-1 text-xs font-semibold text-white">
              Featured
            </span>
          )}
          {isOutOfStock && (
            <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
              Out of Stock
            </span>
          )}
        </div>

        {/* Discount Badge */}
        {discountPercentage && (
          <div className="absolute right-2 top-2">
            <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
              {discountPercentage}% off
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        {/* Category */}
        {category && (
          <p
            className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide"
            data-testid="product-category"
          >
            {category.name}
          </p>
        )}

        {/* Product Name */}
        <h3
          className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400"
          data-testid="product-name"
        >
          {name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2" data-testid="product-price">
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">${price}</span>
          {comparePrice && (
            <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
              ${comparePrice}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
