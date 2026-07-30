import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI environment variable is required'); process.exit(1); }

async function reset() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected. Dropping old data...');
  const collections = await mongoose.connection.db.listCollections().toArray();
  for (const col of collections) {
    await mongoose.connection.db.dropCollection(col.name);
    console.log(`Dropped: ${col.name}`);
  }
  await mongoose.disconnect();
  console.log('Done. Run seed again.');
}

reset().catch(e => { console.error(e); process.exit(1); });
