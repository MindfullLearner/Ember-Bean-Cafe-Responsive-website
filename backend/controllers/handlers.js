// ============================================================
// controllers/handlers.js  —  All business logic
// Routes stay thin; everything real happens here
// ============================================================

const { v4: uuidv4 } = require('uuid');
const fs   = require('fs');
const path = require('path');

// ---- Load menu at startup ----------------------------------
const MENU_PATH = path.join(__dirname, '../data/menu.json');
let menuItems = [];
try {
  menuItems = JSON.parse(fs.readFileSync(MENU_PATH, 'utf8'));
  console.log(`✅  Menu loaded: ${menuItems.length} items`);
} catch (e) {
  console.error('⚠️  Could not load menu.json:', e.message);
}

// ---- In-memory stores (swap for DB in production) ----------
const orders      = [];   // placed orders
const contacts    = [];   // contact form submissions
const subscribers = [];   // newsletter subscribers

// ---- Response helpers --------------------------------------
const ok = (res, code, message, data = null) => {
  const body = { success: true, message, timestamp: new Date().toISOString() };
  if (data !== null) body.data = data;
  return res.status(code).json(body);
};

const fail = (res, code, message, extra = {}) =>
  res.status(code).json({
    success: false,
    message,
    timestamp: new Date().toISOString(),
    ...extra
  });

// ============================================================
// MENU
// ============================================================

// GET /api/menu
// Optional query params: ?category=latte  ?available=true
const getAllMenuItems = (req, res) => {
  try {
    let result = [...menuItems];
    const { category, available } = req.query;

    if (category) result = result.filter(i => i.category === category.toLowerCase());
    if (available !== undefined) {
      const flag = available === 'true';
      result = result.filter(i => i.available === flag);
    }

    return ok(res, 200, `${result.length} menu item(s) fetched successfully.`, {
      count: result.length,
      items: result
    });
  } catch (err) {
    console.error('getAllMenuItems:', err);
    return fail(res, 500, 'Server error while fetching menu.');
  }
};

// GET /api/menu/:id
const getMenuItemById = (req, res) => {
  try {
    const item = menuItems.find(i => i.id === req.params.id.toUpperCase());
    if (!item) {
      return fail(res, 404, `No menu item found with ID "${req.params.id}".`, {
        hint: 'Valid IDs: ' + menuItems.map(i => i.id).join(', ')
      });
    }
    return ok(res, 200, 'Menu item fetched successfully.', item);
  } catch (err) {
    console.error('getMenuItemById:', err);
    return fail(res, 500, 'Server error.');
  }
};

// ============================================================
// ORDERS
// ============================================================

// POST /api/orders
const placeOrder = (req, res) => {
  try {
    const { itemId, quantity, customerName, customerEmail, specialInstructions } = req.body;

    // Verify item exists
    const menuItem = menuItems.find(i => i.id === String(itemId).toUpperCase());
    if (!menuItem) {
      return fail(res, 404, `Menu item "${itemId}" not found.`, {
        errors: { itemId: [`No menu item exists with ID "${itemId}".`] }
      });
    }
    if (!menuItem.available) {
      return fail(res, 400, `"${menuItem.name}" is currently unavailable.`, {
        errors: { itemId: ['This item is currently unavailable.'] }
      });
    }

    const qty        = parseInt(quantity, 10);
    const totalPrice = parseFloat((menuItem.price * qty).toFixed(2));

    const order = {
      id:                  uuidv4(),
      itemId:              menuItem.id,
      itemName:            menuItem.name,
      itemIcon:            menuItem.icon,
      quantity:            qty,
      unitPrice:           menuItem.price,
      totalPrice,
      customerName:        String(customerName).trim(),
      customerEmail:       String(customerEmail).trim().toLowerCase(),
      specialInstructions: specialInstructions ? String(specialInstructions).trim() : null,
      status:              'received',   // received → preparing → ready → delivered
      createdAt:           new Date().toISOString()
    };

    orders.push(order);
    console.log(`🛒  New order [${order.id}] — ${order.itemName} x${order.quantity} by ${order.customerName}`);

    return ok(res, 201, `Order placed! Your ${menuItem.name} is being prepared. ☕`, { order });
  } catch (err) {
    console.error('placeOrder:', err);
    return fail(res, 500, 'Server error while placing order.');
  }
};

// GET /api/orders
// Optional: ?status=received  ?email=x@y.com
const getAllOrders = (req, res) => {
  try {
    let result = [...orders];
    const { status, email } = req.query;

    if (status) result = result.filter(o => o.status === status);
    if (email)  result = result.filter(o => o.customerEmail === email.toLowerCase());

    // Newest first
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return ok(res, 200, `${result.length} order(s) fetched.`, { count: result.length, orders: result });
  } catch (err) {
    console.error('getAllOrders:', err);
    return fail(res, 500, 'Server error while fetching orders.');
  }
};

// ============================================================
// CONTACT
// ============================================================

// POST /api/contact
const submitContact = (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const submission = {
      id:        uuidv4(),
      name:      String(name).trim(),
      email:     String(email).trim().toLowerCase(),
      phone:     phone ? String(phone).trim() : null,
      subject:   subject || 'other',
      message:   String(message).trim(),
      createdAt: new Date().toISOString()
    };

    contacts.push(submission);
    console.log(`📩  Contact from ${submission.name} <${submission.email}>`);

    return ok(res, 201, "Thanks for reaching out! We'll reply within 24 hours. ☕", {
      submission: {
        id:        submission.id,
        name:      submission.name,
        email:     submission.email,
        subject:   submission.subject,
        createdAt: submission.createdAt
      }
    });
  } catch (err) {
    console.error('submitContact:', err);
    return fail(res, 500, 'Server error while submitting contact form.');
  }
};

// GET /api/contact/submissions  (bonus)
const getContactSubmissions = (req, res) => {
  try {
    const sorted = [...contacts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return ok(res, 200, `${sorted.length} submission(s) fetched.`, { count: sorted.length, submissions: sorted });
  } catch (err) {
    console.error('getContactSubmissions:', err);
    return fail(res, 500, 'Server error.');
  }
};

// ============================================================
// NEWSLETTER
// ============================================================

// POST /api/subscribe
const subscribe = (req, res) => {
  try {
    const email = String(req.body.email).trim().toLowerCase();

    // 409 Conflict — already subscribed
    if (subscribers.some(s => s.email === email)) {
      return fail(res, 409, 'This email is already subscribed to our newsletter.', {
        errors: { email: ['Already subscribed.'] }
      });
    }

    const subscriber = {
      id:           uuidv4(),
      email,
      subscribedAt: new Date().toISOString()
    };
    subscribers.push(subscriber);
    console.log(`📬  Newsletter: ${email} subscribed`);

    return ok(res, 201, "You're subscribed! Welcome to the Ember & Bean family. 🌿", {
      subscriber: { id: subscriber.id, email: subscriber.email, subscribedAt: subscriber.subscribedAt }
    });
  } catch (err) {
    console.error('subscribe:', err);
    return fail(res, 500, 'Server error while processing subscription.');
  }
};

module.exports = {
  getAllMenuItems, getMenuItemById,
  placeOrder, getAllOrders,
  submitContact, getContactSubmissions,
  subscribe
};
