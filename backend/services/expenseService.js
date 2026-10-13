const Expense = require('../models/Expense');

const getAllExpenses = async (userId) => {
  return await Expense.find({ userId }).sort({ transactionDate: -1 });
};

const createExpense = async (data) => {
  const expense = new Expense(data);
  return await expense.save();
};

const updateExpense = async (id, userId, data) => {
  return await Expense.findOneAndUpdate({ _id: id, userId }, data, { new: true });
};

const deleteExpense = async (id, userId) => {
  return await Expense.findOneAndDelete({ _id: id, userId });
};

module.exports = { getAllExpenses, createExpense, updateExpense, deleteExpense };
