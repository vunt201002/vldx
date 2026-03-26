import { formatPrice } from '@/lib/formatters';

export default function VariantSelector({ variants = [], selected, onChange }) {
  if (!variants || variants.length === 0) {
    return null;
  }

  // If only one variant, show it as read-only info
  if (variants.length === 1) {
    const variant = variants[0];
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Variant
        </label>
        <div className="rounded-md border border-gray-300 bg-gray-50 p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">{variant.name}</div>
              {variant.sku && (
                <div className="text-xs text-gray-500">SKU: {variant.sku}</div>
              )}
            </div>
            <div className="text-lg font-bold text-sandstone">
              {formatPrice(variant.price)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Select Variant
      </label>
      <div className="space-y-2">
        {variants.map((variant) => (
          <button
            key={variant._id || variant.name}
            onClick={() => onChange(variant)}
            className={`
              w-full rounded-md border-2 p-3 text-left transition-all
              ${
                selected?._id === variant._id || selected?.name === variant.name
                  ? 'border-sandstone bg-sand/30 ring-2 ring-sandstone ring-offset-2'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">{variant.name}</div>
                {variant.sku && (
                  <div className="text-xs text-gray-500">SKU: {variant.sku}</div>
                )}
              </div>
              <div className="text-lg font-bold text-sandstone">
                {formatPrice(variant.price)}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
