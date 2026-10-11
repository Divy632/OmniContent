const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai_content_platform';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500, // Quick fallback if local MongoDB isn't running
    });
    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    isConnected = false;
    console.warn(`[Database] Local MongoDB is not running (${error.message}).`);
    console.log(`[Database] Active: Embedded Persistent JSON Store enabled (Zero-setup local mode).`);
  }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected };
