/**
 * Format price in Vietnamese Dong (VND)
 * @param {number} price - Price in VND
 * @returns {string} Formatted price string
 */
export function formatPrice(price) {
  if (price == null || isNaN(price)) return '0 ₫';

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}

/**
 * Get price range from product variants
 * @param {Array} variants - Product variants with price
 * @returns {string} Price range string or single price
 */
export function getPriceRange(variants) {
  if (!variants || variants.length === 0) return formatPrice(0);

  const prices = variants.map(v => v.price).filter(p => p != null);
  if (prices.length === 0) return formatPrice(0);

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  if (minPrice === maxPrice) {
    return formatPrice(minPrice);
  }

  return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
}

/**
 * Format number with thousand separators
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export function formatNumber(num) {
  if (num == null || isNaN(num)) return '0';
  return new Intl.NumberFormat('vi-VN').format(num);
}
