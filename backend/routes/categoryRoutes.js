const express = require('express');
const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/api/categories', auth, categoryController.getAllCategories);
router.post('/api/categories', auth, categoryController.createCategory);
router.put('/api/categories/:id', auth, categoryController.updateCategory);
router.delete('/api/categories/:id', auth, categoryController.deleteCategory);

module.exports = router;
