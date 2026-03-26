/**
 * Transform backend page data (with blocks array) to frontend config format
 * @param {Object} pageData - Backend response { page, blocks }
 * @returns {Object} Frontend config { page, sections, order }
 */
export function transformPageData(pageData) {
  if (!pageData || !pageData.blocks) {
    return {
      page: pageData?.page || {},
      sections: {},
      order: []
    };
  }

  const sections = {};
  const order = [];

  // Sort blocks by order field
  const sortedBlocks = [...pageData.blocks].sort((a, b) => (a.order || 0) - (b.order || 0));

  sortedBlocks.forEach((block, index) => {
    const key = block._id || `block-${index}`;

    sections[key] = {
      type: block.type,
      settings: block.data || {},
      blocks: [] // Most blocks don't have nested blocks in this structure
    };

    order.push(key);
  });

  return {
    page: pageData.page,
    sections,
    order
  };
}

/**
 * Transform blocks array to config format (for header/footer/template blocks)
 * @param {Array} blocks - Array of blocks
 * @returns {Object} Config { sections, order }
 */
export function blocksToConfig(blocks) {
  if (!blocks || blocks.length === 0) {
    return { sections: {}, order: [] };
  }

  const sections = {};
  const order = [];

  blocks.forEach((block, index) => {
    const key = block._id || `block-${index}`;
    sections[key] = {
      type: block.type,
      settings: block.data || block.settings || {},
      blocks: block.data?.items || block.data?.blocks || []
    };
    order.push(key);
  });

  return { sections, order };
}
