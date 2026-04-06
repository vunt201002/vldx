/**
 * Migrate content-image blocks: move squareImageUrl → squareImages[]
 *
 * For each content-image block that has squareImageUrl but no squareImages,
 * moves the single image into the squareImages array.
 *
 * Run: npm run seed:migrate-square-images
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Block from '../models/Block';
import { config } from '../config/env';
import { regenerateAllPageJsons } from '../utils/syncPageJsons';

dotenv.config();

async function migrate() {
  await mongoose.connect(config.mongodbUri);
  console.log('Connected to MongoDB\n');

  const blocks = await Block.find({ type: 'content-image' });
  console.log(`Found ${blocks.length} content-image blocks.\n`);

  let migratedCount = 0;

  for (const block of blocks) {
    const data = block.data as Record<string, any>;
    if (!data) continue;

    // Skip if already has squareImages
    if (data.squareImages && data.squareImages.length > 0) {
      console.log(`Block ${block._id} — already has squareImages, skipping`);
      continue;
    }

    // Skip if no squareImageUrl
    if (!data.squareImageUrl) {
      console.log(`Block ${block._id} — no squareImageUrl, skipping`);
      continue;
    }

    // Migrate: move single image into the array
    data.squareImages = [
      { url: data.squareImageUrl, alt: data.squareImageAlt || '' },
    ];

    console.log(`Block ${block._id} ("${block.name || ''}"):`);
    console.log(`  squareImageUrl → squareImages[0]: ${data.squareImageUrl}`);

    block.markModified('data');
    await block.save();
    migratedCount++;
    console.log('  ✓ saved\n');
  }

  console.log(`Migrated ${migratedCount} / ${blocks.length} blocks.`);

  console.log('\nRegenerating page JSON files...');
  await regenerateAllPageJsons();

  await mongoose.disconnect();
  console.log('\nDone!');
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
