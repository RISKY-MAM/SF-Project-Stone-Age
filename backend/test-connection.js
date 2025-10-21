// Simple MongoDB Connection Test
import { connectDB } from './config/db.js';
import 'dotenv/config';

console.log('🔍 Testing MongoDB Connection...');
console.log(`📋 Using URI: ${process.env.MONGODB_URI ? 'Found in .env' : 'Not found'}`);

connectDB()
  .then((connection) => {
    if (connection) {
      console.log('✅ MongoDB Connected Successfully!');
      console.log(`📊 Database: ${connection.connection.name}`);
      console.log(`🌐 Host: ${connection.connection.host}`);
      process.exit(0);
    } else {
      console.log('❌ Connection failed');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  });