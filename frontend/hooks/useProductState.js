import { useState } from 'react';

/**
 * Manage product detail page state (selected variant, color, image)
 * @param {Object} product - Product data
 * @returns {Object} State and setters
 */
export function useProductState(product) {
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );

  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0] : null
  );

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const currentPrice = selectedVariant?.price || 0;

  return {
    selectedVariant,
    setSelectedVariant,
    selectedColor,
    setSelectedColor,
    selectedImageIndex,
    setSelectedImageIndex,
    currentPrice
  };
}
