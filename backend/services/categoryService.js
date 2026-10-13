const { randomUUID } = require('crypto');
const Category = require('../models/Category');

const getAllCategories = async (userId) => {
  return await Category.find({
    $or: [{ userId }, { userId: { $exists: false } }, { userId: null }]
  }).sort({ name: 1 });
};

const createCategory = async (data) => {
  const catData = data._id ? data : { ...data, _id: randomUUID() };
  const category = new Category(catData);
  return await category.save();
};

const updateCategory = async (id, data) => {
  return await Category.findByIdAndUpdate(id, data, { new: true });
};

const deleteCategory = async (id) => {
  return await Category.findByIdAndDelete(id);
};

module.exports = { getAllCategories, createCategory, updateCategory, deleteCategory };
