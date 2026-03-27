/**
 * Migration: Convert navbar manual links → Menu collection + menuHandle reference.
 *
 * 1. Reads all navbar blocks that have data.links
 * 2. Creates a "Main Navigation" menu from the first navbar's links
 * 3. Sets menuHandle on all navbar blocks
 * 4. Removes the old links array
 * 5. Regenerates all page JSONs
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Block from '../models/Block';
import Menu from '../models/Menu';
import Theme from '../models/Theme';
import Page from '../models/Page';
import { config } from '../config/env';
import { generatePageJson, writePageJson } from '../utils/generatePageJson';

dotenv.config();

const MENU_HANDLE = 'main-navigation';

async function migrate() {
  await mongoose.connect(config.mongodbUri);
  console.log('Connected to MongoDB\n');

  // Check if menu already exists
  const existing = await Menu.findOne({ handle: MENU_HANDLE });
  if (existing) {
    console.log(`Menu "${MENU_HANDLE}" already exists — skipping creation.`);
  } else {
    // Find the first navbar block with links
    const navbarBlock = await Block.findOne({ type: 'navbar', 'data.links.0': { $exists: true } }).lean();

    if (!navbarBlock) {
      console.log('No navbar block with links found. Creating empty menu.');
      await Menu.create({
        name: 'Main Navigation',
        handle: MENU_HANDLE,
        items: [],
      });
    } else {
      const links = (navbarBlock as any).data.links || [];
      console.log(`Found navbar with ${links.length} links. Creating menu...`);

      const items = links.map((link: any, i: number) => ({
        label: link.label,
        url: link.href,
        order: i,
      }));

      await Menu.create({
        name: 'Main Navigation',
        handle: MENU_HANDLE,
        items,
      });

      console.log(`Created menu "${MENU_HANDLE}" with ${items.length} items:`);
      items.forEach((item: any) => console.log(`  ${item.label} → ${item.url}`));
    }
  }

  // Update all navbar blocks: set menuHandle, remove links
  const result = await Block.updateMany(
    { type: 'navbar' },
    {
      $set: { 'data.menuHandle': MENU_HANDLE },
      $unset: { 'data.links': '' },
    }
  );
  console.log(`\nUpdated ${result.modifiedCount} navbar block(s): set menuHandle, removed links.`);

  // Regenerate all page JSONs
  const pages = await Page.find({}).populate('blocks.block').lean();
  for (const page of pages) {
    const json = generatePageJson(page as any);
    writePageJson((page as any).slug, json);
  }
  console.log(`Regenerated ${pages.length} page JSON files.`);

  await mongoose.disconnect();
  console.log('\nDone!');
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
