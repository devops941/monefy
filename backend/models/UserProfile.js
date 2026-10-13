const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  name: { type: String, default: 'User' },
  monthlyIncome: { type: Number, default: 0 },
  defaultBudget: { type: Number, default: 35000 },
  currency: { type: String, default: '₹' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserProfile', userProfileSchema);
