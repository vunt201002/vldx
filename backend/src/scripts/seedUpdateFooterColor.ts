import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Block from '../models/Block';
import Theme from '../models/Theme';
import { config } from '../config/env';

dotenv.config();

async function updateFooterColor() {
  await mongoose.connect(config.mongodbUri);
  console.log('Connected to MongoDB\n');

  const theme = await Theme.findOne({ isActive: true }).populate('footer.blocks.block').lean();
  if (!theme) {
    console.log('No active theme found.');
    await mongoose.disconnect();
    return;
  }

  for (const entry of (theme as any).footer.blocks) {
    const block = entry.block;
    if (!block || block.type !== 'footer') continue;

    await Block.findByIdAndUpdate(block._id, {
      $set: { 'data.bgColor': '#000000' },
    });
    console.log(`Updated footer block ${block._id} bgColor → #000000`);
  }

  await mongoose.disconnect();
  console.log('\nDone!');
}

updateFooterColor().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
