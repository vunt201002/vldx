/**
 * Fern Rebrand — Rollback
 *
 * Restores all blocks from the latest backup created by seedFernColors.
 * Each block's `data` field is replaced with the backed-up version.
 *
 * Run:  npm run seed:fern-colors:restore
 */
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Block from '../models/Block';
import { config } from '../config/env';
import { regenerateAllPageJsons } from '../utils/syncPageJsons';

dotenv.config();

const BACKUP_DIR = path.join(__dirname, '..', '..', 'backups');

async function restoreBlocks() {
  // Find the latest backup file
  if (!fs.existsSync(BACKUP_DIR)) {
    console.error('No backups directory found. Nothing to restore.');
    process.exit(1);
  }

  const files = fs.readdirSync(BACKUP_DIR)
    .filter((f) => f.startsWith('blocks-backup-') && f.endsWith('.json'))
    .sort()
    .reverse();

  if (files.length === 0) {
    console.error('No backup files found. Nothing to restore.');
    process.exit(1);
  }

  const latestFile = path.join(BACKUP_DIR, files[0]);
  console.log(`Found ${files.length} backup(s). Restoring from latest:`);
  console.log(`  ${latestFile}\n`);

  const backupData = JSON.parse(fs.readFileSync(latestFile, 'utf-8')) as any[];
  console.log(`Backup contains ${backupData.length} blocks.\n`);

  await mongoose.connect(config.mongodbUri);
  console.log('Connected to MongoDB\n');

  let restoredCount = 0;

  for (const backup of backupData) {
    const block = await Block.findById(backup._id);
    if (!block) {
      console.log(`  ⚠ Block ${backup._id} not found in DB, skipping`);
      continue;
    }

    // Restore the data field
    block.data = backup.data;
    block.markModified('data');
    await block.save();
    restoredCount++;
  }

  console.log(`\nRestored ${restoredCount} / ${backupData.length} blocks.`);

  // Regenerate page JSON files
  console.log('\nRegenerating page JSON files...');
  await regenerateAllPageJsons();

  await mongoose.disconnect();
  console.log('\nRollback complete! Old colors are back.');
}

restoreBlocks().catch((err) => {
  console.error('Restore failed:', err);
  process.exit(1);
});
