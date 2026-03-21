import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Block from '../models/Block';
import Page from '../models/Page';
import { config } from '../config/env';
import { generatePageJson, writePageJson } from '../utils/generatePageJson';

dotenv.config();

async function seedServiceProcess() {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB');

    const page = await Page.findOne({ slug: 'tam-op-cau-thang' });
    if (!page) {
      console.error('Page "tam-op-cau-thang" not found.');
      process.exit(1);
    }

    // Create the service-process block
    const block = await Block.create({
      type: 'service-process',
      name: 'Thi Công Trực Tiếp',
      data: {
        overline: 'dịch vụ',
        title: 'thi công',
        titleAccent: 'trực tiếp',
        description: 'Không phải công trình nào cũng phù hợp với sản phẩm có sẵn. Với dịch vụ thi công trực tiếp, đội ngũ của chúng tôi sẽ đến tận công trình để khảo sát, đo đạc và sản xuất tấm ốp theo đúng kích thước yêu cầu — đảm bảo vừa vặn hoàn hảo cho mọi cầu thang.',
        imageUrl: '',
        imageAlt: 'Thi công tấm ốp cầu thang trực tiếp tại công trình',
        ctaLabel: 'Liên hệ tư vấn',
        ctaHref: '/landing#contact',
        bgColor: '#F5F0EB',
        steps: [
          {
            stepNumber: '01',
            title: 'Khảo sát',
            description: 'Đội ngũ đến tận công trình để đánh giá hiện trạng cầu thang, tư vấn vật liệu và phong cách phù hợp.',
          },
          {
            stepNumber: '02',
            title: 'Đo đạc',
            description: 'Đo đạc chi tiết từng bậc thang, góc cạnh và kích thước chính xác để đảm bảo sản phẩm vừa khít.',
          },
          {
            stepNumber: '03',
            title: 'Sản xuất',
            description: 'Sản xuất tấm ốp theo đúng kích thước đo được, với chất liệu và màu sắc khách hàng đã chọn.',
          },
          {
            stepNumber: '04',
            title: 'Lắp đặt',
            description: 'Thi công lắp đặt tại công trình bởi thợ lành nghề, đảm bảo chất lượng và thẩm mỹ hoàn thiện.',
          },
        ],
      },
    });

    console.log('Created service-process block:', block._id);

    // Add to page blocks (after color-picker, before footer)
    const pageDoc = await Page.findOne({ slug: 'tam-op-cau-thang' }).populate('blocks.block').lean();
    const blocks = (pageDoc as any).blocks;
    const footerIdx = blocks.findIndex((b: any) => b.block?.type === 'footer');
    const newOrder = footerIdx >= 0 ? footerIdx : blocks.length;

    // Shift footer and anything after it
    await Page.updateOne(
      { slug: 'tam-op-cau-thang' },
      {
        $push: {
          blocks: {
            $each: [{ block: block._id, order: newOrder }],
            $position: newOrder,
          },
        },
      },
    );

    // Fix order values
    const updated = await Page.findOne({ slug: 'tam-op-cau-thang' });
    if (updated) {
      updated.blocks.forEach((b: any, i: number) => {
        b.order = i;
      });
      await updated.save();
    }

    console.log(`Added service-process block at position ${newOrder}`);

    // Regenerate JSON
    const freshPage = await Page.findOne({ slug: 'tam-op-cau-thang' }).populate('blocks.block').lean();
    if (freshPage) {
      const json = generatePageJson(freshPage as any);
      writePageJson('tam-op-cau-thang', json);
      console.log('Regenerated tam-op-cau-thang.json');
    }

    await mongoose.disconnect();
    console.log('Done!');
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seedServiceProcess();
