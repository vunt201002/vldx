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
    settingsFields: ['brandMode', 'brandName', 'brandAccent', 'logoUrl', 'logoMaxWidth', 'navBgColor', 'menuFontSize', 'menuColor', 'menuHoverColor', 'ctaLabel', 'ctaHref'],
    arrayBlocks: [
      { dataKey: 'links', blockType: 'nav-link' },
    ],
  },
  hero: {
    settingsFields: ['imageUrl', 'imageAlt', 'imageMaxHeight'],
    arrayBlocks: [],
  },
  'content-image': {
    settingsFields: ['squarePosition', 'rectImageOrder', 'squareImageUrl', 'squareImageAlt', 'rectImageUrl', 'rectImageAlt', 'overline', 'title', 'titleAccent', 'description', 'maxWidth', 'titleSize', 'descSize', 'titleColor', 'descColor', 'bgColor', 'sectionPadding'],
    arrayBlocks: [
      { dataKey: 'buttons', blockType: 'content-button' },
    ],
  },
  collections: {
    settingsFields: ['overline', 'title', 'titleAccent', 'description', 'cardLinkLabel'],
    arrayBlocks: [
      { dataKey: 'products', blockType: 'product-card' },
    ],
  },
  about: {
    settingsFields: ['overline', 'title', 'titleAccent', 'linkText', 'linkHref', 'visualImage', 'visualLabel', 'visualText'],
    settingsArrayFields: ['paragraphs'],
    arrayBlocks: [
      { dataKey: 'stats', blockType: 'stat' },
    ],
  },
  'color-picker': {
    settingsFields: ['overline', 'title', 'description', 'columns', 'bgColor'],
    arrayBlocks: [
      { dataKey: 'colors', blockType: 'color-swatch' },
    ],
  },
  'material-showcase': {
    settingsFields: ['overline', 'title', 'titleAccent', 'description', 'previewPosition', 'previewAspect', 'thumbnailColumns', 'showSpecs', 'bgColor'],
    arrayBlocks: [
      { dataKey: 'variants', blockType: 'variant-item' },
    ],
  },
  footer: {
    settingsFields: ['logoUrl', 'logoMaxWidth', 'brandName', 'copyright', 'bgColor', 'textColor', 'fontSize'],
    arrayBlocks: [
      { dataKey: 'infoLines', blockType: 'footer-line' },
      { dataKey: 'socialLinks', blockType: 'footer-social' },
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
  'why-choose-us': {
    settingsFields: ['overline', 'title', 'bgColor', 'bgImage'],
    arrayBlocks: [
      { dataKey: 'steps', blockType: 'why-step' },
    ],
  },
  'service-process': {
    settingsFields: ['overline', 'title', 'titleAccent', 'description', 'imageUrl', 'imageAlt', 'ctaLabel', 'ctaHref', 'bgColor'],
    arrayBlocks: [
      { dataKey: 'steps', blockType: 'process-step' },
    ],
  },
};

export default blockJsonMappings;
