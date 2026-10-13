const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const noteRoutes = require('./routes/noteRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userProfileRoutes = require('./routes/userProfileRoutes');
const billParseRoutes = require('./routes/billParseRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const DEFAULT_CATEGORIES = [
  { _id: 'cat_1',  name: 'Groceries',     icon: '🛒', color: '#3563E9', budget: 8000,  spent: 0, isDefault: true },
  { _id: 'cat_2',  name: 'Food & Dining', icon: '🍽️', color: '#F59E0B', budget: 6000,  spent: 0, isDefault: true },
  { _id: 'cat_3',  name: 'Transport',     icon: '🚗', color: '#06B6D4', budget: 4000,  spent: 0, isDefault: true },
  { _id: 'cat_4',  name: 'Shopping',      icon: '🛍️', color: '#EC4899', budget: 5000,  spent: 0, isDefault: true },
  { _id: 'cat_5',  name: 'Healthcare',    icon: '❤️', color: '#EF4444', budget: 3000,  spent: 0, isDefault: true },
  { _id: 'cat_6',  name: 'Utilities',     icon: '⚡', color: '#10B981', budget: 4500,  spent: 0, isDefault: true },
  { _id: 'cat_7',  name: 'Education',     icon: '📚', color: '#8B5CF6', budget: 3000,  spent: 0, isDefault: true },
  { _id: 'cat_8',  name: 'Entertainment', icon: '🎬', color: '#6366F1', budget: 3500,  spent: 0, isDefault: true },
  { _id: 'cat_9',  name: 'Personal Care', icon: '😊', color: '#14B8A6', budget: 2500,  spent: 0, isDefault: true },
  { _id: 'cat_10', name: 'Housing',       icon: '🏠', color: '#64748B', budget: 15000, spent: 0, isDefault: true },
  { _id: 'cat_11', name: 'Other',         icon: '📦', color: '#94A3B8', budget: 2000,  spent: 0, isDefault: true },
];

async function seedDefaultCategories() {
  const Category = require('./models/Category');
  for (const cat of DEFAULT_CATEGORIES) {
    await Category.findByIdAndUpdate(
      cat._id,
      { $setOnInsert: cat },
      { upsert: true, new: false }
    );
  }
  console.log('Default categories seeded');
}

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected successfully');
    await seedDefaultCategories();
  })
  .catch((err) => console.error('MongoDB connection error:', err));

app.use(noteRoutes);
app.use(expenseRoutes);
app.use(categoryRoutes);
app.use(userProfileRoutes);
app.use(billParseRoutes);
app.use(authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
