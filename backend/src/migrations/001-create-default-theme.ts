/**
 * Migration: Create Default Theme
 *
 * This script:
 * 1. Finds navbar and footer blocks from the landing page
 * 2. Creates a default theme with these blocks as header/footer
 * 3. Updates all navbar/footer blocks to have placement='header'/'footer'
 * 4. Removes navbar/footer blocks from all pages (they'll be in theme instead)
 * 5. Updates remaining page blocks to have placement='body'
 * 6. Regenerates all page JSON files with theme merging
 */

import mongoose from 'mongoose';
import Page from '../models/Page';
import Block from '../models/Block';
import Theme from '../models/Theme';
import Menu from '../models/Menu';
import { writePageJsonWithTheme } from '../utils/generatePageJson';
import { connectDB } from '../config/database';

async function migrate() {
  try {
    console.log('Starting migration: Create Default Theme...');

    // Connect to database
    await connectDB();

    // Step 1: Find the landing page
    const landingPage = await Page.findOne({ slug: 'landing' }).populate('blocks.block').lean();

    if (!landingPage) {
      console.error('Landing page not found!');
      process.exit(1);
    }

    console.log(`Found landing page with ${landingPage.blocks.length} blocks`);

    // Step 2: Identify navbar and footer blocks
    const sortedBlocks = [...landingPage.blocks].sort((a: any, b: any) => a.order - b.order);

    let navbarBlock = null;
    let footerBlock = null;

    for (const { block } of sortedBlocks) {
      const b = block as any;
      if (b.type === 'navbar' && !navbarBlock) {
        navbarBlock = b;
      }
      if (b.type === 'footer') {
        footerBlock = b;
      }
    }

    if (!navbarBlock) {
      console.error('No navbar block found in landing page!');
      process.exit(1);
    }

    if (!footerBlock) {
      console.error('No footer block found in landing page!');
      process.exit(1);
    }

    console.log('Found navbar block:', navbarBlock._id);
    console.log('Found footer block:', footerBlock._id);

    // Step 3: Update block placements
    await Block.updateOne({ _id: navbarBlock._id }, { placement: 'header' });
    await Block.updateOne({ _id: footerBlock._id }, { placement: 'footer' });
    console.log('Updated navbar and footer block placements');

    // Step 4: Create default menu from navbar links
    if (navbarBlock.data && navbarBlock.data.links) {
      const menuItems = navbarBlock.data.links.map((link: any, index: number) => ({
        label: link.label || '',
        url: link.href || '',
        order: index,
      }));

      const menu = await Menu.create({
        name: 'Main Navigation',
        handle: 'main-navigation',
        items: menuItems,
      });

      console.log('Created default menu:', menu._id);

      // Update navbar block to reference the menu
      navbarBlock.data.menuId = menu._id.toString();
      await Block.updateOne({ _id: navbarBlock._id }, { data: navbarBlock.data });
      console.log('Updated navbar block to reference menu');
    }

    // Step 5: Create default theme
    const theme = await Theme.create({
      name: 'Default Theme',
      isActive: true,
      header: {
        blocks: [
          {
            block: navbarBlock._id,
            order: 0,
          },
        ],
      },
      footer: {
        blocks: [
          {
            block: footerBlock._id,
            order: 0,
          },
        ],
      },
    });

    console.log('Created default theme:', theme._id);

    // Step 6: Remove navbar/footer from all pages
    const allPages = await Page.find();

    for (const page of allPages) {
      const bodyBlocks = page.blocks.filter((pb: any) => {
        const blockId = pb.block.toString();
        return blockId !== navbarBlock._id.toString() && blockId !== footerBlock._id.toString();
      });

      // Reorder body blocks
      page.blocks = bodyBlocks.map((pb: any, index: number) => ({
        block: pb.block,
        order: index,
      })) as any;

      await page.save();
      console.log(`Updated page ${page.slug}: removed header/footer, kept ${bodyBlocks.length} body blocks`);
    }

    // Step 7: Update all remaining blocks to have placement='body'
    const bodyBlockIds = (await Page.find().lean()).flatMap((p: any) =>
      p.blocks.map((pb: any) => pb.block)
    );

    await Block.updateMany(
      { _id: { $in: bodyBlockIds }, placement: { $exists: false } },
      { placement: 'body' }
    );

    console.log('Updated all body blocks with placement=body');

    // Step 8: Regenerate all page JSON files
    const pagesForJson = await Page.find().populate('blocks.block').lean();

    for (const page of pagesForJson) {
      await writePageJsonWithTheme(page.slug, page as any);
      console.log(`Regenerated JSON for ${page.slug}`);
    }

    console.log('\n✓ Migration completed successfully!');
    console.log('Summary:');
    console.log(`  - Created theme: ${theme.name}`);
    console.log(`  - Header blocks: ${theme.header.blocks.length}`);
    console.log(`  - Footer blocks: ${theme.footer.blocks.length}`);
    console.log(`  - Updated ${allPages.length} pages`);
    console.log(`  - Regenerated ${pagesForJson.length} JSON files`);

    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrate();
}

export default migrate;
