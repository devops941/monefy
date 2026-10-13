const expenseService = require('../services/expenseService');

const getAllExpenses = async (req, res) => {
  try {
    const expenses = await expenseService.getAllExpenses(req.userId);
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
};

const createExpense = async (req, res) => {
  try {
    const expense = await expenseService.createExpense({ ...req.body, userId: req.userId });
    res.status(201).json(expense);
  } catch (error) {
    console.error('[create-expense] error:', error.message);
    res.status(500).json({ error: error.message || 'Failed to create expense' });
  }
};

const updateExpense = async (req, res) => {
  try {
    const expense = await expenseService.updateExpense(req.params.id, req.userId, req.body);
    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update expense' });
  }
};

const deleteExpense = async (req, res) => {
  try {
    await expenseService.deleteExpense(req.params.id, req.userId);
    res.json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete expense' });
  }
};

module.exports = { getAllExpenses, createExpense, updateExpense, deleteExpense };
