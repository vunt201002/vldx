/**
 * Seed: Update why-choose-us icons on service page
 *
 * Run: npm run seed:why-icons
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Block from '../models/Block';
import { config } from '../config/env';
import { regenerateAllPageJsons } from '../utils/syncPageJsons';

dotenv.config();

const BLOCK_ID = '69c6b1ad951275f6c3356a6e';

const ICONS = [
  '/icons/why-consultation.svg',
  '/icons/why-delivery.svg',
  '/icons/why-authentic.svg',
  '/icons/why-aftersales.svg',
];

async function seed() {
  await mongoose.connect(config.mongodbUri);
  console.log('Connected to MongoDB\n');

  const block = await Block.findById(BLOCK_ID);
  if (!block) {
    console.error('why-choose-us block not found!');
    process.exit(1);
  }

  console.log(`Found block: ${block.name} (${block.type})`);
  console.log(`Steps count: ${block.data.steps?.length || 0}\n`);

  const steps = block.data.steps || [];
  for (let i = 0; i < steps.length && i < ICONS.length; i++) {
    steps[i].icon = ICONS[i];
    console.log(`  Step ${i + 1}: "${steps[i].title}" → ${ICONS[i]}`);
  }

  block.markModified('data');
  await block.save();
  console.log('\n✓ Icons updated\n');

  console.log('Regenerating page JSONs...');
  await regenerateAllPageJsons();

  await mongoose.disconnect();
  console.log('Done!');
}

seed().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
