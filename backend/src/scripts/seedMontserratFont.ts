import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Page from '../models/Page';

dotenv.config({ path: '.env.local' });

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/vlxd';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  const result = await Page.updateMany(
    {},
    { $set: { displayFont: 'Montserrat', bodyFont: 'Montserrat' } },
  );

  console.log(`Updated ${result.modifiedCount} pages to use Montserrat for both display and body fonts`);

  await mongoose.disconnect();
  console.log('Done');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
