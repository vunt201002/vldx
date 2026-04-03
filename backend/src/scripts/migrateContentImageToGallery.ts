import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Block from '../models/Block';

dotenv.config({ path: '.env.local' });

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/vlxd';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  const blocks = await Block.find({ type: 'content-image' });
  console.log(`Found ${blocks.length} content-image blocks`);

  let migrated = 0;

  for (const block of blocks) {
    const data = block.data || {};

    // Skip if already has images array
    if (data.images && data.images.length > 0) {
      console.log(`  Block ${block._id} "${block.name}" — already has images, skipping`);
      continue;
    }

    // Collect old images into new array
    const images: { url: string; alt: string }[] = [];
    if (data.squareImageUrl) {
      images.push({ url: data.squareImageUrl, alt: data.squareImageAlt || '' });
    }
    if (data.rectImageUrl) {
      images.push({ url: data.rectImageUrl, alt: data.rectImageAlt || '' });
    }

    if (images.length === 0) {
      console.log(`  Block ${block._id} "${block.name}" — no old images, skipping`);
      continue;
    }

    // Set new images array, keep squarePosition, remove old fields
    await Block.updateOne(
      { _id: block._id },
      {
        $set: {
          'data.images': images,
        },
        $unset: {
          'data.squareImageUrl': '',
          'data.squareImageAlt': '',
          'data.rectImageUrl': '',
          'data.rectImageAlt': '',
          'data.rectImageOrder': '',
        },
      },
    );

    console.log(`  Block ${block._id} "${block.name}" — migrated ${images.length} images`);
    migrated++;
  }

  console.log(`\nDone. Migrated ${migrated} blocks.`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
