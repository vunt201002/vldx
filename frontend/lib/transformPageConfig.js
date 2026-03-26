/**
 * Transform a block's nested data into the blocks array expected by section components.
 * Navbar stores links in data.links and needs them as [{ type: 'nav-link', settings }].
 */
function getNestedBlocks(block) {
  const data = block.data || block.settings || {};
  if (block.type === 'navbar' && Array.isArray(data.links)) {
    return data.links.map((item) => ({ type: 'nav-link', settings: item }));
  }
  return data.items || data.blocks || [];
}

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
      blocks: getNestedBlocks(block)
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
      blocks: getNestedBlocks(block)
    };
    order.push(key);
  });

  return { sections, order };
}
