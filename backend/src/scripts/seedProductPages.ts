import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Block from '../models/Block';
import Page from '../models/Page';
import { config } from '../config/env';
import { generatePageJson, writePageJson } from '../utils/generatePageJson';

dotenv.config();

// Shared navbar + footer data reused across all three pages
const navbarData = {
  brandMode: 'logo',
  brandName: 'bê tông',
  brandAccent: 'việt',
  logoUrl: 'https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/7e5836f6-d36a-4433-b2ea-89324e5191e4/black+cc+word+logo-02.png?format=500w',
  navBgColor: '#f7e2ce',
  menuFontSize: '20px',
  menuColor: '#1d1d1d',
  menuHoverColor: '#1d1d1d',
  ctaLabel: '',
  ctaHref: '',
  links: [
    { label: 'trang chủ', href: '/landing' },
    { label: 'gạch ốp lát', href: '/gach-op-lat' },
    { label: 'ghế đá công viên', href: '/ghe-da-cong-vien' },
    { label: 'bàn', href: '/ban' },
  ],
};

const footerData = {
  logoUrl: 'https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/1586821290470-46L6I4UQZEFD8HUGMOT0/bottomlogo.png',
  bgColor: '#f7e2ce',
  infoLines: [
    { text: '1.855.268.0800' },
    { text: 'sales@betongviet.vn' },
    { text: 'betongviet.vn' },
  ],
  socialLinks: [
    { label: 'facebook', icon: 'facebook', href: 'https://www.facebook.com/' },
    { label: '', icon: 'instagram', href: 'https://www.instagram.com/' },
    { label: '', icon: 'email', href: '' },
    { label: '', icon: 'zalo', href: '' },
  ],
};

// ─── gach-op-lat ───
const gachOpLatBlocks = [
  {
    type: 'navbar',
    name: 'Navigation',
    data: navbarData,
  },
  {
    type: 'hero',
    name: 'Hero',
    data: {
      imageUrl: 'https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/1585263030555-FT7UYHVSVB4889E9PK56/venturastairs.jpg',
      imageAlt: 'Gạch ốp lát cao cấp',
      imageMaxHeight: '500px',
    },
  },
  {
    type: 'material-showcase',
    name: 'Showcase Gạch Ốp Lát',
    data: {
      overline: 'gạch ốp lát',
      title: 'chọn',
      titleAccent: 'bề mặt hoàn thiện',
      description: 'Khám phá các tùy chọn màu sắc và kết cấu cho gạch ốp lát. Mỗi mẫu được sản xuất thủ công từ nguyên liệu tự nhiên cao cấp, phù hợp cho cả tường và sàn.',
      previewPosition: 'left',
      previewAspect: '4/3',
      thumbnailColumns: '4',
      showSpecs: true,
      bgColor: '#F5F0EB',
      variants: [
        {
          name: 'Terrazzo Trắng Xám',
          image: 'https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/1584991447258-2VEIRTCVITYYRJTHXUQX/lightimage1.png',
          description: 'Terrazzo nền trắng với đá marble xám nhẹ. Tạo không gian tươi sáng, hiện đại cho phòng khách và phòng tắm.',
          specs: '600×600mm  |  12mm dày  |  Chống trơn R9',
          tag: 'bán chạy',
        },
        {
          name: 'Đá Mài Granite Xám',
          image: 'https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/1584995197950-UYLNPKVCU97K7XBL8GHF/Broken-Terrazo.png',
          description: 'Granite xám tự nhiên, bề mặt mài mịn. Bền bỉ và sang trọng, phù hợp sảnh, hành lang và không gian thương mại.',
          specs: '600×300mm  |  15mm dày  |  Chống trơn R10',
          tag: '',
        },
        {
          name: 'Terrazzo Hồng San Hô',
          image: 'https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/1743025520859-CDDVYDM76QGKBGKKLP26/HomeButtonCounter.jpg',
          description: 'Terrazzo tông hồng san hô với hạt đá marble nhỏ. Điểm nhấn nổi bật cho phòng ngủ và khu vực giải trí.',
          specs: '400×400mm  |  12mm dày  |  Chống trơn R9',
          tag: 'mới',
        },
        {
          name: 'Đá Đen Tuyền',
          image: 'https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/1584991447258-2VEIRTCVITYYRJTHXUQX/lightimage1.png',
          description: 'Đá đen tự nhiên đánh bóng cao, tạo hiệu ứng phản chiếu sang trọng. Lý tưởng cho bếp, phòng tắm cao cấp.',
          specs: '600×600mm  |  15mm dày  |  Chống trơn R9',
          tag: '',
        },
      ],
    },
  },
  {
    type: 'color-picker',
    name: 'Bảng Màu Gạch Ốp Lát',
    data: {
      overline: 'bảng màu',
      title: 'Chọn Tông Màu Phù Hợp',
      description: 'Đa dạng tông màu từ trung tính đến đậm, phù hợp mọi phong cách kiến trúc nội — ngoại thất.',
      columns: '3',
      bgColor: '#ffffff',
      colors: [
        { name: 'Snow White', hex: '#F8F5F0', image: '' },
        { name: 'Alabaster', hex: '#F2EDE3', image: '' },
        { name: 'Ivory', hex: '#E8DFD0', image: '' },
        { name: 'Pearl', hex: '#D4C8B8', image: '' },
        { name: 'Quietude', hex: '#C4B8A5', image: '' },
        { name: 'Acier', hex: '#A89F91', image: '' },
        { name: 'Fossil', hex: '#8B8178', image: '' },
        { name: 'Mocha', hex: '#6B5D4E', image: '' },
        { name: 'Ebony', hex: '#3D352C', image: '' },
      ],
    },
  },
  {
    type: 'service-process',
    name: 'Quy Trình Thi Công',
    data: {
      overline: 'dịch vụ',
      title: 'thi công',
      titleAccent: 'ốp lát',
      description: 'Đội ngũ thợ lành nghề với hơn 10 năm kinh nghiệm, đảm bảo mỗi viên gạch được đặt chính xác, đường ron đều đẹp và bề mặt hoàn thiện hoàn hảo.',
      imageUrl: '',
      imageAlt: 'Thi công ốp lát chuyên nghiệp',
      ctaLabel: 'Liên hệ tư vấn',
      ctaHref: '/landing#contact',
      bgColor: '#F5F0EB',
      steps: [
        {
          stepNumber: '01',
          title: 'Tư vấn & chọn mẫu',
          description: 'Chuyên viên tư vấn đến tận nơi, đánh giá không gian và đề xuất mẫu gạch phù hợp phong cách và ngân sách.',
          image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
        },
        {
          stepNumber: '02',
          title: 'Đo đạc & lên phương án',
          description: 'Đo đạc chính xác diện tích, lên sơ đồ bố cục gạch và tính toán số lượng vật liệu cần thiết.',
          image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600&q=80',
        },
        {
          stepNumber: '03',
          title: 'Chuẩn bị bề mặt',
          description: 'Xử lý bề mặt nền, đảm bảo phẳng, sạch và đủ độ bám dính trước khi thi công.',
          image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80',
        },
        {
          stepNumber: '04',
          title: 'Ốp lát & hoàn thiện',
          description: 'Thi công ốp lát theo phương án đã thiết kế, chà ron và đánh bóng bề mặt đạt chuẩn thẩm mỹ cao nhất.',
          image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80',
        },
      ],
    },
  },
  {
    type: 'footer',
    name: 'Footer',
    data: footerData,
  },
];

// ─── ghe-da-cong-vien ───
const gheDaCongVienBlocks = [
  {
    type: 'navbar',
    name: 'Navigation',
    data: navbarData,
  },
  {
    type: 'hero',
    name: 'Hero',
    data: {
      imageUrl: 'https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/1585263030555-FT7UYHVSVB4889E9PK56/venturastairs.jpg',
      imageAlt: 'Ghế đá công viên bê tông',
      imageMaxHeight: '500px',
    },
  },
  {
    type: 'material-showcase',
    name: 'Showcase Ghế Đá Công Viên',
    data: {
      overline: 'ghế đá công viên',
      title: 'chọn',
      titleAccent: 'kiểu dáng & màu sắc',
      description: 'Bộ sưu tập ghế đá công viên đúc bê tông nguyên khối — bền vững, chịu thời tiết và mang vẻ đẹp mộc mạc tự nhiên.',
      previewPosition: 'left',
      previewAspect: '4/3',
      thumbnailColumns: '4',
      showSpecs: true,
      bgColor: '#F5F0EB',
      variants: [
        {
          name: 'Ghế Terrazzo Xám Nhẹ',
          image: 'https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/1584991447258-2VEIRTCVITYYRJTHXUQX/lightimage1.png',
          description: 'Ghế đúc bê tông terrazzo tông xám sáng, mặt ngồi mài nhẵn. Thích hợp cho công viên, sân trường và khu đô thị.',
          specs: '1200×450×450mm  |  Tải trọng 300kg  |  Chịu UV',
          tag: 'phổ biến',
        },
        {
          name: 'Ghế Bê Tông Đen Khoáng',
          image: 'https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/1584995197950-UYLNPKVCU97K7XBL8GHF/Broken-Terrazo.png',
          description: 'Ghế bê tông màu đen khoáng với kết cấu thô tự nhiên. Tạo điểm nhấn mạnh mẽ cho không gian ngoại thất hiện đại.',
          specs: '1200×450×450mm  |  Tải trọng 300kg  |  Chịu UV',
          tag: '',
        },
        {
          name: 'Ghế Terrazzo Hồng Đất',
          image: 'https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/1743025520859-CDDVYDM76QGKBGKKLP26/HomeButtonCounter.jpg',
          description: 'Ghế terrazzo tông hồng đất ấm áp, mặt ngồi mài mịn. Tô điểm sắc thái nhẹ nhàng cho khu vườn và sân thư giãn.',
          specs: '1000×420×430mm  |  Tải trọng 250kg  |  Chịu UV',
          tag: 'mới',
        },
      ],
    },
  },
  {
    type: 'color-picker',
    name: 'Bảng Màu Ghế Đá',
    data: {
      overline: 'bảng màu',
      title: 'Tông Màu Bê Tông Tự Nhiên',
      description: 'Mỗi màu sắc được pha trộn từ sắc tố khoáng tự nhiên, bền màu dưới nắng mưa và không phai theo thời gian.',
      columns: '3',
      bgColor: '#ffffff',
      colors: [
        { name: 'Natural Cream', hex: '#F0EBE0', image: '' },
        { name: 'Sand', hex: '#E2D8C8', image: '' },
        { name: 'Warm Stone', hex: '#C8BCA8', image: '' },
        { name: 'Slate Grey', hex: '#A8A098', image: '' },
        { name: 'Charcoal', hex: '#787068', image: '' },
        { name: 'Dark Ash', hex: '#585050', image: '' },
        { name: 'Terracotta', hex: '#C87858', image: '' },
        { name: 'Moss', hex: '#788068', image: '' },
        { name: 'Midnight', hex: '#303030', image: '' },
      ],
    },
  },
  {
    type: 'service-process',
    name: 'Quy Trình Sản Xuất & Lắp Đặt',
    data: {
      overline: 'dịch vụ',
      title: 'sản xuất',
      titleAccent: 'theo yêu cầu',
      description: 'Từ thiết kế đến lắp đặt hoàn chỉnh — chúng tôi sản xuất ghế đá theo kích thước, màu sắc và số lượng yêu cầu của từng dự án công viên, khu đô thị.',
      imageUrl: '',
      imageAlt: 'Sản xuất ghế đá công viên bê tông',
      ctaLabel: 'Liên hệ đặt hàng',
      ctaHref: '/landing#contact',
      bgColor: '#F5F0EB',
      steps: [
        {
          stepNumber: '01',
          title: 'Tư vấn thiết kế',
          description: 'Trao đổi về số lượng, kích thước, màu sắc và vị trí đặt ghế để đưa ra phương án phù hợp nhất.',
          image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
        },
        {
          stepNumber: '02',
          title: 'Đúc khuôn & pha màu',
          description: 'Chuẩn bị khuôn đúc, pha trộn bê tông với sắc tố khoáng theo màu đã chọn, đổ khuôn và dưỡng hộ.',
          image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600&q=80',
        },
        {
          stepNumber: '03',
          title: 'Mài & hoàn thiện',
          description: 'Tháo khuôn, mài bề mặt theo yêu cầu (thô / mịn / bóng), kiểm tra chất lượng từng sản phẩm.',
          image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80',
        },
        {
          stepNumber: '04',
          title: 'Vận chuyển & lắp đặt',
          description: 'Vận chuyển và lắp đặt tại công trình, cố định an toàn, bàn giao và hướng dẫn bảo trì.',
          image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80',
        },
      ],
    },
  },
  {
    type: 'footer',
    name: 'Footer',
    data: footerData,
  },
];

// ─── ban ───
const banBlocks = [
  {
    type: 'navbar',
    name: 'Navigation',
    data: navbarData,
  },
  {
    type: 'hero',
    name: 'Hero',
    data: {
      imageUrl: 'https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/1585263030555-FT7UYHVSVB4889E9PK56/venturastairs.jpg',
      imageAlt: 'Bàn đá bê tông ngoài trời',
      imageMaxHeight: '500px',
    },
  },
  {
    type: 'material-showcase',
    name: 'Showcase Bàn',
    data: {
      overline: 'bàn đá & bê tông',
      title: 'chọn',
      titleAccent: 'mặt bàn hoàn hảo',
      description: 'Bộ sưu tập bàn đúc bê tông và mặt đá tự nhiên — từ bàn ăn ngoài trời đến bàn cà phê hiên nhà, mỗi chiếc đều là tác phẩm thủ công bền theo thời gian.',
      previewPosition: 'left',
      previewAspect: '4/3',
      thumbnailColumns: '4',
      showSpecs: true,
      bgColor: '#F5F0EB',
      variants: [
        {
          name: 'Mặt Bàn Terrazzo Trắng',
          image: 'https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/1584991447258-2VEIRTCVITYYRJTHXUQX/lightimage1.png',
          description: 'Mặt bàn terrazzo trắng với hạt marble nhỏ, mài bóng. Chân bê tông nguyên khối. Phù hợp bàn ăn ngoài trời và hiên cafe.',
          specs: '1200×700mm  |  Dày 40mm  |  Chân 720mm',
          tag: 'bán chạy',
        },
        {
          name: 'Mặt Bàn Granite Đen',
          image: 'https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/1584995197950-UYLNPKVCU97K7XBL8GHF/Broken-Terrazo.png',
          description: 'Mặt bàn granite đen tự nhiên đánh bóng, chân bê tông xám. Sang trọng và chịu nhiệt tốt, lý tưởng cho bếp ngoài trời.',
          specs: '1000×600mm  |  Dày 30mm  |  Chân 750mm',
          tag: '',
        },
        {
          name: 'Bàn Cà Phê Terrazzo Tròn',
          image: 'https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/1743025520859-CDDVYDM76QGKBGKKLP26/HomeButtonCounter.jpg',
          description: 'Bàn cà phê tròn mặt terrazzo hồng pastel, chân bê tông đúc nguyên khối. Điểm nhấn thẩm mỹ cho ban công và khu thư giãn.',
          specs: 'Ø800mm  |  Dày 35mm  |  Cao 450mm',
          tag: 'mới',
        },
        {
          name: 'Bàn Ngoài Trời Đá Xám',
          image: 'https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/1584991447258-2VEIRTCVITYYRJTHXUQX/lightimage1.png',
          description: 'Bàn ăn ngoài trời mặt đá xám mài nhám chống trơn, chân gang đúc. Chịu mưa nắng, không cần bảo quản đặc biệt.',
          specs: '1400×800mm  |  Dày 50mm  |  Chân 720mm',
          tag: '',
        },
      ],
    },
  },
  {
    type: 'color-picker',
    name: 'Bảng Màu Bàn',
    data: {
      overline: 'bảng màu',
      title: 'Màu Sắc Mặt Bàn',
      description: 'Tùy chỉnh màu nền và hạt đá của mặt bàn terrazzo theo đúng phong cách không gian của bạn.',
      columns: '3',
      bgColor: '#ffffff',
      colors: [
        { name: 'Pure White', hex: '#F5F2ED', image: '' },
        { name: 'Linen', hex: '#EDE5D8', image: '' },
        { name: 'Blush', hex: '#E8D0C5', image: '' },
        { name: 'Sage', hex: '#C8D0C0', image: '' },
        { name: 'Clay', hex: '#C8A898', image: '' },
        { name: 'Stone', hex: '#A89888', image: '' },
        { name: 'Slate', hex: '#888880', image: '' },
        { name: 'Graphite', hex: '#585858', image: '' },
        { name: 'Noir', hex: '#282828', image: '' },
      ],
    },
  },
  {
    type: 'service-process',
    name: 'Quy Trình Đặt Hàng',
    data: {
      overline: 'dịch vụ',
      title: 'đặt hàng',
      titleAccent: 'theo kích thước',
      description: 'Mỗi chiếc bàn được sản xuất theo đơn đặt hàng — bạn chọn kích thước, màu sắc, kiểu mặt bàn và kiểu chân, chúng tôi hoàn thiện và giao tận nơi.',
      imageUrl: '',
      imageAlt: 'Sản xuất bàn đá bê tông theo yêu cầu',
      ctaLabel: 'Đặt hàng ngay',
      ctaHref: '/landing#contact',
      bgColor: '#F5F0EB',
      steps: [
        {
          stepNumber: '01',
          title: 'Chọn mẫu & kích thước',
          description: 'Tham khảo catalog và trao đổi với tư vấn viên để chọn kiểu dáng, kích thước và màu sắc phù hợp không gian.',
          image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
        },
        {
          stepNumber: '02',
          title: 'Sản xuất mặt bàn',
          description: 'Pha trộn bê tông / terrazzo theo công thức màu đã chọn, đổ khuôn, dưỡng hộ và mài bề mặt đạt độ bóng yêu cầu.',
          image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600&q=80',
        },
        {
          stepNumber: '03',
          title: 'Lắp chân & kiểm tra',
          description: 'Lắp ráp chân bàn, kiểm tra độ phẳng, cân bằng và hoàn thiện các góc cạnh an toàn.',
          image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80',
        },
        {
          stepNumber: '04',
          title: 'Giao hàng tận nơi',
          description: 'Đóng gói chắc chắn, vận chuyển cẩn thận và lắp đặt tại vị trí yêu cầu. Hướng dẫn vệ sinh và bảo quản.',
          image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80',
        },
      ],
    },
  },
  {
    type: 'footer',
    name: 'Footer',
    data: footerData,
  },
];

// ─── Page definitions ───
const pageDefs = [
  {
    slug: 'gach-op-lat',
    title: 'Gạch Ốp Lát — Bê Tông Việt',
    description: 'Gạch ốp lát terrazzo và đá tự nhiên cao cấp, sản xuất thủ công tại Việt Nam.',
    bodyClass: 'font-body bg-cream text-charcoal',
    blocks: gachOpLatBlocks,
  },
  {
    slug: 'ghe-da-cong-vien',
    title: 'Ghế Đá Công Viên — Bê Tông Việt',
    description: 'Ghế đá công viên đúc bê tông nguyên khối, bền vững và thẩm mỹ cho không gian ngoại thất.',
    bodyClass: 'font-body bg-cream text-charcoal',
    blocks: gheDaCongVienBlocks,
  },
  {
    slug: 'ban',
    title: 'Bàn Đá & Bê Tông — Bê Tông Việt',
    description: 'Bàn đúc bê tông và mặt đá tự nhiên theo yêu cầu, phù hợp nội thất và ngoại thất.',
    bodyClass: 'font-body bg-cream text-charcoal',
    blocks: banBlocks,
  },
];

async function seedProductPages() {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB');

    for (const pageDef of pageDefs) {
      const existing = await Page.findOne({ slug: pageDef.slug });
      if (existing) {
        console.log(`Page "${pageDef.slug}" already exists — skipping.`);
        continue;
      }

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

      const populated = await Page.findById(page._id).populate('blocks.block').lean();
      if (populated) {
        const json = generatePageJson(populated as any);
        writePageJson(pageDef.slug, json);
        console.log(`  → Generated ${pageDef.slug}.json`);
      }

      console.log(`  Created page: "${page.title}" (/${page.slug})`);
    }

    await mongoose.disconnect();
    console.log('\nDone!');
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seedProductPages();
