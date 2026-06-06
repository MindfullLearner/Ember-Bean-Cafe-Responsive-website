// ============================================================
// server.js  —  Ember & Bean REST API entry point
// ============================================================

const express    = require('express');
const cors       = require('cors');
const path       = require('path');
const apiRoutes  = require('./routes/api');

const app  = express();
const PORT = process.env.PORT || 3000;

// ============================================================
// GLOBAL MIDDLEWARE
// ============================================================

// CORS — open in dev, lock to your domain in production
app.use(cors({
  origin:         '*',
  methods:        ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON bodies (reject payloads > 10 kb)
app.use(express.json({ limit: '10kb' }));

// Parse URL-encoded bodies (HTML form fallback)
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}]  ${req.method.padEnd(6)} ${req.originalUrl}`);
  next();
});

// ============================================================
// SERVE FRONTEND (API tester UI)
// ============================================================
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// ============================================================
// API ROUTES
// ============================================================
app.use('/api', apiRoutes);

// ============================================================
// SPA FALLBACK — serve index.html for all other routes
// ============================================================
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// ============================================================
// GLOBAL ERROR HANDLER
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
// START
// ============================================================
app.listen(PORT, () => {
  console.log('');
  console.log('  ☕  Ember & Bean API');
  console.log('  ─────────────────────────────────────────');
  console.log(`  🚀  Server      →  http://localhost:${PORT}`);
  console.log(`  📋  API base    →  http://localhost:${PORT}/api`);
  console.log(`  🩺  Health      →  http://localhost:${PORT}/api/health`);
  console.log(`  🖥️   UI Tester   →  http://localhost:${PORT}`);
  console.log('  ─────────────────────────────────────────');
  console.log('');
});

module.exports = app;
