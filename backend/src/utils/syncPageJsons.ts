import cron from 'node-cron';
import Page from '../models/Page';
import { generatePageJson, writePageJson, writeThemeJson, writeBlogJson, writeProductsJson } from './generatePageJson';

/**
 * Regenerate all page JSON files from MongoDB.
 * Ensures JSON files match the database as source of truth.
 */
export async function regenerateAllPageJsons(): Promise<void> {
  try {
    const pages = await Page.find().populate('blocks.block').lean();

    for (const page of pages) {
      const json = generatePageJson(page as any);
      writePageJson(page.slug, json);
    }

    // Also generate static JSON files for static data mode
    await writeThemeJson();
    await writeBlogJson();
    await writeProductsJson();

    console.info(`[sync] Regenerated ${pages.length} page JSON files + static data at ${new Date().toLocaleString()}`);
  } catch (err) {
    console.error('[sync] Failed to regenerate page JSONs:', err);
  }
}

/**
 * Start the page JSON sync:
 * - Runs once on startup
 * - Scheduled daily at 3:30 AM via node-cron
 */
export function startPageJsonSync(): void {
  // Run on startup
  regenerateAllPageJsons();

  // Schedule: every day at 3:30 AM
  cron.schedule('30 3 * * *', () => {
    regenerateAllPageJsons();
  });

  console.info('[sync] Page JSON sync scheduled (daily at 3:30 AM)');
}
