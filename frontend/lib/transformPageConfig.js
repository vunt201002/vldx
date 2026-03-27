/**
 * Data-driven mapping: block type → array fields that become nested blocks.
 * Mirrors backend blockJsonMapping.arrayBlocks so SSR pages render correctly.
 */
const ARRAY_BLOCK_MAP = {
  navbar:              [{ dataKey: 'links',       blockType: 'nav-link' }],
  'content-image':     [{ dataKey: 'buttons',     blockType: 'content-button' }],
  collections:         [{ dataKey: 'products',    blockType: 'product-card' }],
  about:               [{ dataKey: 'stats',       blockType: 'stat' }],
  'color-picker':      [{ dataKey: 'colors',      blockType: 'color-swatch' }],
  'material-showcase': [{ dataKey: 'variants',    blockType: 'variant-item' }],
  footer:              [{ dataKey: 'infoLines',   blockType: 'footer-line' },
                        { dataKey: 'socialLinks', blockType: 'footer-social' }],
  featured:            [{ dataKey: 'features',    blockType: 'feature-card' }],
  gallery:             [{ dataKey: 'items',       blockType: 'gallery-item' }],
  contact:             [{ dataKey: 'contactInfos', blockType: 'contact-info' },
                        { dataKey: 'socialLinks',  blockType: 'social-link' }],
  'service-process':   [{ dataKey: 'steps',       blockType: 'process-step' }],
};

/**
 * Transform a block's nested data into the blocks array expected by section components.
 */
function getNestedBlocks(block) {
  const data = block.data || block.settings || {};
  const mappings = ARRAY_BLOCK_MAP[block.type];

  if (mappings) {
    const blocks = [];
    for (const { dataKey, blockType } of mappings) {
      const arr = data[dataKey];
      if (Array.isArray(arr)) {
        for (const item of arr) {
          blocks.push({ type: blockType, settings: item });
        }
      }
    }
    return blocks;
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
