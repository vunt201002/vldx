/**
 * Migration Script: Remove navbar and footer blocks from page bodies
 *
 * Since Phase 5 introduced global header/footer sections, pages should no longer
 * have navbar or footer blocks in their body. This script removes them.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Page from '../models/Page';
import Block from '../models/Block';
import { config } from '../config/env';
import { writePageJsonWithTheme } from '../utils/generatePageJson';

dotenv.config();

async function migratePageBlocks() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(config.mongodbUri);
    console.log('✅ Connected to MongoDB\n');

    // Ensure Block model is registered (prevent tree-shaking)
    await Block.countDocuments();

    // Find all pages with populated blocks
    const pages = await Page.find().populate('blocks.block');
    console.log(`📄 Found ${pages.length} pages to migrate\n`);

    let totalRemoved = 0;

    for (const page of pages) {
      console.log(`\n📝 Processing page: ${page.slug}`);
      console.log(`   Current blocks: ${page.blocks.length}`);

      const blocksToRemove: any[] = [];
      const blocksToKeep: any[] = [];

      // Separate blocks into keep/remove
      for (const pageBlock of page.blocks) {
        const block = pageBlock.block as any;

        if (!block) {
          console.log(`   ⚠️  Warning: Null block reference found, skipping`);
          continue;
        }

        if (block.type === 'navbar' || block.type === 'footer') {
          blocksToRemove.push({
            id: block._id,
            type: block.type,
            name: block.name
          });
        } else {
          blocksToKeep.push(pageBlock);
        }
      }

      if (blocksToRemove.length > 0) {
        console.log(`   🗑️  Removing ${blocksToRemove.length} block(s):`);
        blocksToRemove.forEach(b => {
          console.log(`      - ${b.type}: ${b.name}`);
        });

        // Update page with only non-navbar/footer blocks
        page.blocks = blocksToKeep;

        // Re-index order
        page.blocks.forEach((pb, index) => {
          pb.order = index;
        });

        await page.save();
        totalRemoved += blocksToRemove.length;

        // Regenerate page JSON file with theme merging
        try {
          const populated = await Page.findById(page._id).populate('blocks.block').lean();
          if (populated) {
            await writePageJsonWithTheme(page.slug, populated as any);
            console.log(`   ✅ Updated page and regenerated JSON`);
          }
        } catch (err: any) {
          console.log(`   ⚠️  Page updated but JSON regeneration failed: ${err.message}`);
        }
      } else {
        console.log(`   ✓ No navbar/footer blocks found, skipping`);
      }

      console.log(`   Final blocks: ${page.blocks.length}`);
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`✅ Migration complete!`);
    console.log(`   Total pages processed: ${pages.length}`);
    console.log(`   Total blocks removed: ${totalRemoved}`);
    console.log(`${'='.repeat(60)}\n`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run migration if called directly
if (require.main === module) {
  migratePageBlocks()
    .then(() => {
      console.log('\n✨ Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Migration failed:', error);
      process.exit(1);
    });
}

export { migratePageBlocks };
