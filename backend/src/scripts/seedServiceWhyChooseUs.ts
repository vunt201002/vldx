import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Block from '../models/Block';
import Page from '../models/Page';
import { config } from '../config/env';
import { generatePageJson, writePageJson } from '../utils/generatePageJson';

dotenv.config();

const WHY_CHOOSE_DATA = {
  overline: 'Nam Thắng',
  title: 'Tại Sao Nên Chọn Chúng Tôi',
  bgColor: '',
  bgImage: '',
  steps: [
    {
      icon: '',
      iconBgColor: '#FFD580',
      title: 'Tư Vấn Tận Tâm',
      desc: 'Đội ngũ chuyên gia sẵn sàng tư vấn miễn phí, giúp bạn lựa chọn vật liệu phù hợp nhất với ngân sách và công trình.',
    },
    {
      icon: '',
      iconBgColor: '#A8E6CF',
      title: 'Giao Hàng Đúng Hẹn',
      desc: 'Cam kết giao hàng đúng tiến độ, không để công trình của bạn bị trì hoãn vì thiếu vật tư.',
    },
    {
      icon: '',
      iconBgColor: '#87CEEB',
      title: 'Hàng Chính Hãng',
      desc: '100% sản phẩm có nguồn gốc rõ ràng, chứng nhận chất lượng — không hàng giả, không hàng nhái.',
    },
    {
      icon: '',
      iconBgColor: '#F8B4C8',
      title: 'Hậu Mãi Chu Đáo',
      desc: 'Hỗ trợ sau bán hàng nhanh chóng, xử lý khiếu nại trong vòng 24 giờ, đảm bảo bạn luôn hài lòng.',
    },
  ],
};

async function seedServiceWhyChooseUs() {
  await mongoose.connect(config.mongodbUri);
  console.log('Connected to MongoDB\n');

  const page = await Page.findOne({ slug: 'service' });
  if (!page) {
    console.log('Service page not found.');
    await mongoose.disconnect();
    return;
  }

  // Idempotency: skip if a why-choose-us block already exists on this page
  const populated = await Page.findById(page._id).populate('blocks.block').lean() as any;
  const alreadyHas = populated.blocks.some((b: any) => b.block?.type === 'why-choose-us');
  if (alreadyHas) {
    console.log('Service page already has a why-choose-us block — skipping.');
    await mongoose.disconnect();
    return;
  }

  // Create the why-choose-us block
  const block = await Block.create({
    type: 'why-choose-us',
    name: 'Why Choose Us V2',
    data: WHY_CHOOSE_DATA,
  });
  console.log(`Created why-choose-us block: ${block._id}`);

  // Insert after service-process (order 2), push content-image down
  // Current order: hero(0), service-process(1), content-image(2)
  // New order:     hero(0), service-process(1), why-choose-us(2), content-image(3)
  const insertAt = 2;
  for (const entry of page.blocks) {
    if (entry.order >= insertAt) {
      entry.order += 1;
    }
  }
  page.blocks.push({ block: block._id as any, order: insertAt });
  await page.save();
  console.log(`Inserted into service page at order ${insertAt}`);

  // Regenerate service.json
  const fresh = await Page.findById(page._id).populate('blocks.block').lean();
  const json = generatePageJson(fresh as any);
  writePageJson('service', json);
  console.log('Regenerated service.json');

  await mongoose.disconnect();
  console.log('\nDone!');
}

seedServiceWhyChooseUs().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
