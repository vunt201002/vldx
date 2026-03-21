/**
 * Mapping config: defines how DB block.data transforms into landing.json sections.
 *
 * For each block type:
 * - `settingsFields`: scalar data keys that become section.settings
 * - `arrayBlocks`: data keys that are arrays → section.blocks[]
 *   - `dataKey`: the key in block.data
 *   - `blockType`: the "type" value in landing.json blocks
 * - `flattenFields`: nested objects to flatten (e.g., primaryCta.label → primaryCtaLabel)
 */

export interface ArrayBlockMapping {
  dataKey: string;
  blockType: string;
}

export interface FlattenMapping {
  dataKey: string;        // e.g. "primaryCta"
  prefix: string;         // e.g. "primaryCta"
  subKeys: string[];      // e.g. ["label", "href"]
}

export interface BlockJsonMapping {
  settingsFields: string[];
  arrayBlocks: ArrayBlockMapping[];
  flattenFields?: FlattenMapping[];
  /** For arrays of primitives (like paragraphs) that stay as settings, not blocks */
  settingsArrayFields?: string[];
}

const blockJsonMappings: Record<string, BlockJsonMapping> = {
  navbar: {
    settingsFields: ['brandMode', 'brandName', 'brandAccent', 'logoUrl', 'logoMaxWidth', 'menuFontSize', 'menuColor', 'menuHoverColor', 'ctaLabel', 'ctaHref'],
    arrayBlocks: [
      { dataKey: 'links', blockType: 'nav-link' },
    ],
  },
  hero: {
    settingsFields: ['overline', 'headline', 'subtitle', 'scrollIndicatorText'],
    arrayBlocks: [],
    flattenFields: [
      { dataKey: 'primaryCta', prefix: 'primaryCta', subKeys: ['label', 'href'] },
      { dataKey: 'secondaryCta', prefix: 'secondaryCta', subKeys: ['label', 'href'] },
    ],
  },
  collections: {
    settingsFields: ['overline', 'title', 'titleAccent', 'description', 'cardLinkLabel'],
    arrayBlocks: [
      { dataKey: 'products', blockType: 'product-card' },
    ],
  },
  about: {
    settingsFields: ['overline', 'title', 'titleAccent', 'linkText', 'linkHref', 'visualLabel', 'visualText'],
    settingsArrayFields: ['paragraphs'],
    arrayBlocks: [
      { dataKey: 'stats', blockType: 'stat' },
    ],
  },
  featured: {
    settingsFields: ['overline', 'title', 'titleAccent'],
    arrayBlocks: [
      { dataKey: 'features', blockType: 'feature-card' },
    ],
  },
  gallery: {
    settingsFields: ['overline', 'title', 'titleAccent', 'viewAllLabel', 'viewAllHref'],
    arrayBlocks: [
      { dataKey: 'items', blockType: 'gallery-item' },
    ],
  },
  contact: {
    settingsFields: ['overline', 'title', 'titleAccent', 'description', 'formSubmitLabel', 'footerBrand', 'footerBrandAccent', 'footerCopyright'],
    arrayBlocks: [
      { dataKey: 'contactInfos', blockType: 'contact-info' },
      { dataKey: 'socialLinks', blockType: 'social-link' },
    ],
  },
};

export default blockJsonMappings;
