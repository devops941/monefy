const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  merchantName: String,
  amount: { type: Number, required: true },
  categoryId: { type: String, required: true },
  transactionDate: { type: Date, default: Date.now },
  notes: String,
  billImageUri: String,
  items: [
    {
      itemName: String,
      quantity: Number,
      unitPrice: Number,
      amount: Number
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Expense', expenseSchema);
