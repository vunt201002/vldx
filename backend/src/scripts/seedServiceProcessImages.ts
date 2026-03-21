import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Block from '../models/Block';
import Page from '../models/Page';
import { config } from '../config/env';
import { generatePageJson, writePageJson } from '../utils/generatePageJson';

dotenv.config();

async function seedServiceProcessImages() {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB');

    const populatedPage = await Page.findOne({ slug: 'tam-op-cau-thang' }).populate('blocks.block').lean();
    if (!populatedPage) {
      console.error('Page "tam-op-cau-thang" not found.');
      process.exit(1);
    }

    const spEntry = (populatedPage as any).blocks.find(
      (b: any) => b.block?.type === 'service-process'
    );

    if (!spEntry) {
      console.error('No service-process block found on this page.');
      process.exit(1);
    }

    const blockId = spEntry.block._id;

    await Block.findByIdAndUpdate(blockId, {
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
            image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
          },
          {
            stepNumber: '02',
            title: 'Đo đạc',
            description: 'Đo đạc chi tiết từng bậc thang, góc cạnh và kích thước chính xác để đảm bảo sản phẩm vừa khít.',
            image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600&q=80',
          },
          {
            stepNumber: '03',
            title: 'Sản xuất',
            description: 'Sản xuất tấm ốp theo đúng kích thước đo được, với chất liệu và màu sắc khách hàng đã chọn.',
            image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80',
          },
          {
            stepNumber: '04',
            title: 'Lắp đặt',
            description: 'Thi công lắp đặt tại công trình bởi thợ lành nghề, đảm bảo chất lượng và thẩm mỹ hoàn thiện.',
            image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80',
          },
        ],
      },
    });

    console.log('Updated service-process block with step images');

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

seedServiceProcessImages();
