/**
 * Seed: Service Page V2 — "Thi Cong Truc Tiep" page improvement
 *
 * 1. Updates content-image block with Vietnamese service content
 * 2. Creates new Collections block for project gallery
 * 3. Creates new StatsBar block
 * 4. Creates new CtaBanner block
 * 5. Reorders the page: hero → content-image → why-choose-us → collections → stats-bar → cta-banner
 * 6. Removes service-process from the page order
 *
 * Run: npm run seed:service-page-v2
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Block from '../models/Block';
import Page from '../models/Page';
import { config } from '../config/env';
import { regenerateAllPageJsons } from '../utils/syncPageJsons';

dotenv.config();

async function seedServicePageV2() {
  await mongoose.connect(config.mongodbUri);
  console.log('Connected to MongoDB\n');

  // ─── Find the service page ───
  const page = await Page.findOne({ slug: 'service' });
  if (!page) {
    console.error('Service page not found!');
    await mongoose.disconnect();
    return;
  }
  console.log(`Found service page: ${page._id}\n`);

  // ─── Known block IDs on current service page ───
  const HERO_ID = '69be5516315aac49a5e9be3e';
  const SERVICE_PROCESS_ID = '69c6b5c24c5b95f3b1ab93ed';
  const WHY_CHOOSE_US_ID = '69c6b1ad951275f6c3356a6e';
  const CONTENT_IMAGE_ID = '69c6b5c24c5b95f3b1ab93f0';

  // ─── Step 1: Update content-image block with Vietnamese service content ───
  console.log('Step 1: Updating content-image block...');
  const contentImageBlock = await Block.findById(CONTENT_IMAGE_ID);
  if (contentImageBlock) {
    contentImageBlock.data = {
      ...contentImageBlock.data,
      squarePosition: 'left',
      rectImageOrder: 'top',
      overline: 'tại sao cần thi công trực tiếp?',
      title: 'Mỗi công trình đều có',
      titleAccent: 'yêu cầu riêng',
      description: 'Với những dự án lớn, phức tạp hoặc có thiết kế đặc biệt, sản phẩm có sẵn không thể đáp ứng. Bạn cần một đội ngũ chuyên nghiệp đến tận nơi — khảo sát thực tế, đo đạc chính xác, và sản xuất sản phẩm vừa với từng chi tiết của công trình.',
      squareImages: [
        { url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80', alt: 'Khảo sát công trình' },
      ],
      rectImageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      rectImageAlt: 'Công trình hoàn thiện',
      bgColor: '',
      sectionPadding: '5rem 0',
      maxWidth: '1200px',
    };
    contentImageBlock.name = 'Tại sao cần thi công trực tiếp';
    contentImageBlock.markModified('data');
    await contentImageBlock.save();
    console.log('  ✓ content-image updated\n');
  }

  // ─── Step 2: Create Collections block (project gallery) ───
  console.log('Step 2: Creating project gallery (collections)...');
  const galleryBlock = await Block.create({
    type: 'collections',
    name: 'Công trình tiêu biểu',
    placement: 'body',
    data: {
      overline: 'dự án đã thực hiện',
      title: 'Công trình tiêu biểu',
      description: 'Một số dự án thi công trực tiếp tiêu biểu của chúng tôi, từ cầu thang terrazzo đến sân vườn bê tông.',
      cardLinkLabel: 'Xem chi tiết',
      bgColor: '#F5F6F0',
      products: [
        {
          name: 'Villa Thảo Điền',
          desc: 'Thi công tấm ốp cầu thang terrazzo cho biệt thự 3 tầng, 24 bậc thang. Sử dụng đá marble trắng trên nền xi măng xám.',
          specs: 'Cầu thang terrazzo · 3 tầng',
          images: [
            { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80' },
            { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80' },
            { url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80' },
          ],
        },
        {
          name: 'Khu đô thị Phú Mỹ Hưng',
          desc: 'Sản xuất và lắp đặt ghế đá công viên theo thiết kế riêng cho khu đô thị. 50 ghế đá với 3 kiểu dáng khác nhau.',
          specs: 'Ghế đá công viên · 50 sản phẩm',
          images: [
            { url: 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80' },
            { url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80' },
            { url: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80' },
          ],
        },
        {
          name: 'Nhà hàng Riverside',
          desc: 'Thi công gạch ốp lát và bàn đá terrazzo cho nhà hàng ven sông. Kết hợp gạch encaustic và terrazzo tông ấm.',
          specs: 'Gạch ốp lát + Bàn đá · 200m²',
          images: [
            { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80' },
            { url: 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80' },
            { url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80' },
          ],
        },
      ],
    },
  });
  console.log(`  ✓ Collections block created: ${galleryBlock._id}\n`);

  // ─── Step 3: Create StatsBar block ───
  console.log('Step 3: Creating stats bar...');
  const statsBlock = await Block.create({
    type: 'stats-bar',
    name: 'Thống kê dịch vụ',
    placement: 'body',
    data: {
      overline: 'con số ấn tượng',
      bgColor: '#9B997B',
      stats: [
        { icon: 'building', number: '150+', label: 'Công trình đã thi công' },
        { icon: 'clock', number: '10+', label: 'Năm kinh nghiệm' },
        { icon: 'star', number: '98%', label: 'Khách hàng hài lòng' },
        { icon: 'phone', number: '24h', label: 'Phản hồi yêu cầu' },
      ],
    },
  });
  console.log(`  ✓ StatsBar block created: ${statsBlock._id}\n`);

  // ─── Step 4: Create CtaBanner block ───
  console.log('Step 4: Creating CTA banner...');
  const ctaBlock = await Block.create({
    type: 'cta-banner',
    name: 'CTA Liên hệ tư vấn',
    placement: 'body',
    data: {
      overline: 'bắt đầu dự án',
      title: 'Sẵn sàng bắt đầu dự án của bạn?',
      subtitle: 'Liên hệ ngay để được tư vấn miễn phí và hẹn lịch khảo sát công trình. Đội ngũ kỹ thuật của chúng tôi sẵn sàng phục vụ.',
      ctaLabel: 'Liên hệ tư vấn',
      ctaHref: '/landing#contact',
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      imageAlt: 'Công trình hoàn thiện',
      bgColor: '#EDF0E4',
    },
  });
  console.log(`  ✓ CtaBanner block created: ${ctaBlock._id}\n`);

  // ─── Step 5: Reorder page blocks ───
  console.log('Step 5: Reordering page blocks...');

  // New order: hero → content-image → why-choose-us → collections → stats-bar → cta-banner
  // Remove: service-process
  const newBlocks = [
    { block: new mongoose.Types.ObjectId(HERO_ID), order: 0 },
    { block: new mongoose.Types.ObjectId(CONTENT_IMAGE_ID), order: 1 },
    { block: new mongoose.Types.ObjectId(WHY_CHOOSE_US_ID), order: 2 },
    { block: galleryBlock._id, order: 3 },
    { block: statsBlock._id, order: 4 },
    { block: ctaBlock._id, order: 5 },
  ];

  page.blocks = newBlocks as any;
  await page.save();
  console.log('  ✓ Page blocks reordered\n');
  console.log('  New order:');
  console.log('    0: hero');
  console.log('    1: content-image (why need)');
  console.log('    2: why-choose-us');
  console.log('    3: collections (project gallery)');
  console.log('    4: stats-bar');
  console.log('    5: cta-banner');
  console.log(`  Removed: service-process (${SERVICE_PROCESS_ID})\n`);

  // ─── Step 6: Regenerate JSON ───
  console.log('Step 6: Regenerating page JSON files...');
  await regenerateAllPageJsons();

  await mongoose.disconnect();
  console.log('\nDone! Restart your frontend to see the changes.');
}

seedServicePageV2().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
