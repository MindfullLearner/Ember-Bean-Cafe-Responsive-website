// ============================================================
// server.js  —  Ember & Bean REST API Entry Point
// Updated for Project 3: MongoDB + dotenv support
// ============================================================

// Load environment variables FIRST — before any other imports
// This makes process.env.MONGODB_URI and process.env.PORT available
require('dotenv').config();

const express   = require('express');
const cors      = require('cors');
const path      = require('path');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');

const app  = express();
const PORT = process.env.PORT || 3000;

// ============================================================
// CONNECT TO MONGODB
// Must happen before we start accepting requests
// ============================================================
connectDB();

// ============================================================
// GLOBAL MIDDLEWARE
// ============================================================

// CORS — allow all origins in dev, restrict in production
app.use(cors({
  origin:         process.env.NODE_ENV === 'production'
                    ? 'https://yourdomain.com'   // lock down in production
                    : '*',
  methods:        ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse incoming JSON bodies (reject payloads > 10kb)
app.use(express.json({ limit: '10kb' }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Request logger (development only)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}]  ${req.method.padEnd(7)} ${req.originalUrl}`);
    next();
  });
}

// ============================================================
// SERVE FRONTEND STATIC FILES
// ============================================================
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// ============================================================
// API ROUTES
// ============================================================
app.use('/api', apiRoutes);

// ============================================================
// SPA FALLBACK — serve index.html for non-API routes
// ============================================================
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// ============================================================
// GLOBAL ERROR HANDLER
// Catches anything thrown inside route handlers
// ============================================================
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('💥 Unhandled error:', err.stack || err.message);

  // Malformed JSON body
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success:   false,
      message:   'Invalid JSON in request body.',
      timestamp: new Date().toISOString()
    });
  }

  res.status(500).json({
    success:   false,
    message:   'Something went wrong on our end. Please try again later.',
    timestamp: new Date().toISOString()
  });
});

// ============================================================
// START SERVER
// ============================================================
app.listen(PORT, () => {
  console.log('');
  console.log('  ☕  Ember & Bean API  v2.0');
  console.log('  ──────────────────────────────────────────');
  console.log(`  🚀  Server     →  http://localhost:${PORT}`);
  console.log(`  📋  API base   →  http://localhost:${PORT}/api`);
  console.log(`  🩺  Health     →  http://localhost:${PORT}/api/health`);
  console.log(`  🌍  Env        →  ${process.env.NODE_ENV || 'development'}`);
  console.log('  ──────────────────────────────────────────');
  console.log('');
});

module.exports = app;
