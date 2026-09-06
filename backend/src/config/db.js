const mongoose = require('mongoose');

// Connect to MongoDB using the provided URI (issue #2).
// Throws if no URI is supplied; exits the process on connection failure
// so a misconfigured server fails fast instead of running without a DB.
const connectDB = async (uri) => {
  if (!uri) {
    throw new Error('MONGO_URI is not defined');
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
