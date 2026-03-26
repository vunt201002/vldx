import Link from 'next/link';
import Image from 'next/image';
import { getPriceRange } from '@/lib/formatters';

export default function ProductCard({ product }) {
  const imageUrl = product.images?.[0] || '/placeholder-product.jpg';
  const variantCount = product.variants?.length || 0;
  const colorCount = product.colors?.length || 0;

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="group cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="mb-2 text-lg font-semibold text-gray-900 line-clamp-2">
            {product.name}
          </h3>

          {product.description && (
            <p className="mb-3 text-sm text-gray-600 line-clamp-2">
              {product.description}
            </p>
          )}

          <div className="mb-3 flex items-baseline gap-2">
            <span className="text-xl font-bold text-sandstone">
              {getPriceRange(product.variants)}
            </span>
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-3 text-xs text-gray-500">
            {variantCount > 0 && (
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {variantCount} {variantCount === 1 ? 'variant' : 'variants'}
              </span>
            )}
            {colorCount > 0 && (
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                {colorCount} {colorCount === 1 ? 'color' : 'colors'}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
