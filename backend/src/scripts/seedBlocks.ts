import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Block from '../models/Block';
import Page from '../models/Page';
import { config } from '../config/env';

dotenv.config();

const blocks = [
  {
    type: 'navbar',
    name: 'Main Navigation',
    data: {
      brandName: 'bê tông',
      brandAccent: 'việt',
      ctaLabel: 'liên hệ',
      ctaHref: '#contact',
      links: [
        { label: 'gạch lát', href: '#collections' },
        { label: 'đá granite', href: '#collections' },
        { label: 'terrazzo', href: '#collections' },
        { label: 'gạch block', href: '#collections' },
        { label: 'đá ốp lát', href: '#collections' },
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
      primaryCta: { label: 'khám phá', href: '#collections' },
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
      viewAllHref: '/materials',
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

async function seedBlocks() {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB');

    // Clear existing blocks and pages
    await Block.deleteMany({});
    await Page.deleteMany({});
    console.log('Cleared existing blocks and pages');

    // Insert blocks
    const createdBlocks = await Block.insertMany(blocks);
    console.log(`Inserted ${createdBlocks.length} blocks:`);
    createdBlocks.forEach((b) => console.log(`  - ${b.type}: ${b.name} (${b._id})`));

    // Create landing page with blocks in order
    const landingPage = await Page.create({
      slug: 'landing',
      title: 'Bê Tông Việt — Vật Liệu Xây Dựng Cao Cấp',
      description:
        'Gạch lát sân vườn, đá granite, terrazzo, gạch block — sản xuất thủ công tại Việt Nam với nguyên liệu tự nhiên hảo hạng.',
      bodyClass: 'font-body bg-cream text-charcoal',
      blocks: createdBlocks.map((block, index) => ({
        block: block._id,
        order: index,
      })),
      isPublished: true,
    });

    console.log(`\nCreated page: "${landingPage.title}" (slug: ${landingPage.slug})`);
    console.log(`  Blocks: ${landingPage.blocks.length}`);

    await mongoose.disconnect();
    console.log('\nDone!');
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seedBlocks();
