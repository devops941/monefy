const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  _id: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  color: { type: String, default: '#3563E9' },
  icon: { type: String, default: '📦' },
  isDefault: { type: Boolean, default: false },
  budget: { type: Number, default: 3000 },
  spent: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Category', categorySchema);
