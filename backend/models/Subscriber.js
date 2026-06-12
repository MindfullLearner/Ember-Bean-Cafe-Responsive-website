// ============================================================
// models/Subscriber.js  —  Newsletter Subscriber Schema
// Defines the structure of a newsletter subscriber
// ============================================================

const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type:     String,
      required: [true, 'Email is required'],
      unique:   true,          // prevents duplicate subscriptions at DB level
      trim:     true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
        'Please provide a valid email address'
      ]
    },

    // Allow subscribers to unsubscribe without deleting the record
    isActive: {
      type:    Boolean,
      default: true
    }
  },
  {
    timestamps: true,   // subscribedAt = createdAt
    toJSON:   { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual field so API response says "subscribedAt" not "createdAt"
subscriberSchema.virtual('subscribedAt').get(function () {
  return this.createdAt;
});

module.exports = mongoose.model('Subscriber', subscriberSchema);
