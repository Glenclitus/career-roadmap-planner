require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    console.log('🔄 Connecting to MongoDB database...');
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error(`💥 Server startup aborted: MongoDB must be connected before accepting requests.`);
    process.exit(1);
  }
};

start();
