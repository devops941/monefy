const express = require('express');
const expenseController = require('../controllers/expenseController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/api/expenses', auth, expenseController.getAllExpenses);
router.post('/api/expenses', auth, expenseController.createExpense);
router.put('/api/expenses/:id', auth, expenseController.updateExpense);
router.delete('/api/expenses/:id', auth, expenseController.deleteExpense);

module.exports = router;
