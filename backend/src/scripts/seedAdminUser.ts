/**
 * Create the initial admin user.
 * Usage: npm run seed:admin
 *
 * Default credentials (change after first login):
 *   email: admin@vlxd.vn
 *   password: admin123
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import AdminUser from '../models/AdminUser';
import { config } from '../config/env';

dotenv.config();

const EMAIL = process.argv[2] || 'admin@vlxd.vn';
const PASSWORD = process.argv[3] || 'admin123';

async function seed() {
  await mongoose.connect(config.mongodbUri);
  console.log('Connected to MongoDB\n');

  const existing = await AdminUser.findOne({ email: EMAIL });
  if (existing) {
    console.log(`Admin user "${EMAIL}" already exists — skipping.`);
  } else {
    await AdminUser.create({ email: EMAIL, passwordHash: PASSWORD });
    console.log(`Created admin user:`);
    console.log(`  Email:    ${EMAIL}`);
    console.log(`  Password: ${PASSWORD}`);
    console.log(`\n  Change the password after first login!`);
  }

  await mongoose.disconnect();
  console.log('\nDone!');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
