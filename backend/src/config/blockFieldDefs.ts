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
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'select' | 'url' | 'array' | 'image' | 'menu-select';
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  fields?: FieldDef[]; // for array type
  uploadFolder?: string; // for image type
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
      { key: 'logoUrl', label: 'Logo Image', type: 'image', uploadFolder: 'pages' },
      { key: 'logoMaxWidth', label: 'Logo Max Width (px)', type: 'number', placeholder: '160' },
      { key: 'navBgColor', label: 'Nav Background Color', type: 'text', placeholder: '#DDE1CE' },
      { key: 'menuFontSize', label: 'Menu Font Size', type: 'text', placeholder: '0.8rem' },
      { key: 'menuColor', label: 'Menu Text Color', type: 'text', placeholder: '#5E5C4D' },
      { key: 'menuHoverColor', label: 'Menu Hover Color', type: 'text', placeholder: '#2B2A25' },
      { key: 'ctaLabel', label: 'CTA Label', type: 'text' },
      { key: 'ctaHref', label: 'CTA Link', type: 'url' },
      { key: 'menuHandle', label: 'Navigation Menu', type: 'menu-select' as any },
    ],
  },
  {
    type: 'hero',
    label: 'Hero Image',
    icon: '🖼️',
    fields: [
      { key: 'imageUrl', label: 'Hero Image', type: 'image', required: true, uploadFolder: 'pages' },
      { key: 'imageAlt', label: 'Alt Text', type: 'text', placeholder: 'Describe the image' },
      { key: 'imageMaxHeight', label: 'Max Height', type: 'text', placeholder: '600px' },
    ],
  },
  {
    type: 'content-image',
    label: 'Content + Image',
    icon: '🖼️',
    fields: [
      // Layout controls
      { key: 'squarePosition', label: 'Square Image Side', type: 'select', options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ]},
      { key: 'rectImageOrder', label: 'Rectangle Image Position', type: 'select', options: [
        { label: 'Top (image above content)', value: 'top' },
        { label: 'Bottom (image below content)', value: 'bottom' },
      ]},
      // Square images (1-6 images in a grid)
      {
        key: 'squareImages',
        label: 'Square Images',
        type: 'array',
        fields: [
          { key: 'url', label: 'Image', type: 'image' as any, uploadFolder: 'pages' },
          { key: 'alt', label: 'Alt Text', type: 'text' },
        ],
      },
      // Rectangle image
      { key: 'rectImageUrl', label: 'Rectangle Image', type: 'image' as any, uploadFolder: 'pages' },
      { key: 'rectImageAlt', label: 'Rectangle Image Alt', type: 'text' },
      // Content
      { key: 'overline', label: 'Overline', type: 'text', placeholder: 'e.g. our story' },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'titleAccent', label: 'Title Accent (italic)', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      // Style
      { key: 'maxWidth', label: 'Max Width', type: 'text', placeholder: '1200px' },
      { key: 'titleSize', label: 'Title Font Size', type: 'text', placeholder: '2rem' },
      { key: 'descSize', label: 'Description Font Size', type: 'text', placeholder: '1rem' },
      { key: 'titleColor', label: 'Title Color', type: 'text', placeholder: '#1A1A17' },
      { key: 'descColor', label: 'Description Color', type: 'text', placeholder: '#43413A' },
      { key: 'bgColor', label: 'Background Color', type: 'text', placeholder: '#ffffff' },
      { key: 'sectionPadding', label: 'Section Padding', type: 'text', placeholder: '5rem 0' },
      // Buttons
      {
        key: 'buttons',
        label: 'Buttons',
        type: 'array',
        fields: [
          { key: 'label', label: 'Label', type: 'text', required: true },
          { key: 'href', label: 'Link', type: 'url', required: true },
          { key: 'color', label: 'Text Color', type: 'text', placeholder: '#1A1A17' },
          { key: 'borderColor', label: 'Border Color', type: 'text', placeholder: '#1A1A17' },
        ],
      },
    ],
  },
  {
    type: 'collections',
    label: 'Product Collections',
    icon: '🛍️',
    fields: [
      { key: 'overline', label: 'Overline', type: 'text' },
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'titleLink', label: 'Title Link', type: 'url', placeholder: 'https://...' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'cardLinkLabel', label: 'Card Link Label', type: 'text' },
      { key: 'bgColor', label: 'Background Color', type: 'text', placeholder: '#EDF0E4' },
      {
        key: 'products',
        label: 'Products',
        type: 'array',
        fields: [
          { key: 'name', label: 'Name', type: 'text', required: true },
          { key: 'href', label: 'Link URL', type: 'url', placeholder: 'https://...' },
          {
            key: 'images',
            label: 'Images / GIFs',
            type: 'array',
            fields: [
              { key: 'url', label: 'Image URL', type: 'image' as any, uploadFolder: 'products' },
            ],
          },
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
      { key: 'visualImage', label: 'Showroom Image', type: 'image' as any, uploadFolder: 'pages' },
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
    type: 'color-picker',
    label: 'Color Picker',
    icon: '🎨',
    fields: [
      { key: 'overline', label: 'Overline', type: 'text' },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'columns', label: 'Columns', type: 'select', options: [
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
      ]},
      { key: 'bgColor', label: 'Background Color', type: 'text', placeholder: '#ffffff' },
      {
        key: 'colors',
        label: 'Colors',
        type: 'array',
        fields: [
          { key: 'name', label: 'Name', type: 'text', required: true },
          { key: 'hex', label: 'Color (hex)', type: 'text', placeholder: '#C8CCB6' },
          { key: 'image', label: 'Texture Image', type: 'image' as any, uploadFolder: 'products' },
        ],
      },
    ],
  },
  {
    type: 'material-showcase',
    label: 'Material Showcase',
    icon: '🪨',
    fields: [
      { key: 'overline', label: 'Overline', type: 'text' },
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'titleAccent', label: 'Title Accent', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'previewPosition', label: 'Preview Position', type: 'select', options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ]},
      { key: 'previewAspect', label: 'Preview Aspect Ratio', type: 'select', options: [
        { label: '4:3 (Landscape)', value: '4/3' },
        { label: '1:1 (Square)', value: '1/1' },
        { label: '3:4 (Portrait)', value: '3/4' },
      ]},
      { key: 'thumbnailColumns', label: 'Thumbnails per Row', type: 'select', options: [
        { label: '3', value: '3' },
        { label: '4', value: '4' },
        { label: '5', value: '5' },
        { label: '6', value: '6' },
      ]},
      { key: 'showSpecs', label: 'Show Specs', type: 'boolean' },
      { key: 'bgColor', label: 'Background Color', type: 'text', placeholder: '#EDF0E4' },
      {
        key: 'variants',
        label: 'Material Variants',
        type: 'array',
        fields: [
          { key: 'name', label: 'Name', type: 'text', required: true },
          { key: 'image', label: 'Image', type: 'image' as any, uploadFolder: 'products' },
          { key: 'description', label: 'Description', type: 'textarea' },
          { key: 'specs', label: 'Specifications', type: 'text', placeholder: '400x1200mm | 30mm dày' },
          { key: 'tag', label: 'Badge', type: 'text', placeholder: 'bán chạy' },
        ],
      },
    ],
  },
  {
    type: 'footer',
    label: 'Footer',
    icon: '🦶',
    fields: [
      { key: 'logoUrl', label: 'Logo Image', type: 'image' as any, uploadFolder: 'pages' },
      { key: 'logoMaxWidth', label: 'Logo Max Width (px)', type: 'number', placeholder: '180' },
      { key: 'brandName', label: 'Brand Name (alt text)', type: 'text' },
      { key: 'copyright', label: 'Copyright Text', type: 'text' },
      { key: 'bgColor', label: 'Background Color', type: 'text', placeholder: '#DDE1CE' },
      { key: 'textColor', label: 'Text Color', type: 'text', placeholder: '#1A1A17' },
      { key: 'fontSize', label: 'Info Font Size', type: 'text', placeholder: '0.9rem' },
      {
        key: 'infoLines',
        label: 'Info Lines',
        type: 'array',
        fields: [
          { key: 'text', label: 'Text', type: 'text', required: true },
        ],
      },
      {
        key: 'socialLinks',
        label: 'Social Links',
        type: 'array',
        fields: [
          { key: 'label', label: 'Label', type: 'text', required: true },
          { key: 'icon', label: 'Icon', type: 'select', options: [
            { label: 'Email', value: 'email' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'Pinterest', value: 'pinterest' },
            { label: 'TikTok', value: 'tiktok' },
            { label: 'Zalo', value: 'zalo' },
          ]},
          { key: 'href', label: 'URL', type: 'url', required: true },
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
          { key: 'href', label: 'Link URL', type: 'url', placeholder: 'https://...' },
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
  {
    type: 'why-choose-us',
    label: 'Why Choose Us V2',
    icon: '🏆',
    fields: [
      { key: 'overline', label: 'Overline', type: 'text' },
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'bgColor', label: 'Background Color', type: 'text', placeholder: '#ffffff' },
      { key: 'bgImage', label: 'Background Image', type: 'image', uploadFolder: 'pages' },
      {
        key: 'steps',
        label: 'Steps',
        type: 'array',
        fields: [
          { key: 'icon', label: 'Icon Image', type: 'image', uploadFolder: 'pages' },
          { key: 'iconBgColor', label: 'Icon Background Color', type: 'text', placeholder: '#D4CC8C' },
          { key: 'title', label: 'Title', type: 'text', required: true },
          { key: 'desc', label: 'Description', type: 'textarea' },
          { key: 'href', label: 'Link URL', type: 'url', placeholder: 'https://...' },
        ],
      },
    ],
  },
  {
    type: 'service-process',
    label: 'Service Process',
    icon: '🔧',
    fields: [
      { key: 'overline', label: 'Overline', type: 'text' },
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'titleAccent', label: 'Title Accent', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'imageUrl', label: 'Feature Image', type: 'image' as any, uploadFolder: 'pages' },
      { key: 'imageAlt', label: 'Image Alt Text', type: 'text' },
      { key: 'ctaLabel', label: 'CTA Button Label', type: 'text' },
      { key: 'ctaHref', label: 'CTA Button Link', type: 'url' },
      { key: 'bgColor', label: 'Background Color', type: 'text', placeholder: '#EDF0E4' },
      {
        key: 'steps',
        label: 'Process Steps',
        type: 'array',
        fields: [
          { key: 'image', label: 'Step Image/GIF', type: 'image' as any, uploadFolder: 'pages' },
          { key: 'stepNumber', label: 'Step Number', type: 'text', placeholder: '01' },
          { key: 'title', label: 'Title', type: 'text', required: true },
          { key: 'description', label: 'Description', type: 'textarea' },
        ],
      },
    ],
  },
  {
    type: 'blog-showcase',
    label: 'Blog Showcase',
    icon: '📰',
    fields: [
      { key: 'overline', label: 'Overline', type: 'text', placeholder: 'From our blog' },
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'postCount', label: 'Number of Posts', type: 'number', placeholder: '8' },
      { key: 'tag', label: 'Filter by Tag', type: 'text', placeholder: 'Leave empty for latest' },
      { key: 'viewAllLabel', label: 'View All Label', type: 'text', placeholder: 'View all articles' },
      { key: 'viewAllHref', label: 'View All Link', type: 'url', placeholder: '/blog' },
      { key: 'bgColor', label: 'Background Color', type: 'text', placeholder: '#EDF0E4' },
    ],
  },
  {
    type: 'stats-bar',
    label: 'Stats Bar',
    icon: '📊',
    fields: [
      { key: 'overline', label: 'Overline', type: 'text' },
      { key: 'bgColor', label: 'Background Color', type: 'text', placeholder: '#9B997B' },
      {
        key: 'stats',
        label: 'Stats',
        type: 'array',
        fields: [
          { key: 'icon', label: 'Icon', type: 'select', options: [
            { label: 'Building', value: 'building' },
            { label: 'Clock', value: 'clock' },
            { label: 'Star', value: 'star' },
            { label: 'Phone', value: 'phone' },
            { label: 'Shield', value: 'shield' },
            { label: 'Truck', value: 'truck' },
          ]},
          { key: 'number', label: 'Number', type: 'text', required: true, placeholder: '150+' },
          { key: 'label', label: 'Label', type: 'text', required: true },
        ],
      },
    ],
  },
  {
    type: 'cta-banner',
    label: 'CTA Banner',
    icon: '📣',
    fields: [
      { key: 'overline', label: 'Overline', type: 'text' },
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { key: 'ctaLabel', label: 'Button Label', type: 'text' },
      { key: 'ctaHref', label: 'Button Link', type: 'url' },
      { key: 'imageUrl', label: 'Image', type: 'image' as any, uploadFolder: 'pages' },
      { key: 'imageAlt', label: 'Image Alt', type: 'text' },
      { key: 'bgColor', label: 'Background Color', type: 'text', placeholder: '#EDF0E4' },
    ],
  },
  {
    type: 'why-install',
    label: 'Why Direct Install',
    icon: '🏗️',
    fields: [
      { key: 'overline', label: 'Overline', type: 'text' },
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'imageUrl', label: 'Image', type: 'image' as any, uploadFolder: 'pages' },
      { key: 'imageAlt', label: 'Image Alt', type: 'text' },
      { key: 'card1Label', label: 'Card 1 Label', type: 'text', placeholder: 'Đo đạc chính xác' },
      { key: 'card2Label', label: 'Card 2 Label', type: 'text', placeholder: 'Sản xuất theo yêu cầu' },
      { key: 'card3Label', label: 'Card 3 Label', type: 'text', placeholder: 'Thi công chuyên nghiệp' },
      { key: 'bgColor', label: 'Background Color', type: 'text', placeholder: '#ffffff' },
    ],
  },
];

export default blockFieldDefs;
