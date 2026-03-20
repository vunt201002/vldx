/**
 * Field definitions for each block type.
 * The theme editor uses these to render the correct form fields.
 *
 * Field types: text, textarea, number, boolean, select, url, array
 * Array fields have a `fields` property defining sub-item fields.
 */

export interface FieldDef {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'select' | 'url' | 'array';
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  fields?: FieldDef[]; // for array type
}

export interface BlockTypeDef {
  type: string;
  label: string;
  icon: string;
  fields: FieldDef[];
}

const blockFieldDefs: BlockTypeDef[] = [
  {
    type: 'navbar',
    label: 'Navigation Bar',
    icon: '🧭',
    fields: [
      { key: 'brandName', label: 'Brand Name', type: 'text', required: true },
      { key: 'brandAccent', label: 'Brand Accent', type: 'text' },
      { key: 'ctaLabel', label: 'CTA Label', type: 'text' },
      { key: 'ctaHref', label: 'CTA Link', type: 'url' },
      {
        key: 'links',
        label: 'Navigation Links',
        type: 'array',
        fields: [
          { key: 'label', label: 'Label', type: 'text', required: true },
          { key: 'href', label: 'URL', type: 'url', required: true },
        ],
      },
    ],
  },
  {
    type: 'hero',
    label: 'Hero Banner',
    icon: '🏔️',
    fields: [
      { key: 'overline', label: 'Overline', type: 'text' },
      { key: 'headline', label: 'Headline', type: 'textarea', required: true },
      { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { key: 'primaryCta.label', label: 'Primary CTA Label', type: 'text' },
      { key: 'primaryCta.href', label: 'Primary CTA Link', type: 'url' },
      { key: 'secondaryCta.label', label: 'Secondary CTA Label', type: 'text' },
      { key: 'secondaryCta.href', label: 'Secondary CTA Link', type: 'url' },
      { key: 'scrollIndicatorText', label: 'Scroll Indicator Text', type: 'text' },
    ],
  },
  {
    type: 'collections',
    label: 'Product Collections',
    icon: '🛍️',
    fields: [
      { key: 'overline', label: 'Overline', type: 'text' },
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'titleAccent', label: 'Title Accent', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'cardLinkLabel', label: 'Card Link Label', type: 'text' },
      {
        key: 'products',
        label: 'Products',
        type: 'array',
        fields: [
          { key: 'name', label: 'Name', type: 'text', required: true },
          { key: 'slug', label: 'Slug', type: 'text', required: true },
          { key: 'desc', label: 'Description', type: 'textarea' },
          { key: 'specs', label: 'Specs', type: 'text' },
          { key: 'color', label: 'Gradient Color', type: 'text' },
        ],
      },
    ],
  },
  {
    type: 'about',
    label: 'About / Story',
    icon: '📖',
    fields: [
      { key: 'overline', label: 'Overline', type: 'text' },
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'titleAccent', label: 'Title Accent', type: 'text' },
      { key: 'paragraphs', label: 'Paragraphs', type: 'array', fields: [
        { key: 'value', label: 'Paragraph', type: 'textarea', required: true },
      ]},
      { key: 'linkText', label: 'Link Text', type: 'text' },
      { key: 'linkHref', label: 'Link URL', type: 'url' },
      { key: 'visualLabel', label: 'Visual Label', type: 'text' },
      { key: 'visualText', label: 'Visual Text', type: 'text' },
      {
        key: 'stats',
        label: 'Statistics',
        type: 'array',
        fields: [
          { key: 'value', label: 'Value', type: 'text', required: true },
          { key: 'label', label: 'Label', type: 'text', required: true },
        ],
      },
    ],
  },
  {
    type: 'featured',
    label: 'Why Choose Us',
    icon: '⭐',
    fields: [
      { key: 'overline', label: 'Overline', type: 'text' },
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'titleAccent', label: 'Title Accent', type: 'text' },
      {
        key: 'features',
        label: 'Features',
        type: 'array',
        fields: [
          { key: 'iconName', label: 'Icon Name', type: 'text' },
          { key: 'title', label: 'Title', type: 'text', required: true },
          { key: 'desc', label: 'Description', type: 'textarea' },
        ],
      },
    ],
  },
  {
    type: 'gallery',
    label: 'Project Gallery',
    icon: '🖼️',
    fields: [
      { key: 'overline', label: 'Overline', type: 'text' },
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'titleAccent', label: 'Title Accent', type: 'text' },
      { key: 'viewAllLabel', label: 'View All Label', type: 'text' },
      { key: 'viewAllHref', label: 'View All Link', type: 'url' },
      {
        key: 'items',
        label: 'Gallery Items',
        type: 'array',
        fields: [
          { key: 'label', label: 'Label', type: 'text', required: true },
          { key: 'tag', label: 'Tag', type: 'text' },
          { key: 'gradient', label: 'Gradient', type: 'text' },
          {
            key: 'aspect',
            label: 'Aspect',
            type: 'select',
            options: [
              { label: 'Default', value: '' },
              { label: 'Tall (2 rows)', value: 'row-span-2' },
            ],
          },
        ],
      },
    ],
  },
  {
    type: 'contact',
    label: 'Contact & Footer',
    icon: '📞',
    fields: [
      { key: 'overline', label: 'Overline', type: 'text' },
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'titleAccent', label: 'Title Accent', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'formSubmitLabel', label: 'Form Submit Label', type: 'text' },
      { key: 'footerBrand', label: 'Footer Brand', type: 'text' },
      { key: 'footerBrandAccent', label: 'Footer Brand Accent', type: 'text' },
      { key: 'footerCopyright', label: 'Copyright Text', type: 'text' },
      {
        key: 'contactInfos',
        label: 'Contact Info',
        type: 'array',
        fields: [
          { key: 'iconName', label: 'Icon', type: 'select', options: [
            { label: 'Phone', value: 'phone' },
            { label: 'Email', value: 'email' },
            { label: 'Location', value: 'location' },
          ]},
          { key: 'label', label: 'Label', type: 'text', required: true },
          { key: 'value', label: 'Value', type: 'text', required: true },
          { key: 'detail', label: 'Detail', type: 'text' },
        ],
      },
      {
        key: 'socialLinks',
        label: 'Social Links',
        type: 'array',
        fields: [
          { key: 'label', label: 'Label', type: 'text', required: true },
          { key: 'href', label: 'URL', type: 'url', required: true },
        ],
      },
    ],
  },
];

export default blockFieldDefs;
