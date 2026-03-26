import { useProductState } from '@/hooks/useProductState';
import { formatPrice } from '@/lib/formatters';
import ImageGallery from './ImageGallery';
import VariantSelector from './VariantSelector';
import ColorSelector from './ColorSelector';
import Breadcrumb from './Breadcrumb';

export default function ProductDetail({ product }) {
  const {
    selectedVariant,
    setSelectedVariant,
    selectedColor,
    setSelectedColor,
    currentPrice
  } = useProductState(product);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: product.name, href: '#' }
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      <Breadcrumb items={breadcrumbItems} />

      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        {/* Left Column: Image Gallery */}
        <div>
          <ImageGallery images={product.images} productName={product.name} />
        </div>

        {/* Right Column: Product Info */}
        <div className="space-y-6">
          {/* Product Name */}
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">
              {product.name}
            </h1>
            {product.description && (
              <p className="text-base text-gray-600 leading-relaxed">
                {product.description}
              </p>
            )}
          </div>

          {/* Price Display */}
          <div className="border-y border-gray-200 py-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-sandstone">
                {formatPrice(currentPrice)}
              </span>
              {selectedVariant && (
                <span className="text-sm text-gray-500">
                  per {selectedVariant.name}
                </span>
              )}
            </div>
          </div>

          {/* Variant Selector */}
          {product.variants && product.variants.length > 0 && (
            <div>
              <VariantSelector
                variants={product.variants}
                selected={selectedVariant}
                onChange={setSelectedVariant}
              />
            </div>
          )}

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <ColorSelector
                colors={product.colors}
                selected={selectedColor}
                onChange={setSelectedColor}
              />
            </div>
          )}

          {/* Add to Cart Button */}
          <div className="space-y-3">
            <button
              className="w-full rounded-lg bg-sandstone px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-concrete focus:outline-none focus:ring-2 focus:ring-sandstone focus:ring-offset-2"
              onClick={() => alert('Add to cart functionality coming soon!')}
            >
              Add to Cart
            </button>

            <button
              className="w-full rounded-lg border-2 border-sandstone bg-white px-8 py-4 text-lg font-semibold text-sandstone transition-colors hover:bg-sand focus:outline-none focus:ring-2 focus:ring-sandstone focus:ring-offset-2"
              onClick={() => alert('Contact us functionality coming soon!')}
            >
              Contact Us
            </button>
          </div>

          {/* Product Details */}
          <div className="space-y-4 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900">Product Details</h3>

            <dl className="space-y-2 text-sm">
              {selectedVariant?.sku && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">SKU:</dt>
                  <dd className="font-medium text-gray-900">{selectedVariant.sku}</dd>
                </div>
              )}

              {product.variants && product.variants.length > 0 && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">Available Variants:</dt>
                  <dd className="font-medium text-gray-900">{product.variants.length}</dd>
                </div>
              )}

              {product.colors && product.colors.length > 0 && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">Available Colors:</dt>
                  <dd className="font-medium text-gray-900">{product.colors.length}</dd>
                </div>
              )}

              {product.images && product.images.length > 0 && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">Product Images:</dt>
                  <dd className="font-medium text-gray-900">{product.images.length}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
