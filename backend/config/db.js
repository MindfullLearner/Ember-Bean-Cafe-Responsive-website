// ============================================================
// config/db.js  —  MongoDB Connection
// Connects to MongoDB using Mongoose
// ============================================================

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // These options prevent deprecation warnings
      // and ensure stable connections
    });

    console.log('');
    console.log(`  🍃  MongoDB Connected: ${conn.connection.host}`);
    console.log(`  📦  Database: ${conn.connection.name}`);
    console.log('');

  } catch (error) {
    console.error(`  ❌  MongoDB Connection Error: ${error.message}`);
    // Exit process with failure — app cannot run without DB
    process.exit(1);
  }
};

// Handle connection events after initial connect
mongoose.connection.on('disconnected', () => {
  console.warn('  ⚠️   MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('  ✅  MongoDB reconnected');
});

module.exports = connectDB;
