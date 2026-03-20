import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Block from '../models/Block';
import Page from '../models/Page';
import { config } from '../config/env';
import { generatePageJson, writePageJson } from '../utils/generatePageJson';

dotenv.config();

// ─── Landing page blocks ───
const landingBlocks = [
  {
    type: 'navbar',
    name: 'Main Navigation',
    data: {
      brandName: 'bê tông',
      brandAccent: 'việt',
      ctaLabel: 'liên hệ',
      ctaHref: '#contact',
      links: [
        { label: 'sản phẩm', href: '/products' },
        { label: 'giới thiệu', href: '/about' },
        { label: 'dự án', href: '/projects' },
        { label: 'liên hệ', href: '#contact' },
      ],
    },
    settings: {
      sticky: true,
      transparent: true,
      blurOnScroll: true,
    },
  },
  {
    type: 'hero',
    name: 'Hero Banner',
    data: {
      overline: 'vật liệu xây dựng cao cấp',
      headline: 'bê tông\n& đá lát\nkiến trúc',
      subtitle:
        'gạch lát sân vườn, đá granite, terrazzo, gạch block — sản xuất thủ công tại việt nam với nguyên liệu tự nhiên hảo hạng.',
      primaryCta: { label: 'khám phá', href: '/products' },
      secondaryCta: { label: 'liên hệ', href: '#contact' },
      scrollIndicatorText: 'cuộn xuống',
    },
    settings: {
      fullHeight: true,
      showScrollIndicator: true,
      backgroundGradient: 'from-warm-800 via-warm-700 to-warm-900',
    },
  },
  {
    type: 'collections',
    name: 'Product Collections',
    data: {
      overline: 'bộ sưu tập',
      title: 'sản phẩm',
      titleAccent: 'nổi bật',
      description:
        'mỗi dòng sản phẩm được sản xuất thủ công, kiểm soát chất lượng nghiêm ngặt từ nguyên liệu đến thành phẩm.',
      cardLinkLabel: 'xem chi tiết',
      products: [
        {
          name: 'Gạch Lát Sân Vườn',
          slug: 'gach-lat',
          desc: 'Bề mặt chống trơn, chịu lực cao, phù hợp lối đi và sân vườn ngoài trời.',
          specs: '400×400mm  ·  50mm dày',
          color: 'from-amber-800/80 to-amber-900/90',
        },
        {
          name: 'Đá Granite',
          slug: 'da-granite',
          desc: 'Đá tự nhiên gia công chính xác, bề mặt mài nhám hoặc đánh bóng theo yêu cầu.',
          specs: '600×300mm  ·  20mm dày',
          color: 'from-stone-600/80 to-stone-800/90',
        },
        {
          name: 'Terrazzo',
          slug: 'terrazzo',
          desc: 'Phối trộn đá marble, granite và xi măng — mỗi viên gạch là một tác phẩm nghệ thuật.',
          specs: '400×400mm  ·  30mm dày',
          color: 'from-rose-800/70 to-stone-800/90',
        },
        {
          name: 'Gạch Block',
          slug: 'gach-block',
          desc: 'Gạch thông gió trang trí, tạo điểm nhấn kiến trúc cho tường rào và mặt tiền.',
          specs: '190×190mm  ·  90mm dày',
          color: 'from-slate-600/80 to-slate-800/90',
        },
        {
          name: 'Đá Ốp Lát',
          slug: 'da-op-lat',
          desc: 'Đá ốp tường và lát nền, vân tự nhiên, phù hợp không gian nội thất cao cấp.',
          specs: '600×600mm  ·  15mm dày',
          color: 'from-warm-500/80 to-warm-800/90',
        },
        {
          name: 'Bậc Thang & Coping',
          slug: 'bac-thang',
          desc: 'Bậc cầu thang và viền hồ bơi, bo cạnh tròn an toàn, chống trơn trượt.',
          specs: '1000×350mm  ·  40mm dày',
          color: 'from-cyan-800/70 to-slate-800/90',
        },
      ],
    },
    settings: {
      columns: 3,
      cardAspectRatio: '4/5',
    },
  },
  {
    type: 'about',
    name: 'About / Story',
    data: {
      overline: 'câu chuyện',
      title: 'nguyên liệu',
      titleAccent: 'tạo nên khác biệt',
      paragraphs: [
        'chúng tôi tin rằng mỗi viên gạch, mỗi tấm đá đều kể một câu chuyện riêng. từ những mỏ đá tự nhiên đến xưởng sản xuất thủ công, mỗi sản phẩm đều mang trong mình dấu ấn của đất, nước và bàn tay nghệ nhân việt nam.',
        'với quy trình sản xuất thân thiện môi trường và tiêu chuẩn chất lượng quốc tế, sản phẩm của chúng tôi không chỉ đẹp mà còn bền vững theo thời gian — từ sân vườn đến nội thất, từ hồ bơi đến mặt tiền công trình.',
      ],
      linkText: 'tìm hiểu thêm',
      linkHref: '#contact',
      visualLabel: 'showroom',
      visualText: 'xưởng sản xuất tại miền nam',
      stats: [
        { value: '15+', label: 'năm kinh nghiệm' },
        { value: '500+', label: 'dự án hoàn thành' },
        { value: '50+', label: 'mẫu sản phẩm' },
        { value: '100%', label: 'nguyên liệu tự nhiên' },
      ],
    },
    settings: {
      layout: 'two-column',
      showVisual: true,
    },
  },
  {
    type: 'featured',
    name: 'Why Choose Us',
    data: {
      overline: 'tại sao chọn chúng tôi',
      title: 'chất lượng',
      titleAccent: 'không thỏa hiệp',
      features: [
        {
          iconName: 'handcraft',
          title: 'Sản Xuất Thủ Công',
          desc: 'Mỗi sản phẩm được tạo ra bằng tay bởi đội ngũ nghệ nhân giàu kinh nghiệm, đảm bảo chất lượng từng chi tiết.',
        },
        {
          iconName: 'natural',
          title: 'Nguyên Liệu Tự Nhiên',
          desc: 'Đá, cát, xi măng cao cấp — 100% nguyên liệu tự nhiên, không pha tạp, thân thiện với môi trường.',
        },
        {
          iconName: 'sizes',
          title: 'Đa Dạng Kích Thước',
          desc: 'Sản xuất theo kích thước tiêu chuẩn hoặc cắt theo yêu cầu riêng của từng công trình.',
        },
        {
          iconName: 'warranty',
          title: 'Bảo Hành Dài Hạn',
          desc: 'Cam kết bảo hành sản phẩm lên đến 10 năm, đồng hành cùng mọi công trình của bạn.',
        },
      ],
    },
    settings: {
      columns: 4,
      showIcons: true,
      textAlign: 'center',
    },
  },
  {
    type: 'gallery',
    name: 'Project Gallery',
    data: {
      overline: 'dự án',
      title: 'cảm hứng',
      titleAccent: 'thiết kế',
      viewAllLabel: 'xem tất cả',
      viewAllHref: '/projects',
      items: [
        { label: 'sân vườn biệt thự', tag: 'gạch lát', gradient: 'from-amber-700 to-stone-700', aspect: 'row-span-2' },
        { label: 'bếp terrazzo', tag: 'terrazzo', gradient: 'from-stone-500 to-stone-700', aspect: '' },
        { label: 'hồ bơi resort', tag: 'coping', gradient: 'from-rose-700 to-stone-800', aspect: '' },
        { label: 'tường rào breeze block', tag: 'gạch block', gradient: 'from-slate-500 to-slate-700', aspect: '' },
        { label: 'nội thất cao cấp', tag: 'đá ốp', gradient: 'from-warm-500 to-warm-700', aspect: 'row-span-2' },
        { label: 'lối đi công viên', tag: 'đá granite', gradient: 'from-cyan-700 to-slate-700', aspect: '' },
      ],
    },
    settings: {
      columns: 3,
      rowHeight: 250,
      showHoverEffect: true,
    },
  },
  {
    type: 'contact',
    name: 'Contact & Footer',
    data: {
      overline: 'liên hệ',
      title: 'bắt đầu dự án',
      titleAccent: 'của bạn',
      description:
        'liên hệ ngay để được tư vấn miễn phí về vật liệu phù hợp cho công trình. đội ngũ chuyên gia sẵn sàng hỗ trợ bạn từ thiết kế đến thi công.',
      formSubmitLabel: 'gửi yêu cầu tư vấn',
      footerBrand: 'bê tông việt',
      footerBrandAccent: 'việt',
      footerCopyright: '© 2026 bê tông việt. thiết kế tại việt nam.',
      contactInfos: [
        { iconName: 'phone', label: 'hotline', value: '1900 xxxx xx' },
        { iconName: 'email', label: 'email', value: 'info@betongviet.vn' },
        { iconName: 'location', label: 'showroom', value: 'TP. Hồ Chí Minh', detail: 'Thứ 2 – Thứ 7: 8:00 – 17:30' },
      ],
      socialLinks: [
        { label: 'facebook', href: '#' },
        { label: 'instagram', href: '#' },
        { label: 'zalo', href: '#' },
      ],
    },
    settings: {
      showForm: true,
      showFooter: true,
    },
  },
];

// ─── Products page blocks ───
const productsBlocks = [
  {
    type: 'navbar',
    name: 'Navigation',
    data: {
      brandName: 'bê tông',
      brandAccent: 'việt',
      ctaLabel: 'liên hệ',
      ctaHref: '/landing#contact',
      links: [
        { label: 'trang chủ', href: '/landing' },
        { label: 'sản phẩm', href: '/products' },
        { label: 'giới thiệu', href: '/about' },
        { label: 'dự án', href: '/projects' },
      ],
    },
    settings: { sticky: true, transparent: false },
  },
  {
    type: 'hero',
    name: 'Products Hero',
    data: {
      overline: 'bộ sưu tập đầy đủ',
      headline: 'tất cả\nsản phẩm',
      subtitle: 'khám phá toàn bộ dòng sản phẩm vật liệu xây dựng cao cấp — gạch lát, đá granite, terrazzo, gạch block và nhiều hơn nữa.',
      primaryCta: { label: 'liên hệ báo giá', href: '/landing#contact' },
      secondaryCta: { label: '', href: '' },
      scrollIndicatorText: '',
    },
    settings: {
      fullHeight: false,
      showScrollIndicator: false,
      backgroundGradient: 'from-stone-700 via-stone-600 to-stone-800',
    },
  },
  {
    type: 'collections',
    name: 'All Products',
    data: {
      overline: '',
      title: 'danh mục',
      titleAccent: 'sản phẩm',
      description: '',
      cardLinkLabel: 'xem chi tiết',
      products: [
        {
          name: 'Gạch Lát Sân Vườn',
          slug: 'gach-lat',
          desc: 'Bề mặt chống trơn, chịu lực cao, phù hợp lối đi và sân vườn ngoài trời.',
          specs: '400×400mm  ·  50mm dày',
          color: 'from-amber-800/80 to-amber-900/90',
        },
        {
          name: 'Đá Granite',
          slug: 'da-granite',
          desc: 'Đá tự nhiên gia công chính xác, bề mặt mài nhám hoặc đánh bóng theo yêu cầu.',
          specs: '600×300mm  ·  20mm dày',
          color: 'from-stone-600/80 to-stone-800/90',
        },
        {
          name: 'Terrazzo',
          slug: 'terrazzo',
          desc: 'Phối trộn đá marble, granite và xi măng — mỗi viên gạch là một tác phẩm nghệ thuật.',
          specs: '400×400mm  ·  30mm dày',
          color: 'from-rose-800/70 to-stone-800/90',
        },
        {
          name: 'Gạch Block',
          slug: 'gach-block',
          desc: 'Gạch thông gió trang trí, tạo điểm nhấn kiến trúc cho tường rào và mặt tiền.',
          specs: '190×190mm  ·  90mm dày',
          color: 'from-slate-600/80 to-slate-800/90',
        },
        {
          name: 'Đá Ốp Lát',
          slug: 'da-op-lat',
          desc: 'Đá ốp tường và lát nền, vân tự nhiên, phù hợp không gian nội thất cao cấp.',
          specs: '600×600mm  ·  15mm dày',
          color: 'from-warm-500/80 to-warm-800/90',
        },
        {
          name: 'Bậc Thang & Coping',
          slug: 'bac-thang',
          desc: 'Bậc cầu thang và viền hồ bơi, bo cạnh tròn an toàn, chống trơn trượt.',
          specs: '1000×350mm  ·  40mm dày',
          color: 'from-cyan-800/70 to-slate-800/90',
        },
      ],
    },
    settings: { columns: 3, cardAspectRatio: '4/5' },
  },
  {
    type: 'contact',
    name: 'Footer',
    data: {
      overline: 'liên hệ',
      title: 'báo giá',
      titleAccent: 'ngay',
      description: 'liên hệ để nhận báo giá chi tiết cho từng dòng sản phẩm.',
      formSubmitLabel: 'gửi yêu cầu',
      footerBrand: 'bê tông việt',
      footerBrandAccent: 'việt',
      footerCopyright: '© 2026 bê tông việt. thiết kế tại việt nam.',
      contactInfos: [
        { iconName: 'phone', label: 'hotline', value: '1900 xxxx xx' },
        { iconName: 'email', label: 'email', value: 'info@betongviet.vn' },
      ],
      socialLinks: [
        { label: 'facebook', href: '#' },
        { label: 'zalo', href: '#' },
      ],
    },
    settings: { showForm: true, showFooter: true },
  },
];

// ─── About page blocks ───
const aboutBlocks = [
  {
    type: 'navbar',
    name: 'Navigation',
    data: {
      brandName: 'bê tông',
      brandAccent: 'việt',
      ctaLabel: 'liên hệ',
      ctaHref: '/landing#contact',
      links: [
        { label: 'trang chủ', href: '/landing' },
        { label: 'sản phẩm', href: '/products' },
        { label: 'giới thiệu', href: '/about' },
        { label: 'dự án', href: '/projects' },
      ],
    },
    settings: { sticky: true, transparent: false },
  },
  {
    type: 'hero',
    name: 'About Hero',
    data: {
      overline: 'về chúng tôi',
      headline: 'câu chuyện\nbê tông việt',
      subtitle: 'từ xưởng sản xuất nhỏ tại miền nam đến thương hiệu vật liệu xây dựng cao cấp — hành trình 15 năm kiên trì với chất lượng.',
      primaryCta: { label: 'xem sản phẩm', href: '/products' },
      secondaryCta: { label: '', href: '' },
      scrollIndicatorText: '',
    },
    settings: {
      fullHeight: false,
      showScrollIndicator: false,
      backgroundGradient: 'from-amber-800 via-amber-700 to-stone-800',
    },
  },
  {
    type: 'about',
    name: 'Our Story',
    data: {
      overline: 'câu chuyện',
      title: 'nguyên liệu',
      titleAccent: 'tạo nên khác biệt',
      paragraphs: [
        'chúng tôi tin rằng mỗi viên gạch, mỗi tấm đá đều kể một câu chuyện riêng. từ những mỏ đá tự nhiên đến xưởng sản xuất thủ công, mỗi sản phẩm đều mang trong mình dấu ấn của đất, nước và bàn tay nghệ nhân việt nam.',
        'với quy trình sản xuất thân thiện môi trường và tiêu chuẩn chất lượng quốc tế, sản phẩm của chúng tôi không chỉ đẹp mà còn bền vững theo thời gian — từ sân vườn đến nội thất, từ hồ bơi đến mặt tiền công trình.',
      ],
      linkText: 'liên hệ ngay',
      linkHref: '/landing#contact',
      visualLabel: 'showroom',
      visualText: 'xưởng sản xuất tại miền nam',
      stats: [
        { value: '15+', label: 'năm kinh nghiệm' },
        { value: '500+', label: 'dự án hoàn thành' },
        { value: '50+', label: 'mẫu sản phẩm' },
        { value: '100%', label: 'nguyên liệu tự nhiên' },
      ],
    },
    settings: { layout: 'two-column', showVisual: true },
  },
  {
    type: 'featured',
    name: 'Why Choose Us',
    data: {
      overline: 'giá trị cốt lõi',
      title: 'tại sao',
      titleAccent: 'chọn chúng tôi',
      features: [
        {
          iconName: 'handcraft',
          title: 'Sản Xuất Thủ Công',
          desc: 'Mỗi sản phẩm được tạo ra bằng tay bởi đội ngũ nghệ nhân giàu kinh nghiệm.',
        },
        {
          iconName: 'natural',
          title: 'Nguyên Liệu Tự Nhiên',
          desc: '100% nguyên liệu tự nhiên, không pha tạp, thân thiện với môi trường.',
        },
        {
          iconName: 'sizes',
          title: 'Đa Dạng Kích Thước',
          desc: 'Sản xuất theo kích thước tiêu chuẩn hoặc cắt theo yêu cầu riêng.',
        },
        {
          iconName: 'warranty',
          title: 'Bảo Hành Dài Hạn',
          desc: 'Cam kết bảo hành sản phẩm lên đến 10 năm.',
        },
      ],
    },
    settings: { columns: 4, showIcons: true, textAlign: 'center' },
  },
  {
    type: 'contact',
    name: 'Footer',
    data: {
      overline: 'liên hệ',
      title: 'bắt đầu dự án',
      titleAccent: 'của bạn',
      description: 'liên hệ ngay để được tư vấn miễn phí.',
      formSubmitLabel: 'gửi yêu cầu tư vấn',
      footerBrand: 'bê tông việt',
      footerBrandAccent: 'việt',
      footerCopyright: '© 2026 bê tông việt. thiết kế tại việt nam.',
      contactInfos: [
        { iconName: 'phone', label: 'hotline', value: '1900 xxxx xx' },
        { iconName: 'email', label: 'email', value: 'info@betongviet.vn' },
        { iconName: 'location', label: 'showroom', value: 'TP. Hồ Chí Minh', detail: 'Thứ 2 – Thứ 7: 8:00 – 17:30' },
      ],
      socialLinks: [
        { label: 'facebook', href: '#' },
        { label: 'instagram', href: '#' },
        { label: 'zalo', href: '#' },
      ],
    },
    settings: { showForm: true, showFooter: true },
  },
];

// ─── Page definitions ───
const pages = [
  {
    slug: 'landing',
    title: 'Bê Tông Việt — Vật Liệu Xây Dựng Cao Cấp',
    description: 'Gạch lát sân vườn, đá granite, terrazzo, gạch block — sản xuất thủ công tại Việt Nam với nguyên liệu tự nhiên hảo hạng.',
    bodyClass: 'font-body bg-cream text-charcoal',
    blocks: landingBlocks,
  },
  {
    slug: 'products',
    title: 'Sản Phẩm — Bê Tông Việt',
    description: 'Khám phá toàn bộ dòng sản phẩm vật liệu xây dựng cao cấp.',
    bodyClass: 'font-body bg-cream text-charcoal',
    blocks: productsBlocks,
  },
  {
    slug: 'about',
    title: 'Giới Thiệu — Bê Tông Việt',
    description: 'Câu chuyện 15 năm kiên trì với chất lượng vật liệu xây dựng.',
    bodyClass: 'font-body bg-cream text-charcoal',
    blocks: aboutBlocks,
  },
];

async function seedBlocks() {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB');

    await Block.deleteMany({});
    await Page.deleteMany({});
    console.log('Cleared existing blocks and pages');

    for (const pageDef of pages) {
      const createdBlocks = await Block.insertMany(pageDef.blocks);
      console.log(`\nInserted ${createdBlocks.length} blocks for "${pageDef.slug}":`);
      createdBlocks.forEach((b) => console.log(`  - ${b.type}: ${b.name}`));

      const page = await Page.create({
        slug: pageDef.slug,
        title: pageDef.title,
        description: pageDef.description,
        bodyClass: pageDef.bodyClass,
        blocks: createdBlocks.map((block, index) => ({
          block: block._id,
          order: index,
        })),
        isPublished: true,
      });

      // Generate JSON file
      const populated = await Page.findById(page._id).populate('blocks.block').lean();
      if (populated) {
        const json = generatePageJson(populated as any);
        writePageJson(pageDef.slug, json);
        console.log(`  → Generated ${pageDef.slug}.json`);
      }

      console.log(`  Created page: "${page.title}" (/${page.slug}, ${page.blocks.length} blocks)`);
    }

    await mongoose.disconnect();
    console.log('\nDone! Seeded', pages.length, 'pages.');
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seedBlocks();
