// ============================================================
// controllers/handlers.js  —  All business logic with DATABASE
// Project 3: MongoDB Integration
// ============================================================

// Import Database Models
const Menu = require('../models/Menu');
const Order = require('../models/Order');
const Contact = require('../models/Contact');
const Subscriber = require('../models/Subscriber');

// ============================================================
// Response Helpers
// ============================================================
const sendSuccess = (res, statusCode, message, data = null) => {
    const response = {
        success: true,
        message: message,
        timestamp: new Date().toISOString()
    };
    if (data !== null) response.data = data;
    res.status(statusCode).json(response);
};

const sendError = (res, statusCode, message, errors = null) => {
    const response = {
        success: false,
        message: message,
        timestamp: new Date().toISOString()
    };
    if (errors !== null) response.errors = errors;
    res.status(statusCode).json(response);
};

// ============================================================
// MENU Endpoints (READ from Database)
// ============================================================

// GET /api/menu — Fetch all menu items
const getAllMenuItems = async (req, res) => {
    try {
        const menuItems = await Menu.find().sort({ id: 1 });
        
        sendSuccess(res, 200, `${menuItems.length} menu item(s) fetched successfully.`, {
            count: menuItems.length,
            items: menuItems
        });
    } catch (error) {
        console.error('getAllMenuItems Error:', error);
        sendError(res, 500, 'Server error while fetching menu.');
    }
};

// GET /api/menu/:id — Fetch single menu item
const getMenuItemById = async (req, res) => {
    try {
        const itemId = req.params.id.toUpperCase();
        const item = await Menu.findOne({ id: itemId });
        
        if (!item) {
            return sendError(res, 404, `No menu item found with ID "${req.params.id}".`);
        }
        
        sendSuccess(res, 200, 'Menu item fetched successfully.', item);
    } catch (error) {
        console.error('getMenuItemById Error:', error);
        sendError(res, 500, 'Server error while fetching menu item.');
    }
};

// ============================================================
// ORDERS Endpoints (CRUD with Database)
// ============================================================

// POST /api/orders — Place a new order
const placeOrder = async (req, res) => {
    try {
        const { itemId, quantity, customerName, customerEmail, specialInstructions } = req.body;
        
        // Validation
        const validationErrors = [];
        
        if (!itemId) validationErrors.push("itemId is required");
        if (!quantity || quantity < 1) validationErrors.push("Quantity must be at least 1");
        if (quantity > 20) validationErrors.push("Quantity cannot exceed 20");
        if (!customerName || customerName.trim().length < 2) validationErrors.push("Customer name must be at least 2 characters");
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!customerEmail || !emailRegex.test(customerEmail)) validationErrors.push("Valid email address is required");
        
        if (validationErrors.length > 0) {
            return sendError(res, 400, "Validation failed", validationErrors);
        }
        
        // Find menu item from Database
        const menuItem = await Menu.findOne({ id: String(itemId).toUpperCase() });
        
        if (!menuItem) {
            return sendError(res, 404, `Menu item "${itemId}" not found.`);
        }
        
        if (!menuItem.available) {
            return sendError(res, 400, `"${menuItem.name}" is currently unavailable.`);
        }
        
        const qty = parseInt(quantity, 10);
        const totalPrice = menuItem.price * qty;
        
        // Save to Database
        const newOrder = await Order.create({
            orderId: Date.now(),
            itemId: menuItem.id,
            itemName: menuItem.name,
            quantity: qty,
            unitPrice: menuItem.price,
            total: totalPrice,
            customerName: customerName.trim(),
            customerEmail: customerEmail.trim().toLowerCase(),
            specialInstructions: specialInstructions ? specialInstructions.trim() : null,
            status: 'pending'
        });
        
        console.log(`🛒 Order saved to DB: #${newOrder.orderId} - ${newOrder.customerName} (${newOrder.itemName} x${newOrder.quantity})`);
        
        sendSuccess(res, 201, `Order placed! Your ${menuItem.name} is being prepared. ☕`, newOrder);
        
    } catch (error) {
        console.error('placeOrder Error:', error);
        sendError(res, 500, 'Server error while placing order.');
    }
};

// GET /api/orders — Fetch all orders
const getAllOrders = async (req, res) => {
    try {
        const { status, email } = req.query;
        let filter = {};
        
        if (status) filter.status = status;
        if (email) filter.customerEmail = email.toLowerCase();
        
        const orders = await Order.find(filter).sort({ createdAt: -1 });
        
        sendSuccess(res, 200, `${orders.length} order(s) fetched.`, {
            count: orders.length,
            orders: orders
        });
    } catch (error) {
        console.error('getAllOrders Error:', error);
        sendError(res, 500, 'Server error while fetching orders.');
    }
};

// GET /api/orders/:orderId — Fetch single order
const getOrderById = async (req, res) => {
    try {
        const orderId = parseInt(req.params.orderId);
        const order = await Order.findOne({ orderId: orderId });
        
        if (!order) {
            return sendError(res, 404, `Order with ID ${orderId} not found.`);
        }
        
        sendSuccess(res, 200, 'Order fetched successfully.', order);
    } catch (error) {
        console.error('getOrderById Error:', error);
        sendError(res, 500, 'Server error while fetching order.');
    }
};

// ============================================================
// CONTACT Endpoints (Save to Database)
// ============================================================

// POST /api/contact — Submit contact form
const submitContact = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;
        
        // Validation
        const validationErrors = [];
        
        if (!name || name.trim().length < 2) {
            validationErrors.push("Name must be at least 2 characters");
        } else if (name.length > 50) {
            validationErrors.push("Name cannot exceed 50 characters");
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            validationErrors.push("Valid email address is required");
        }
        
        if (!message || message.trim().length < 10) {
            validationErrors.push("Message must be at least 10 characters");
        } else if (message.length > 500) {
            validationErrors.push("Message cannot exceed 500 characters");
        }
        
        if (validationErrors.length > 0) {
            return sendError(res, 400, "Validation failed", validationErrors);
        }
        
        // Save to Database
        const newContact = await Contact.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone ? phone.trim() : null,
            subject: subject || 'general',
            message: message.trim()
        });
        
        console.log(`📩 Contact saved to DB: ${newContact.name} (${newContact.email})`);
        
        sendSuccess(res, 201, "Thanks for reaching out! We'll reply within 24 hours. ☕", {
            id: newContact._id,
            name: newContact.name,
            email: newContact.email,
            createdAt: newContact.createdAt
        });
        
    } catch (error) {
        console.error('submitContact Error:', error);
        sendError(res, 500, 'Server error while submitting contact form.');
    }
};

// GET /api/contact/submissions — Fetch all contact submissions
const getContactSubmissions = async (req, res) => {
    try {
        const submissions = await Contact.find().sort({ createdAt: -1 });
        
        sendSuccess(res, 200, `${submissions.length} submission(s) fetched.`, {
            count: submissions.length,
            submissions: submissions
        });
    } catch (error) {
        console.error('getContactSubmissions Error:', error);
        sendError(res, 500, 'Server error while fetching submissions.');
    }
};

// ============================================================
// NEWSLETTER Endpoints (Save to Database)
// ============================================================

// POST /api/subscribe — Subscribe to newsletter
const subscribe = async (req, res) => {
    try {
        const { email } = req.body;
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return sendError(res, 400, "Valid email address is required");
        }
        
        const normalizedEmail = email.trim().toLowerCase();
        
        // Check if already subscribed
        const existing = await Subscriber.findOne({ email: normalizedEmail });
        if (existing) {
            return sendError(res, 409, "This email is already subscribed to our newsletter.");
        }
        
        // Save to Database
        const newSubscriber = await Subscriber.create({ email: normalizedEmail });
        
        console.log(`📬 Newsletter: ${normalizedEmail} subscribed to DB`);
        
        sendSuccess(res, 201, "You're subscribed! Welcome to the Ember & Bean family. 🌿", {
            email: newSubscriber.email,
            subscribedAt: newSubscriber.subscribedAt
        });
        
    } catch (error) {
        console.error('subscribe Error:', error);
        sendError(res, 500, 'Server error while processing subscription.');
    }
};

// GET /api/subscribers — Fetch all subscribers (admin)
const getAllSubscribers = async (req, res) => {
    try {
        const subscribers = await Subscriber.find().sort({ subscribedAt: -1 });
        
        sendSuccess(res, 200, `${subscribers.length} subscriber(s) fetched.`, {
            count: subscribers.length,
            subscribers: subscribers
        });
    } catch (error) {
        console.error('getAllSubscribers Error:', error);
        sendError(res, 500, 'Server error while fetching subscribers.');
    }
};

// ============================================================
// HEALTH CHECK
// ============================================================

// GET /api/health — Server health check
const healthCheck = async (req, res) => {
    try {
        const menuCount = await Menu.countDocuments();
        sendSuccess(res, 200, "Ember & Bean API is running! ☕", {
            uptime: process.uptime(),
            database: "connected",
            menuItems: menuCount,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        sendError(res, 500, "API is running but database connection issue", {
            database: "disconnected"
        });
    }
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
    // Menu
    getAllMenuItems,
    getMenuItemById,
    
    // Orders
    placeOrder,
    getAllOrders,
    getOrderById,
    
    // Contact
    submitContact,
    getContactSubmissions,
    
    // Newsletter
    subscribe,
    getAllSubscribers,
    
    // Health
    
    healthCheck
};