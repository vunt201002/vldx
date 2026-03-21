import cron from 'node-cron';
import Page from '../models/Page';
import { generatePageJson, writePageJson } from './generatePageJson';

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

    console.info(`[sync] Regenerated ${pages.length} page JSON files at ${new Date().toLocaleString()}`);
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
