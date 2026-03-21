import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Block from '../models/Block';
import Page from '../models/Page';
import { config } from '../config/env';
import { generatePageJson, writePageJson } from '../utils/generatePageJson';

dotenv.config();

async function seedShowcase() {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB');

    const page = await Page.findOne({ slug: 'tam-op-cau-thang' });
    if (!page) {
      console.error('Page "tam-op-cau-thang" not found. Create it first.');
      process.exit(1);
    }

    // Find the material-showcase block in this page
    const populatedPage = await Page.findOne({ slug: 'tam-op-cau-thang' }).populate('blocks.block').lean();
    const showcaseEntry = (populatedPage as any).blocks.find(
      (b: any) => b.block?.type === 'material-showcase'
    );

    if (!showcaseEntry) {
      console.error('No material-showcase block found on this page. Add one first via the API.');
      process.exit(1);
    }

    const blockId = showcaseEntry.block._id;

    // Update with sample data
    await Block.findByIdAndUpdate(blockId, {
      name: 'Bộ Sưu Tập Tấm Ốp',
      data: {
        overline: 'tấm ốp cầu thang',
        title: 'chọn',
        titleAccent: 'bề mặt hoàn thiện',
        description: 'Khám phá các tùy chọn màu sắc và hoa văn cho tấm ốp cầu thang. Mỗi mẫu được sản xuất thủ công với nguyên liệu tự nhiên cao cấp.',
        previewPosition: 'left',
        previewAspect: '4/3',
        thumbnailColumns: '4',
        showSpecs: true,
        bgColor: '#F5F0EB',
        variants: [
          {
            name: 'Terrazzo Xám Tro',
            image: 'https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/1584991447258-2VEIRTCVITYYRJTHXUQX/lightimage1.png',
            description: 'Bề mặt terrazzo với sỏi đá marble trắng trên nền xi măng xám. Phù hợp không gian hiện đại, tối giản.',
            specs: '400×1200mm  |  30mm dày  |  Chống trơn R10',
            tag: 'bán chạy',
          },
          {
            name: 'Đá Granite Đen',
            image: 'https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/1584995197950-UYLNPKVCU97K7XBL8GHF/Broken-Terrazo.png',
            description: 'Granite tự nhiên đen tuyền, đánh bóng bề mặt. Sang trọng và bền bỉ theo thời gian.',
            specs: '400×1200mm  |  20mm dày  |  Chống trơn R9',
            tag: '',
          },
          {
            name: 'Terrazzo Hồng Pastel',
            image: 'https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/1743025520859-CDDVYDM76QGKBGKKLP26/HomeButtonCounter.jpg',
            description: 'Terrazzo tông hồng nhẹ nhàng với đá marble và sỏi tự nhiên. Tạo điểm nhấn ấm áp cho cầu thang.',
            specs: '400×1200mm  |  30mm dày  |  Chống trơn R10',
            tag: 'mới',
          },
          {
            name: 'Xi Măng Mài Trắng',
            image: 'https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/1677095895920-WEGBWB5BULA4K93STQCX/HomeButtonTerrazzoTiles.jpg',
            description: 'Xi măng trắng mài mịn, bề mặt đồng nhất. Lựa chọn cổ điển cho mọi phong cách kiến trúc.',
            specs: '400×1200mm  |  25mm dày  |  Chống trơn R11',
            tag: '',
          },
          {
            name: 'Terrazzo Đa Sắc',
            image: 'https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/1677095329566-JRE132A0I29OPQ9AMZ9G/HomeButtonPatt.jpg',
            description: 'Phối trộn đá tự nhiên nhiều màu trên nền xi măng xám nhạt. Mỗi viên là một tác phẩm nghệ thuật.',
            specs: '400×1200mm  |  30mm dày  |  Chống trơn R10',
            tag: '',
          },
          {
            name: 'Bê Tông Xám Đậm',
            image: 'https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/1743024077224-XU7XQ8C0RH7OUZ20CQJ7/HomeButtonConcrete.jpg',
            description: 'Bê tông nguyên bản màu xám đậm, bề mặt mộc mạc tự nhiên. Phong cách công nghiệp đương đại.',
            specs: '400×1200mm  |  35mm dày  |  Chống trơn R12',
            tag: '',
          },
        ],
      },
    });

    console.log('Updated material-showcase block with 6 variants');

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

seedShowcase();
