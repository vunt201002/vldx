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
      { type: 'nav-link', settings: { label: 'Trang chủ', url: '/' } },
      { type: 'nav-link', settings: { label: 'Sản phẩm', url: '/products' } },
      { type: 'nav-link', settings: { label: 'Dịch vụ', url: '/service' } },
      { type: 'nav-link', settings: { label: 'Liên hệ', url: '/contact' } },
    ],
  },

  hero: {
    settings: {
      title: 'Vật Liệu Xây Dựng Cao Cấp',
      subtitle: 'Chất lượng hàng đầu - Giá cả hợp lý',
      backgroundImage: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1200',
      ctaText: 'Xem sản phẩm',
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
      overline: 'bộ sưu tập',
      title: 'sản phẩm',
      titleAccent: 'nổi bật',
      description:
        'mỗi dòng sản phẩm được sản xuất thủ công, kiểm soát chất lượng nghiêm ngặt từ nguyên liệu đến thành phẩm.',
      cardLinkLabel: 'xem chi tiết',
    },
    blocks: [
      {
        type: 'product-card',
        settings: {
          name: 'Gạch Lát Sân Vườn',
          slug: 'gach-lat',
          desc: 'Bề mặt chống trơn, chịu lực cao, phù hợp lối đi và sân vườn ngoài trời.',
          specs: '400×400mm  ·  50mm dày',
          color: 'from-amber-800/80 to-amber-900/90',
          image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=600',
        },
      },
      {
        type: 'product-card',
        settings: {
          name: 'Đá Granite',
          slug: 'da-granite',
          desc: 'Đá tự nhiên gia công chính xác, bề mặt mài nhám hoặc đánh bóng theo yêu cầu.',
          specs: '600×300mm  ·  20mm dày',
          color: 'from-stone-600/80 to-stone-800/90',
          image: 'https://images.unsplash.com/photo-1607434472257-d9f8e57a643d?w=600',
        },
      },
      {
        type: 'product-card',
        settings: {
          name: 'Terrazzo',
          slug: 'terrazzo',
          desc: 'Phối trộn đá marble, granite và xi măng — mỗi viên gạch là một tác phẩm nghệ thuật.',
          specs: '400×400mm  ·  30mm dày',
          color: 'from-rose-800/70 to-stone-800/90',
          image: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=600',
        },
      },
    ],
  },

  about: {
    settings: {
      overline: 'về chúng tôi',
      title: 'cam kết',
      titleAccent: 'chất lượng',
      description:
        'Với hơn 10 năm kinh nghiệm trong ngành vật liệu xây dựng, chúng tôi tự hào mang đến những sản phẩm chất lượng cao nhất.',
    },
    blocks: [
      { type: 'stat', settings: { value: '10+', label: 'Năm kinh nghiệm' } },
      { type: 'stat', settings: { value: '1000+', label: 'Dự án hoàn thành' } },
      { type: 'stat', settings: { value: '500+', label: 'Khách hàng hài lòng' } },
      { type: 'stat', settings: { value: '50+', label: 'Đối tác tin cậy' } },
    ],
  },

  featured: {
    settings: {
      overline: 'tại sao chọn chúng tôi',
      title: 'ưu điểm',
      titleAccent: 'vượt trội',
    },
    blocks: [
      {
        type: 'feature-card',
        settings: {
          icon: '✓',
          title: 'Chất lượng cao',
          description: 'Sản phẩm đạt tiêu chuẩn quốc tế, được kiểm định nghiêm ngặt.',
        },
      },
      {
        type: 'feature-card',
        settings: {
          icon: '⚡',
          title: 'Giao hàng nhanh',
          description: 'Vận chuyển toàn quốc, cam kết đúng hẹn.',
        },
      },
      {
        type: 'feature-card',
        settings: {
          icon: '💰',
          title: 'Giá cả hợp lý',
          description: 'Giá trực tiếp từ nhà máy, không qua trung gian.',
        },
      },
      {
        type: 'feature-card',
        settings: {
          icon: '🛠️',
          title: 'Hỗ trợ tận tình',
          description: 'Tư vấn kỹ thuật miễn phí, hỗ trợ 24/7.',
        },
      },
    ],
  },

  'material-showcase': {
    settings: {
      title: 'Các loại vật liệu',
      subtitle: 'Chọn loại vật liệu phù hợp với nhu cầu của bạn',
    },
    blocks: [
      {
        type: 'variant-item',
        settings: {
          name: 'Gạch 40x40',
          image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400',
          price: '250,000đ',
          description: 'Kích thước: 400x400x50mm',
        },
      },
      {
        type: 'variant-item',
        settings: {
          name: 'Gạch 50x50',
          image: 'https://images.unsplash.com/photo-1607434472257-d9f8e57a643d?w=400',
          price: '350,000đ',
          description: 'Kích thước: 500x500x50mm',
        },
      },
      {
        type: 'variant-item',
        settings: {
          name: 'Gạch 60x30',
          image: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=400',
          price: '280,000đ',
          description: 'Kích thước: 600x300x50mm',
        },
      },
    ],
  },

  'color-picker': {
    settings: {
      title: 'Chọn màu sắc',
      subtitle: 'Màu sắc đa dạng, phù hợp với mọi phong cách',
    },
    blocks: [
      { type: 'color-swatch', settings: { name: 'Xám đá', hex: '#808080', image: '' } },
      { type: 'color-swatch', settings: { name: 'Be nhạt', hex: '#d4c5b9', image: '' } },
      { type: 'color-swatch', settings: { name: 'Đen than', hex: '#2d2d2d', image: '' } },
      { type: 'color-swatch', settings: { name: 'Nâu gỗ', hex: '#8b4513', image: '' } },
      { type: 'color-swatch', settings: { name: 'Trắng ngà', hex: '#fffff0', image: '' } },
      { type: 'color-swatch', settings: { name: 'Xanh rêu', hex: '#556b2f', image: '' } },
    ],
  },

  'service-process': {
    settings: {
      overline: 'quy trình',
      title: 'làm việc',
      titleAccent: 'chuyên nghiệp',
      description: 'Quy trình 4 bước đơn giản, minh bạch',
    },
    blocks: [
      {
        type: 'process-step',
        settings: {
          step: '01',
          title: 'Tư vấn',
          description: 'Khảo sát hiện trường, tư vấn giải pháp phù hợp',
        },
      },
      {
        type: 'process-step',
        settings: {
          step: '02',
          title: 'Báo giá',
          description: 'Lập báo giá chi tiết, minh bạch',
        },
      },
      {
        type: 'process-step',
        settings: {
          step: '03',
          title: 'Thi công',
          description: 'Đội ngũ thi công chuyên nghiệp, đúng tiến độ',
        },
      },
      {
        type: 'process-step',
        settings: {
          step: '04',
          title: 'Bàn giao',
          description: 'Nghiệm thu, bàn giao và bảo hành',
        },
      },
    ],
  },

  'why-choose-us-v2': {
    settings: {
      title: 'Tại sao chọn chúng tôi?',
      description:
        'Chúng tôi cam kết mang đến cho bạn những sản phẩm và dịch vụ tốt nhất với giá cả hợp lý nhất.',
    },
  },

  contact: {
    settings: {
      overline: 'liên hệ',
      title: 'thông tin',
      titleAccent: 'liên lạc',
      description: 'Hãy liên hệ với chúng tôi để được tư vấn chi tiết',
      formTitle: 'Gửi tin nhắn',
    },
    blocks: [
      {
        type: 'contact-info',
        settings: {
          icon: '📞',
          label: 'Điện thoại',
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
          label: 'Địa chỉ',
          value: '123 Đường ABC, Quận XYZ, TP.HCM',
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
      tagline: 'Vật liệu xây dựng cao cấp',
    },
    blocks: [
      { type: 'footer-line', settings: { text: 'Về chúng tôi', url: '/about' } },
      { type: 'footer-line', settings: { text: 'Sản phẩm', url: '/products' } },
      { type: 'footer-line', settings: { text: 'Liên hệ', url: '/contact' } },
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
