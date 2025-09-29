// test-db-connection.js
const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB Atlas connection successful!');
    console.log('Connected to database:', mongoose.connection.db.databaseName);
    
    // Test basic operations
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ MongoDB Atlas connection failed:', error.message);
  }
};

testConnection();