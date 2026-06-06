// ============================================================
// routes/api.js  —  Thin route definitions only
// ============================================================

const express  = require('express');
const router   = express.Router();
const h        = require('../controllers/handlers');
const { validateContact, validateOrder, validateSubscribe } = require('../middleware/validation');

// ---- Health check ------------------------------------------
// GET /api/health
router.get('/health', (req, res) => {
  res.status(200).json({
    success:   true,
    message:   '☕ Ember & Bean API is running!',
    version:   '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET  /api/health',
      'GET  /api/menu',
      'GET  /api/menu/:id',
      'POST /api/orders',
      'GET  /api/orders',
      'POST /api/contact',
      'GET  /api/contact/submissions',
      'POST /api/subscribe'
    ]
  });
});

// ---- Menu --------------------------------------------------
router.get('/menu',     h.getAllMenuItems);
router.get('/menu/:id', h.getMenuItemById);

// ---- Orders ------------------------------------------------
router.post('/orders', validateOrder,   h.placeOrder);
router.get ('/orders',                  h.getAllOrders);

// ---- Contact -----------------------------------------------
router.post('/contact',              validateContact, h.submitContact);
router.get ('/contact/submissions',                   h.getContactSubmissions);

// ---- Newsletter --------------------------------------------
router.post('/subscribe', validateSubscribe, h.subscribe);

// ---- Catch-all unknown /api/* routes -----------------------
router.use((req, res) => {
  res.status(404).json({
    success:   false,
    message:   `Route ${req.method} /api${req.path} not found.`,
    hint:      'Visit GET /api/health for all available endpoints.',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
