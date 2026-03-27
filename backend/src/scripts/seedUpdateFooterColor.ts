import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Block from '../models/Block';
import Theme from '../models/Theme';
import { config } from '../config/env';

dotenv.config();

async function updateFooterColor() {
  await mongoose.connect(config.mongodbUri);
  console.log('Connected to MongoDB\n');

  const theme = await Theme.findOne({ isActive: true })
    .populate('header.blocks.block')
    .populate('footer.blocks.block')
    .lean();

  if (!theme) {
    console.log('No active theme found.');
    await mongoose.disconnect();
    return;
  }

  // Read navBgColor from the header navbar block
  const navbarBlock = (theme as any).header.blocks
    .map((e: any) => e.block)
    .find((b: any) => b?.type === 'navbar');

  const navBgColor: string = navbarBlock?.data?.navBgColor || '';
  console.log(`Navbar bgColor: ${navBgColor || '(not set — will clear footer bgColor)'}`);

  // Update all footer blocks
  for (const entry of (theme as any).footer.blocks) {
    const block = entry.block;
    if (!block || block.type !== 'footer') continue;

    const update: Record<string, any> = { 'data.textColor': '#000000' };
    if (navBgColor) {
      update['data.bgColor'] = navBgColor;
    } else {
      update['data.bgColor'] = '';
    }

    await Block.findByIdAndUpdate(block._id, { $set: update });
    console.log(`Updated footer block ${block._id}:`);
    console.log(`  bgColor  → ${update['data.bgColor'] || '(cleared)'}`);
    console.log(`  textColor → #000000`);
  }

  await mongoose.disconnect();
  console.log('\nDone!');
}

updateFooterColor().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
