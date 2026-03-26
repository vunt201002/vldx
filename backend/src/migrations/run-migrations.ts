/**
 * Run all migrations in sequence
 */

import createDefaultTheme from './001-create-default-theme';
import migrateProducts from './002-migrate-products';

async function runAllMigrations() {
  console.log('='.repeat(60));
  console.log('Running all migrations...');
  console.log('='.repeat(60));

  try {
    // Migration 1: Create default theme
    console.log('\n[1/2] Creating default theme...');
    await createDefaultTheme();

    // Migration 2: Migrate products
    console.log('\n[2/2] Migrating products...');
    await migrateProducts();

    console.log('\n' + '='.repeat(60));
    console.log('All migrations completed successfully!');
    console.log('='.repeat(60));

    process.exit(0);
  } catch (error) {
    console.error('\n' + '='.repeat(60));
    console.error('Migration failed:', error);
    console.error('='.repeat(60));
    process.exit(1);
  }
}

runAllMigrations();
