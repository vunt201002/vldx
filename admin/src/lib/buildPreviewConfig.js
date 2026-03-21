/**
 * Client-side transformation: converts editor state (page + blocks)
 * into the same JSON format the storefront reads from {slug}.json.
 *
 * This mirrors the backend generatePageJson logic so the preview
 * can render live without saving.
 */

const blockJsonMappings = {
  navbar: {
    settingsFields: ['brandMode', 'brandName', 'brandAccent', 'logoUrl', 'logoMaxWidth', 'navBgColor', 'menuFontSize', 'menuColor', 'menuHoverColor', 'ctaLabel', 'ctaHref'],
    arrayBlocks: [{ dataKey: 'links', blockType: 'nav-link' }],
  },
  hero: {
    settingsFields: ['imageUrl', 'imageAlt', 'imageMaxHeight'],
    arrayBlocks: [],
  },
  collections: {
    settingsFields: ['overline', 'title', 'titleAccent', 'description', 'cardLinkLabel'],
    arrayBlocks: [{ dataKey: 'products', blockType: 'product-card' }],
  },
  about: {
    settingsFields: ['overline', 'title', 'titleAccent', 'linkText', 'linkHref', 'visualLabel', 'visualText'],
    settingsArrayFields: ['paragraphs'],
    arrayBlocks: [{ dataKey: 'stats', blockType: 'stat' }],
  },
  featured: {
    settingsFields: ['overline', 'title', 'titleAccent'],
    arrayBlocks: [{ dataKey: 'features', blockType: 'feature-card' }],
  },
  gallery: {
    settingsFields: ['overline', 'title', 'titleAccent', 'viewAllLabel', 'viewAllHref'],
    arrayBlocks: [{ dataKey: 'items', blockType: 'gallery-item' }],
  },
  contact: {
    settingsFields: ['overline', 'title', 'titleAccent', 'description', 'formSubmitLabel', 'footerBrand', 'footerBrandAccent', 'footerCopyright'],
    arrayBlocks: [
      { dataKey: 'contactInfos', blockType: 'contact-info' },
      { dataKey: 'socialLinks', blockType: 'social-link' },
    ],
  },
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function blockToSection(block) {
  const mapping = blockJsonMappings[block.type]
  if (!mapping) {
    return { id: block.type, section: { type: block.type, settings: { ...(block.data || {}) }, blocks: [] } }
  }

  const settings = {}
  const data = block.data || {}

  for (const key of mapping.settingsFields) {
    if (data[key] !== undefined) settings[key] = data[key]
  }

  if (mapping.settingsArrayFields) {
    for (const key of mapping.settingsArrayFields) {
      if (data[key] !== undefined) settings[key] = data[key]
    }
  }

  if (mapping.flattenFields) {
    for (const { dataKey, prefix, subKeys } of mapping.flattenFields) {
      const nested = data[dataKey]
      if (nested && typeof nested === 'object') {
        for (const sub of subKeys) {
          if (nested[sub] !== undefined) {
            settings[`${prefix}${capitalize(sub)}`] = nested[sub]
          }
        }
      }
    }
  }

  const blocks = []
  for (const { dataKey, blockType } of mapping.arrayBlocks) {
    const arr = data[dataKey]
    if (Array.isArray(arr)) {
      for (const item of arr) {
        blocks.push({ type: blockType, settings: { ...item } })
      }
    }
  }

  return { id: block.type, section: { type: block.type, settings, blocks } }
}

export default function buildPreviewConfig(page, editorBlocks) {
  const order = []
  const sections = {}

  for (const block of editorBlocks) {
    const { id, section } = blockToSection(block)
    order.push(id)
    sections[id] = section
  }

  return {
    page: {
      title: page.title || '',
      description: page.description || '',
      bodyClass: page.bodyClass || '',
      displayFont: page.displayFont || '',
      bodyFont: page.bodyFont || '',
    },
    order,
    sections,
  }
}
