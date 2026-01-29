// setup-mongodb.js
const { MongoClient } = require('mongodb');

async function setupMongoDB() {
  // Local MongoDB URI
  const uri = 'mongodb://localhost:27017/pastebin-lite';
  
  console.log('Connecting to MongoDB...');
  
  try {
    const client = new MongoClient(uri);
    await client.connect();
    
    // Create database and collection
    const db = client.db('pastebin-lite');
    const pastesCollection = db.collection('pastes');
    
    // Create index on slug field for faster lookups
    await pastesCollection.createIndex({ slug: 1 }, { unique: true });
    
    // Create TTL index for automatic expiry cleanup
    await pastesCollection.createIndex({ expiresAt: 1 }, { 
      expireAfterSeconds: 0 
    });
    
    console.log('✅ MongoDB setup complete!');
    console.log('✅ Database: pastebin-lite');
    console.log('✅ Collection: pastes');
    console.log('✅ Indexes created: slug (unique), expiresAt (TTL)');
    
    await client.close();
  } catch (error) {
    console.error('❌ MongoDB setup failed:', error.message);
    console.log('\n📝 To set up MongoDB locally:');
    console.log('1. Install MongoDB: https://www.mongodb.com/try/download/community');
    console.log('2. Start MongoDB service');
    console.log('3. Or use MongoDB Atlas (cloud) instead');
  }
}

setupMongoDB();