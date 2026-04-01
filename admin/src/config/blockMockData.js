/**
 * Mock data for block previews
 * Each block type has sample settings and data for preview purposes
 */

export const BLOCK_MOCK_DATA = {
  // Section Blocks
  navbar: {
    settings: {
      logo: 'VLXD',
      logoUrl: '/',
    },
    blocks: [
      { type: 'nav-link', settings: { label: 'Home', url: '/' } },
      { type: 'nav-link', settings: { label: 'Products', url: '/products' } },
      { type: 'nav-link', settings: { label: 'Services', url: '/service' } },
      { type: 'nav-link', settings: { label: 'Contact', url: '/contact' } },
    ],
  },

  hero: {
    settings: {
      title: 'Premium Construction Materials',
      subtitle: 'Top quality — Fair prices',
      backgroundImage: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1200',
      ctaText: 'View Products',
      ctaUrl: '/products',
    },
  },

  'content-image': {
    settings: {
      imageUrl: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800',
      title: 'modern concrete + terrazzo architectural finishes',
      description:
        'pair our products together to flow seamlessly from inside to out. explore our next generation concrete and terrazzo surfaces.',
      direction: 'image-right',
      mobileOrder: 'image-first',
    },
    blocks: [
      {
        type: 'content-button',
        settings: {
          label: 'Shop Now',
          href: '/products',
          color: '#fff',
          bgColor: '#2563eb',
        },
      },
    ],
  },

  collections: {
    settings: {
      overline: 'collections',
      title: 'products',
      titleAccent: 'featured',
      description:
        'each product line is handcrafted with strict quality control from raw materials to finished goods.',
      cardLinkLabel: 'view details',
    },
    blocks: [
      {
        type: 'product-card',
        settings: {
          name: 'Garden Pavers',
          slug: 'gach-lat',
          desc: 'Anti-slip surface, high load-bearing capacity, ideal for walkways and outdoor gardens.',
          specs: '400×400mm  ·  50mm thick',
          color: 'from-amber-800/80 to-amber-900/90',
          image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=600',
        },
      },
      {
        type: 'product-card',
        settings: {
          name: 'Granite Stone',
          slug: 'da-granite',
          desc: 'Precision-cut natural stone with honed or polished finish to order.',
          specs: '600×300mm  ·  20mm thick',
          color: 'from-stone-600/80 to-stone-800/90',
          image: 'https://images.unsplash.com/photo-1607434472257-d9f8e57a643d?w=600',
        },
      },
      {
        type: 'product-card',
        settings: {
          name: 'Terrazzo',
          slug: 'terrazzo',
          desc: 'A blend of marble, granite, and cement — every tile is a work of art.',
          specs: '400×400mm  ·  30mm thick',
          color: 'from-rose-800/70 to-stone-800/90',
          image: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=600',
        },
      },
    ],
  },

  about: {
    settings: {
      overline: 'about us',
      title: 'our',
      titleAccent: 'commitment',
      description:
        'With over 10 years of experience in the construction materials industry, we take pride in delivering the highest quality products.',
    },
    blocks: [
      { type: 'stat', settings: { value: '10+', label: 'Years of experience' } },
      { type: 'stat', settings: { value: '1000+', label: 'Projects completed' } },
      { type: 'stat', settings: { value: '500+', label: 'Happy customers' } },
      { type: 'stat', settings: { value: '50+', label: 'Trusted partners' } },
    ],
  },

  featured: {
    settings: {
      overline: 'why choose us',
      title: 'key',
      titleAccent: 'advantages',
    },
    blocks: [
      {
        type: 'feature-card',
        settings: {
          icon: '✓',
          title: 'High Quality',
          description: 'Products meet international standards with rigorous quality testing.',
        },
      },
      {
        type: 'feature-card',
        settings: {
          icon: '⚡',
          title: 'Fast Delivery',
          description: 'Nationwide shipping with guaranteed on-time delivery.',
        },
      },
      {
        type: 'feature-card',
        settings: {
          icon: '💰',
          title: 'Fair Prices',
          description: 'Factory-direct pricing with no middlemen.',
        },
      },
      {
        type: 'feature-card',
        settings: {
          icon: '🛠️',
          title: 'Dedicated Support',
          description: 'Free technical consultation and 24/7 support.',
        },
      },
    ],
  },

  'material-showcase': {
    settings: {
      title: 'Material Types',
      subtitle: 'Choose the material that fits your needs',
    },
    blocks: [
      {
        type: 'variant-item',
        settings: {
          name: 'Tile 40x40',
          image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400',
          price: '250,000đ',
          description: 'Size: 400x400x50mm',
        },
      },
      {
        type: 'variant-item',
        settings: {
          name: 'Tile 50x50',
          image: 'https://images.unsplash.com/photo-1607434472257-d9f8e57a643d?w=400',
          price: '350,000đ',
          description: 'Size: 500x500x50mm',
        },
      },
      {
        type: 'variant-item',
        settings: {
          name: 'Tile 60x30',
          image: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=400',
          price: '280,000đ',
          description: 'Size: 600x300x50mm',
        },
      },
    ],
  },

  'color-picker': {
    settings: {
      title: 'Choose Color',
      subtitle: 'A wide range of colors to match every style',
    },
    blocks: [
      { type: 'color-swatch', settings: { name: 'Stone Gray', hex: '#808080', image: '' } },
      { type: 'color-swatch', settings: { name: 'Light Beige', hex: '#d4c5b9', image: '' } },
      { type: 'color-swatch', settings: { name: 'Charcoal Black', hex: '#2d2d2d', image: '' } },
      { type: 'color-swatch', settings: { name: 'Wood Brown', hex: '#8b4513', image: '' } },
      { type: 'color-swatch', settings: { name: 'Ivory White', hex: '#fffff0', image: '' } },
      { type: 'color-swatch', settings: { name: 'Moss Green', hex: '#556b2f', image: '' } },
    ],
  },

  'service-process': {
    settings: {
      overline: 'our',
      title: 'work',
      titleAccent: 'process',
      description: 'A simple, transparent 4-step process',
    },
    blocks: [
      {
        type: 'process-step',
        settings: {
          step: '01',
          title: 'Consultation',
          description: 'On-site survey and tailored solution consulting',
        },
      },
      {
        type: 'process-step',
        settings: {
          step: '02',
          title: 'Quotation',
          description: 'Detailed and transparent pricing',
        },
      },
      {
        type: 'process-step',
        settings: {
          step: '03',
          title: 'Construction',
          description: 'Professional construction team, on schedule',
        },
      },
      {
        type: 'process-step',
        settings: {
          step: '04',
          title: 'Handover',
          description: 'Inspection, handover, and warranty',
        },
      },
    ],
  },

  'why-choose-us-v2': {
    settings: {
      title: 'Why Choose Us?',
      description:
        'We are committed to bringing you the best products and services at the most competitive prices.',
    },
  },

  contact: {
    settings: {
      overline: 'contact',
      title: 'get in',
      titleAccent: 'touch',
      description: 'Reach out to us for a detailed consultation',
      formTitle: 'Send a message',
    },
    blocks: [
      {
        type: 'contact-info',
        settings: {
          icon: '📞',
          label: 'Phone',
          value: '0123 456 789',
          link: 'tel:0123456789',
        },
      },
      {
        type: 'contact-info',
        settings: {
          icon: '📧',
          label: 'Email',
          value: 'info@vlxd.vn',
          link: 'mailto:info@vlxd.vn',
        },
      },
      {
        type: 'contact-info',
        settings: {
          icon: '📍',
          label: 'Address',
          value: '123 ABC Street, XYZ District, HCMC',
          link: '',
        },
      },
      {
        type: 'social-link',
        settings: {
          platform: 'facebook',
          url: 'https://facebook.com',
          icon: 'Facebook',
        },
      },
      {
        type: 'social-link',
        settings: {
          platform: 'instagram',
          url: 'https://instagram.com',
          icon: 'Instagram',
        },
      },
    ],
  },

  footer: {
    settings: {
      copyright: '© 2024 VLXD. All rights reserved.',
      tagline: 'Premium construction materials',
    },
    blocks: [
      { type: 'footer-line', settings: { text: 'About Us', url: '/about' } },
      { type: 'footer-line', settings: { text: 'Products', url: '/products' } },
      { type: 'footer-line', settings: { text: 'Contact', url: '/contact' } },
      { type: 'footer-social', settings: { platform: 'facebook', url: 'https://facebook.com' } },
      { type: 'footer-social', settings: { platform: 'instagram', url: 'https://instagram.com' } },
      { type: 'footer-social', settings: { platform: 'youtube', url: 'https://youtube.com' } },
    ],
  },

  // Component Blocks (standalone)
  'nav-link': {
    settings: {
      label: 'Home',
      url: '/',
    },
  },

  'content-button': {
    settings: {
      label: 'Learn More',
      href: '/about',
      color: '#ffffff',
      bgColor: '#2563eb',
    },
  },

  'product-card': {
    settings: {
      name: 'Sample Product',
      slug: 'sample-product',
      desc: 'This is a sample product description.',
      specs: '400×400mm  ·  50mm thick',
      color: 'from-blue-500 to-blue-700',
      image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=600',
    },
  },

  stat: {
    settings: {
      value: '100+',
      label: 'Happy Clients',
    },
  },

  'feature-card': {
    settings: {
      icon: '⭐',
      title: 'Quality Products',
      description: 'We provide only the highest quality materials.',
    },
  },

  'variant-item': {
    settings: {
      name: 'Standard Tile',
      image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400',
      price: '250,000đ',
      description: 'Size: 400x400x50mm',
    },
  },

  'color-swatch': {
    settings: {
      name: 'Gray Stone',
      hex: '#808080',
      image: '',
    },
  },

  'process-step': {
    settings: {
      step: '01',
      title: 'Consultation',
      description: 'We discuss your needs and provide expert advice.',
    },
  },

  'contact-info': {
    settings: {
      icon: '📞',
      label: 'Phone',
      value: '0123 456 789',
      link: 'tel:0123456789',
    },
  },

  'social-link': {
    settings: {
      platform: 'facebook',
      url: 'https://facebook.com',
      icon: 'Facebook',
    },
  },

  'footer-line': {
    settings: {
      text: 'About Us',
      url: '/about',
    },
  },

  'footer-social': {
    settings: {
      platform: 'facebook',
      url: 'https://facebook.com',
    },
  },
}

/**
 * Get mock data for a specific block type
 * @param {string} blockType - The type of block
 * @returns {object} Mock data for the block
 */
export function getMockDataForBlock(blockType) {
  return BLOCK_MOCK_DATA[blockType] || { settings: {}, blocks: [] }
}
