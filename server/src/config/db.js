const mongoose = require('mongoose');
const dns = require('dns');

// Ensure SRV records for MongoDB Atlas resolve reliably on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // fallback to system resolver
}

// Connection event listeners for runtime monitoring
mongoose.connection.on('connected', () => {
  console.log(`✅ MongoDB Mongoose connected.`);
});

mongoose.connection.on('disconnected', () => {
  console.warn(`⚠️  MongoDB connection lost. Reconnecting...`);
});

mongoose.connection.on('error', (err) => {
  console.error(`❌ MongoDB connection event error: ${err.message}`);
});

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is missing in server/.env');
  }

  if (uri.includes('<db_password>')) {
    throw new Error('MONGODB_URI contains the placeholder <db_password>. Please update server/.env with your actual database password.');
  }

  const options = {
    serverSelectionTimeoutMS: 5000, // Fail fast after 5s rather than default 30s
  };

  try {
    const conn = await mongoose.connect(uri, options);
    console.log(`✅ MongoDB connected successfully to host: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    let helpMsg = error.message;
    if (error.name === 'MongooseServerSelectionError') {
      helpMsg += ' (Atlas Network Access: Ensure your current IP address is whitelisted on MongoDB Atlas, or add 0.0.0.0/0 to allow access from anywhere).';
    }
    console.error(`❌ MongoDB connection error: ${helpMsg}`);
    throw new Error(helpMsg);
  }
};

module.exports = connectDB;
