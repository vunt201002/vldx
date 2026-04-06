/**
 * Fern Rebrand Migration
 *
 * Safely replaces old sandstone palette colors with new fern palette
 * in all Block documents stored in MongoDB.
 *
 * Safety:
 *  1. Backs up ALL blocks to a timestamped JSON file before any changes
 *  2. Logs every change (old → new) before writing
 *  3. Only touches blocks that actually contain old colors
 *  4. Regenerates page JSON files after updating
 *
 * Run:      npm run seed:fern-colors
 * Rollback: npm run seed:fern-colors:restore
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

// Color mapping — includes both original sandstone AND first-pass gray values
// so the script is idempotent (safe to re-run)
const COLOR_MAP: Record<string, string> = {
  // Core palette (original sandstone → fern)
  '#C4A882': '#9B997B',   '#c4a882': '#9B997B',
  '#8B7D6B': '#7A7866',   '#8b7d6b': '#7A7866',
  '#1A1714': '#1A1A17',   '#1a1714': '#1A1A17',
  '#6B5D4E': '#5E5C4D',   '#6b5d4e': '#5E5C4D',
  '#4A3F34': '#43413A',   '#4a3f34': '#43413A',
  '#2E2720': '#2B2A25',   '#2e2720': '#2B2A25',

  // Light shades — original AND first-pass gray → proper fern-tinted
  '#F5F0EB': '#EDF0E4',   '#f5f0eb': '#EDF0E4',   // cream
  '#F0EFE9': '#EDF0E4',   '#f0efe9': '#EDF0E4',   // fix first-pass gray
  '#E8E0D6': '#DDE1CE',   '#e8e0d6': '#DDE1CE',   // sand
  '#E2E1D6': '#DDE1CE',   '#e2e1d6': '#DDE1CE',   // fix first-pass gray
  '#D4C8B8': '#C8CCB6',   '#d4c8b8': '#C8CCB6',   // warm-300
  '#CCC9B8': '#C8CCB6',   '#ccc9b8': '#C8CCB6',   // fix first-pass gray

  // Nav/footer background
  '#f7e2ce': '#D9DFC8',                             // original peach → sage
  '#e8e9df': '#D9DFC8',                             // fix first-pass gray

  // Accent icon colors (why-choose-us)
  '#FFD580': '#D4CC8C',   '#ffd580': '#D4CC8C',
  '#A8E6CF': '#A8C9A0',   '#a8e6cf': '#A8C9A0',
  '#87CEEB': '#8CB8C4',   '#87ceeb': '#8CB8C4',
  '#F8B4C8': '#C4A8B0',   '#f8b4c8': '#C4A8B0',
};

/**
 * Deep-walk an object and replace color strings in-place.
 * Returns the list of changes made (for logging).
 */
function replaceColors(obj: any, path = ''): { path: string; old: string; new_: string }[] {
  const changes: { path: string; old: string; new_: string }[] = [];

  if (obj == null) return changes;

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      if (typeof obj[i] === 'string' && COLOR_MAP[obj[i]]) {
        changes.push({ path: `${path}[${i}]`, old: obj[i], new_: COLOR_MAP[obj[i]] });
        obj[i] = COLOR_MAP[obj[i]];
      } else if (typeof obj[i] === 'object') {
        changes.push(...replaceColors(obj[i], `${path}[${i}]`));
      }
    }
    return changes;
  }

  for (const key of Object.keys(obj)) {
    const val = obj[key];
    const fullPath = path ? `${path}.${key}` : key;

    if (typeof val === 'string' && COLOR_MAP[val]) {
      changes.push({ path: fullPath, old: val, new_: COLOR_MAP[val] });
      obj[key] = COLOR_MAP[val];
    } else if (typeof val === 'object' && val !== null) {
      changes.push(...replaceColors(val, fullPath));
    }
  }

  return changes;
}

// ─── BACKUP ────────────────────────────────────────────────────────────
async function backupBlocks(): Promise<string> {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  const blocks = await Block.find({}).lean();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filePath = path.join(BACKUP_DIR, `blocks-backup-${timestamp}.json`);

  fs.writeFileSync(filePath, JSON.stringify(blocks, null, 2), 'utf-8');
  console.log(`✓ Backup saved: ${filePath}`);
  console.log(`  ${blocks.length} blocks backed up.\n`);

  return filePath;
}

// ─── MIGRATE ───────────────────────────────────────────────────────────
async function seedFernColors() {
  await mongoose.connect(config.mongodbUri);
  console.log('Connected to MongoDB\n');

  // Step 1: Backup
  console.log('Step 1 — Backing up all blocks...');
  const backupFile = await backupBlocks();

  // Step 2: Find and replace colors
  console.log('Step 2 — Replacing colors...\n');
  const blocks = await Block.find({});
  let updatedCount = 0;

  for (const block of blocks) {
    const data = block.data as Record<string, any>;
    if (!data) continue;

    const changes = replaceColors(data);

    if (changes.length > 0) {
      updatedCount++;
      console.log(`Block ${block._id} (${block.type} — "${block.name || ''}"):`);
      for (const c of changes) {
        console.log(`  ${c.path}: ${c.old} → ${c.new_}`);
      }

      block.markModified('data');
      await block.save();
      console.log('  ✓ saved\n');
    }
  }

  console.log(`Updated ${updatedCount} / ${blocks.length} blocks.`);

  // Step 3: Regenerate page JSON files
  console.log('\nStep 3 — Regenerating page JSON files...');
  await regenerateAllPageJsons();

  await mongoose.disconnect();
  console.log(`\nDone! Backup at: ${backupFile}`);
  console.log('To rollback:  npm run seed:fern-colors:restore');
}

seedFernColors().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
