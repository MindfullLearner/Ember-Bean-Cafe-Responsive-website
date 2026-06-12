// ============================================================
// models/Menu.js  —  Menu Item Schema
// Defines the structure of a menu item in MongoDB
// ============================================================

const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema(
  {
    // Unique identifier used in API (e.g. "EB001")
    id: {
      type:     String,
      required: [true, 'Menu item ID is required'],
      unique:   true,
      trim:     true,
      uppercase: true
    },

    name: {
      type:      String,
      required:  [true, 'Menu item name is required'],
      trim:      true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },

    category: {
      type:     String,
      required: [true, 'Category is required'],
      trim:     true,
      lowercase: true,
      enum: {
        values:  ['espresso', 'latte', 'cappuccino', 'cold-brew', 'chai', 'flat-white', 'pastry'],
        message: '{VALUE} is not a valid category'
      }
    },

    price: {
      type:     Number,
      required: [true, 'Price is required'],
      min:      [0, 'Price cannot be negative']
    },

    description: {
      type:      String,
      trim:      true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default:   ''
    },

    icon: {
      type:    String,
      default: '☕'
    },

    available: {
      type:    Boolean,
      default: true
    },

    tags: {
      type:    [String],
      default: []
    }
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,

    // When converting to JSON, use virtual 'id' field
    toJSON:   { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index for fast category filtering
menuSchema.index({ category: 1 });
menuSchema.index({ available: 1 });

module.exports = mongoose.model('Menu', menuSchema);
