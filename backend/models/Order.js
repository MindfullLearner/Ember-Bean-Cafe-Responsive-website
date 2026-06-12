// ============================================================
// models/Order.js  —  Order Schema
// Defines the structure of a customer order in MongoDB
// ============================================================

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    // Menu item reference (stores the string ID like "EB001")
    itemId: {
      type:     String,
      required: [true, 'Item ID is required'],
      trim:     true,
      uppercase: true
    },

    itemName: {
      type:     String,
      required: [true, 'Item name is required'],
      trim:     true
    },

    itemIcon: {
      type:    String,
      default: '☕'
    },

    quantity: {
      type:     Number,
      required: [true, 'Quantity is required'],
      min:      [1,  'Quantity must be at least 1'],
      max:      [20, 'Quantity cannot exceed 20'],
      validate: {
        validator: Number.isInteger,
        message:   'Quantity must be a whole number'
      }
    },

    unitPrice: {
      type:     Number,
      required: [true, 'Unit price is required'],
      min:      [0, 'Price cannot be negative']
    },

    totalPrice: {
      type:     Number,
      required: [true, 'Total price is required'],
      min:      [0, 'Total price cannot be negative']
    },

    customerName: {
      type:      String,
      required:  [true, 'Customer name is required'],
      trim:      true,
      minlength: [2,  'Name must be at least 2 characters'],
      maxlength: [80, 'Name cannot exceed 80 characters']
    },

    customerEmail: {
      type:     String,
      required: [true, 'Customer email is required'],
      trim:     true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
        'Please provide a valid email address'
      ]
    },

    specialInstructions: {
      type:      String,
      trim:      true,
      maxlength: [200, 'Special instructions cannot exceed 200 characters'],
      default:   null
    },

    status: {
      type:    String,
      default: 'received',
      enum: {
        values:  ['received', 'preparing', 'ready', 'delivered', 'cancelled'],
        message: '{VALUE} is not a valid order status'
      }
    }
  },
  {
    timestamps: true,   // adds createdAt and updatedAt automatically
    toJSON:   { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for common query patterns
orderSchema.index({ customerEmail: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });  // newest first

module.exports = mongoose.model('Order', orderSchema);
