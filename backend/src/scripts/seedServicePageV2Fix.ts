/**
 * Fix: Replace content-image with why-install block, update hero image
 *
 * Run: npm run seed:service-page-v2-fix
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Block from '../models/Block';
import Page from '../models/Page';
import { config } from '../config/env';
import { regenerateAllPageJsons } from '../utils/syncPageJsons';

dotenv.config();

async function fix() {
  await mongoose.connect(config.mongodbUri);
  console.log('Connected to MongoDB\n');

  const page = await Page.findOne({ slug: 'service' });
  if (!page) { console.error('Service page not found!'); process.exit(1); }

  // ─── Step 1: Update hero with construction image ───
  console.log('Step 1: Updating hero image...');
  const heroBlock = await Block.findById('69be5516315aac49a5e9be3e');
  if (heroBlock) {
    heroBlock.data.imageUrl = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80';
    heroBlock.data.imageAlt = 'Thi công trực tiếp tại công trình';
    heroBlock.data.imageMaxHeight = '550px';
    heroBlock.markModified('data');
    await heroBlock.save();
    console.log('  ✓ Hero updated with construction image\n');
  }

  // ─── Step 2: Create why-install block ───
  console.log('Step 2: Creating why-install block...');
  const whyInstallBlock = await Block.create({
    type: 'why-install',
    name: 'Tại sao cần thi công trực tiếp',
    placement: 'body',
    data: {
      overline: 'tại sao cần thi công trực tiếp?',
      title: 'Mỗi công trình đều có yêu cầu riêng',
      description: 'Mỗi công trình có kích thước, địa hình và yêu cầu thẩm mỹ khác nhau. Việc đo đạc tại công trình, sản xuất theo thông số chính xác và thi công bởi đội ngũ chuyên nghiệp giúp đảm bảo chất lượng, độ bền và tính thẩm mỹ cho sản phẩm gạch ốp lát, đá terrazzo, ghế đá công viên của bạn.',
      imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
      imageAlt: 'Khảo sát công trình xây dựng',
      card1Label: 'Đo đạc chính xác',
      card2Label: 'Sản xuất theo yêu cầu',
      card3Label: 'Thi công chuyên nghiệp',
      bgColor: '',
    },
  });
  console.log(`  ✓ why-install block created: ${whyInstallBlock._id}\n`);

  // ─── Step 3: Update page order — replace content-image with why-install ───
  console.log('Step 3: Updating page order...');

  // Find current blocks on the page
  const currentBlocks = page.blocks.map((b: any) => ({
    block: b.block.toString(),
    order: b.order,
  }));
  console.log('  Current blocks:', currentBlocks.map((b: any) => b.block));

  // Replace content-image ID with why-install ID
  const CONTENT_IMAGE_ID = '69c6b5c24c5b95f3b1ab93f0';
  const newBlocks = page.blocks.map((b: any, i: number) => {
    if (b.block.toString() === CONTENT_IMAGE_ID) {
      return { block: whyInstallBlock._id, order: b.order };
    }
    return b;
  });

  page.blocks = newBlocks;
  await page.save();

  console.log('  ✓ Replaced content-image with why-install in page order\n');

  // ─── Step 4: Regenerate JSON ───
  console.log('Step 4: Regenerating page JSON files...');
  await regenerateAllPageJsons();

  await mongoose.disconnect();
  console.log('\nDone!');
}

fix().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
