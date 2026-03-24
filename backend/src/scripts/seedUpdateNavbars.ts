import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Block from '../models/Block';
import Page from '../models/Page';
import { config } from '../config/env';
import { generatePageJson, writePageJson } from '../utils/generatePageJson';

dotenv.config();

const NAV_LINKS = [
  { label: 'trang chủ', href: '/landing' },
  { label: 'tấm ốp cầu thang', href: '/tam-op-cau-thang' },
  { label: 'gạch ốp lát', href: '/gach-op-lat' },
  { label: 'ghế đá công viên', href: '/ghe-da-cong-vien' },
  { label: 'bàn', href: '/ban' },
  { label: 'thi công', href: '/service' },
];

async function seedUpdateNavbars() {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB');

    const pages = await Page.find({}).populate('blocks.block').lean();
    console.log(`Found ${pages.length} pages\n`);

    for (const page of pages) {
      const navbarEntry = (page as any).blocks.find(
        (b: any) => b.block?.type === 'navbar'
      );

      if (!navbarEntry) {
        console.log(`  [${page.slug}] No navbar block — skipping.`);
        continue;
      }

      await Block.findByIdAndUpdate(navbarEntry.block._id, {
        $set: { 'data.links': NAV_LINKS },
      });

      const fresh = await Page.findById(page._id).populate('blocks.block').lean();
      if (fresh) {
        const json = generatePageJson(fresh as any);
        writePageJson(page.slug, json);
      }

      console.log(`  [${page.slug}] Updated navbar + regenerated JSON`);
    }

    await mongoose.disconnect();
    console.log('\nDone!');
  } catch (err) {
    console.error('Failed:', err);
    process.exit(1);
  }
}

seedUpdateNavbars();
