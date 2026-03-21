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
      { key: 'brandMode', label: 'Brand Display', type: 'select', options: [
        { label: 'Text', value: 'text' },
        { label: 'Logo Image', value: 'logo' },
      ]},
      { key: 'brandName', label: 'Brand Name', type: 'text' },
      { key: 'brandAccent', label: 'Brand Subtitle', type: 'text' },
      { key: 'logoUrl', label: 'Logo Image URL', type: 'url', placeholder: 'Upload via /api/upload then paste URL' },
      { key: 'logoMaxWidth', label: 'Logo Max Width (px)', type: 'number', placeholder: '160' },
      { key: 'navBgColor', label: 'Nav Background Color', type: 'text', placeholder: '#E8E0D6' },
      { key: 'menuFontSize', label: 'Menu Font Size', type: 'text', placeholder: '0.8rem' },
      { key: 'menuColor', label: 'Menu Text Color', type: 'text', placeholder: '#6B5D4E' },
      { key: 'menuHoverColor', label: 'Menu Hover Color', type: 'text', placeholder: '#2E2720' },
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
    label: 'Hero Image',
    icon: '🖼️',
    fields: [
      { key: 'imageUrl', label: 'Image URL', type: 'url', required: true, placeholder: 'Upload via /api/upload then paste URL' },
      { key: 'imageAlt', label: 'Alt Text', type: 'text', placeholder: 'Describe the image' },
      { key: 'imageMaxHeight', label: 'Max Height', type: 'text', placeholder: '600px' },
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
