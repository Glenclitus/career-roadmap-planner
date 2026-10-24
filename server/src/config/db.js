const mongoose = require('mongoose');
const dns = require('dns');

// Ensure SRV records for MongoDB Atlas resolve reliably on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // fallback to system resolver
}

const connectDB = async () => {
  if (process.env.MONGODB_URI && process.env.MONGODB_URI.includes('<db_password>')) {
    console.warn('⚠️  MONGODB_URI still contains the placeholder <db_password>. Please replace it with your MongoDB user password in server/.env.');
    return;
  }
  let retries = 5;
  while (retries > 0) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI);
      console.log(`✅ MongoDB connected: ${conn.connection.host}`);
      break;
    } catch (error) {
      retries -= 1;
      console.error(`❌ MongoDB connection error: ${error.message}. Retries left: ${retries}`);
      if (retries === 0) break;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
};

module.exports = connectDB;
