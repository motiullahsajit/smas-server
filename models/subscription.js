const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    userId: String,
    name: String,
    email: String,
    amount: Number,
    bkashNo: String,
    hasResponded: {
      type: Boolean,
      default: false,
    },
  }
);

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;