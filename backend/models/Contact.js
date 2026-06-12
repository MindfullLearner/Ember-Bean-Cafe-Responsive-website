// ============================================================
// models/Contact.js  —  Contact Submission Schema
// Defines the structure of a contact form submission
// ============================================================

const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: {
      type:      String,
      required:  [true, 'Name is required'],
      trim:      true,
      minlength: [2,  'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters']
    },

    email: {
      type:     String,
      required: [true, 'Email is required'],
      trim:     true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
        'Please provide a valid email address'
      ]
    },

    phone: {
      type:    String,
      trim:    true,
      default: null,
      match: [
        /^[+]?[\d\s\-().]{7,15}$/,
        'Please provide a valid phone number'
      ]
    },

    subject: {
      type:    String,
      default: 'other',
      enum: {
        values:  ['reservation', 'custom-order', 'catering', 'feedback', 'other'],
        message: '{VALUE} is not a valid subject'
      }
    },

    message: {
      type:      String,
      required:  [true, 'Message is required'],
      trim:      true,
      minlength: [10,  'Message must be at least 10 characters'],
      maxlength: [500, 'Message cannot exceed 500 characters']
    },

    // Track if this submission has been read/actioned
    isRead: {
      type:    Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON:   { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index for filtering unread submissions
contactSchema.index({ isRead: 1 });
contactSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Contact', contactSchema);
