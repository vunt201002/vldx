import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Block from '../models/Block';
import Page from '../models/Page';
import { config } from '../config/env';
import { generatePageJson, writePageJson } from '../utils/generatePageJson';

dotenv.config();

async function seedColorPicker() {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB');

    const populatedPage = await Page.findOne({ slug: 'tam-op-cau-thang' }).populate('blocks.block').lean();
    if (!populatedPage) {
      console.error('Page "tam-op-cau-thang" not found.');
      process.exit(1);
    }

    // Find all color-picker blocks on this page
    const cpEntries = (populatedPage as any).blocks.filter(
      (b: any) => b.block?.type === 'color-picker'
    );

    if (cpEntries.length === 0) {
      console.error('No color-picker block found on this page. Add one first via the API.');
      process.exit(1);
    }

    // Keep only the first one, remove duplicates
    if (cpEntries.length > 1) {
      const duplicateIds = cpEntries.slice(1).map((e: any) => e.block._id);
      console.log(`Found ${cpEntries.length} color-picker blocks, removing ${duplicateIds.length} duplicate(s)`);

      // Remove from page's blocks array
      await Page.updateOne(
        { slug: 'tam-op-cau-thang' },
        { $pull: { blocks: { block: { $in: duplicateIds } } } }
      );

      // Delete the duplicate Block documents
      await Block.deleteMany({ _id: { $in: duplicateIds } });
    }

    const blockId = cpEntries[0].block._id;

    await Block.findByIdAndUpdate(blockId, {
      name: 'Bảng Màu Tấm Ốp',
      data: {
        overline: 'bảng màu',
        title: 'Chọn Tông Màu Phù Hợp',
        description: 'Đa dạng tông màu từ trung tính đến đậm, phù hợp mọi phong cách kiến trúc.',
        columns: '3',
        bgColor: '#ffffff',
        colors: [
          {
            name: 'Alabaster',
            hex: '#F2EDE3',
            image: '',
          },
          {
            name: 'Ivory',
            hex: '#E8DFD0',
            image: '',
          },
          {
            name: 'Pearl',
            hex: '#D4C8B8',
            image: '',
          },
          {
            name: 'Quietude',
            hex: '#C4B8A5',
            image: '',
          },
          {
            name: 'Acier',
            hex: '#A89F91',
            image: '',
          },
          {
            name: 'Fossil',
            hex: '#8B8178',
            image: '',
          },
          {
            name: 'Mocha',
            hex: '#6B5D4E',
            image: '',
          },
          {
            name: 'Ebony',
            hex: '#3D352C',
            image: '',
          },
          {
            name: 'Millennial Pink',
            hex: '#D4A9A1',
            image: '',
          },
        ],
      },
    });

    console.log('Updated color-picker block with 9 color swatches');

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

seedColorPicker();
